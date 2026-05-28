/**
 * CHAIN OF RESPONSIBILITY PATTERN (React/JS Implementation)
 * Gestiunea cererilor de suport prin niveluri.
 * Pe frontend putem auto-rezolva problemele de nivel 1 (ex: FAQ), 
 * și escalada restul către backend (API).
 */

export class SupportHandler {
  setNext(handler) {
    this.nextHandler = handler;
    return handler;
  }

  async handle(ticket) {
    if (this.nextHandler) {
      return this.nextHandler.handle(ticket);
    }
    return { success: false, message: "Ticket could not be handled." };
  }
}

export class Level1Support extends SupportHandler {
  async handle(ticket) {
    if (ticket.issueType === 'Basic') {
      return { 
        success: true, 
        message: "Auto-Resolved by Frontend AI: Please check our FAQ section for general questions.", 
        resolvedBy: "Frontend Level 1" 
      };
    }
    if (ticket.issueType === 'Password Reset') {
      return { 
        success: true, 
        message: "Auto-Resolved by Frontend AI: A password reset link has been sent to your email.", 
        resolvedBy: "Frontend Level 1" 
      };
    }
    return super.handle(ticket);
  }
}

export class Level2Support extends SupportHandler {
  async handle(ticket) {

    try {
      const res = await fetch('http://localhost:5200/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket)
      });
      const data = await res.json();
      if (res.ok) {
        return {
          success: true,
          message: `Ticket #${data.id} registered on Backend.`,
          resolvedBy: data.resolvedBy
        };
      } else {
        return { success: false, message: data.error };
      }
    } catch (err) {
      return { success: false, message: "Network Error: Could not reach backend support." };
    }
  }
}

export const buildSupportChain = () => {
  const l1 = new Level1Support();
  const l2 = new Level2Support();
  l1.setNext(l2);
  return l1;
};

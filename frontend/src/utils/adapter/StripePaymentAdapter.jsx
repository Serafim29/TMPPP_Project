import React, { useState } from 'react';

/**
 * ADAPTER PATTERN (React Implementation)
 * Adaptează o interfață externă de plată (simulată ca Stripe API)
 * la interfața așteptată de aplicația noastră (PaymentForm).
 */

class ExternalStripeAPI {
  static async createCharge(cardNumber, expMonth, expYear, cvc, amount) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (cardNumber.startsWith('4')) {
          resolve({ status: 'succeeded', transactionId: 'txn_123456789' });
        } else {
          reject(new Error('Card declined by external processor'));
        }
      }, 1500);
    });
  }
}

export const usePaymentAdapter = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const processPayment = async (paymentDetails, amount) => {
    setIsProcessing(true);
    setError(null);
    try {
      const [month, year] = paymentDetails.expiry.split('/');
      
      const response = await ExternalStripeAPI.createCharge(
        paymentDetails.cardNumber.replace(/\s/g, ''),
        month,
        year,
        paymentDetails.cvv,
        amount
      );
      
      setIsProcessing(false);
      return { success: true, transactionId: response.transactionId };
    } catch (err) {
      setIsProcessing(false);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return { processPayment, isProcessing, error };
};

export const StripePaymentForm = ({ onSubmit, totalAmount }) => {
  const [details, setDetails] = useState({ cardNumber: '', expiry: '', cvv: '' });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Card Number (Start with 4 for success)</label>
        <div className="relative">
          <input 
            required 
            type="text" 
            value={details.cardNumber}
            onChange={e => setDetails({...details, cardNumber: e.target.value})}
            placeholder="0000 0000 0000 0000" 
            maxLength="19" 
            className="w-full px-4 py-3 pl-12 rounded-xl border border-neutral-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-[#fafafa] text-sm font-mono tracking-widest" 
          />
          <svg className="w-5 h-5 absolute left-4 top-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Expiry Date</label>
          <input 
            required 
            type="text" 
            value={details.expiry}
            onChange={e => setDetails({...details, expiry: e.target.value})}
            placeholder="MM/YY" 
            maxLength="5" 
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-[#fafafa] text-sm font-mono" 
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 mb-1.5">CVV</label>
          <input 
            required 
            type="text" 
            value={details.cvv}
            onChange={e => setDetails({...details, cvv: e.target.value})}
            placeholder="123" 
            maxLength="4" 
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-[#fafafa] text-sm font-mono" 
          />
        </div>
      </div>
    </div>
  );
};

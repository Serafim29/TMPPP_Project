import React, { useState, useEffect, useCallback } from 'react';

/**
 * MEDIATOR PATTERN (React Implementation)
 * Mediatorul controlează și coordonează interacțiunile dintre utilizatori (Customer și Agent)
 * într-o interfață de Chat. Niciun participant nu vorbește direct cu celălalt,
 * toți trimit mesaje prin Mediator.
 */

class ChatMediatorImpl {
  constructor() {
    this.users = [];
    this.messages = [];
    this.onMessageUpdate = null;
  }

  registerUser(user) {
    this.users.push(user);
    user.setMediator(this);
  }

  sendMessage(message, sender) {
    const newMessage = { sender: sender.name, text: message, timestamp: new Date() };
    this.messages.push(newMessage);
    
    if (this.onMessageUpdate) {
      this.onMessageUpdate([...this.messages]);
    }

    if (sender.role === 'Customer') {
      setTimeout(() => {
        const agent = this.users.find(u => u.role === 'Agent');
        if (agent) {
          agent.receiveMessage(message); 
          const reply = this.generateBotReply(message);
          
          this.messages.push({ sender: agent.name, text: reply, timestamp: new Date() });
          if (this.onMessageUpdate) {
            this.onMessageUpdate([...this.messages]);
          }
        }
      }, 1000);
    }
  }

  generateBotReply(msg) {
    const lower = msg.toLowerCase();
    if (lower.includes('order')) return 'I can help you check your order status. Please provide your order ID.';
    if (lower.includes('refund')) return 'Refunds take 3-5 business days to process.';
    return 'Thank you for reaching out. How else can I assist you today?';
  }
}

class ChatUser {
  constructor(name, role) {
    this.name = name;
    this.role = role;
    this.mediator = null;
  }
  setMediator(mediator) {
    this.mediator = mediator;
  }
  send(message) {
    this.mediator.sendMessage(message, this);
  }
  receiveMessage(message) {

  }
}

let mediatorInstance = null;
let customerUser = null;
let agentUser = null;

export const SupportChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    mediatorInstance = new ChatMediatorImpl();
    mediatorInstance.onMessageUpdate = (newMessages) => setMessages(newMessages);

    customerUser = new ChatUser('You', 'Customer');
    agentUser = new ChatUser('Support Bot', 'Agent');

    mediatorInstance.registerUser(customerUser);
    mediatorInstance.registerUser(agentUser);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    customerUser.send(inputValue);
    setInputValue('');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <div className="font-bold text-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          Live Support
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white hover:text-neutral-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 h-64 overflow-y-auto bg-[#fafafa] flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-xs text-center text-neutral-400 mt-10">Send a message to start chatting.</p>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] text-neutral-400 font-bold mb-1">{msg.sender}</span>
            <div className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] ${
              msg.sender === 'You' ? 'bg-black text-white rounded-br-none' : 'bg-white border border-neutral-200 text-black rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-neutral-100 bg-white flex gap-2">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-neutral-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
        />
        <button type="submit" className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-neutral-800 transition-colors">
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </form>
    </div>
  );
};

import React, { useState } from 'react';

/**
 * STATE PATTERN (React Implementation)
 * Gestiunea stării unei comenzi (New -> Paid -> Shipped) fără o cascadă uriașă de if-else.
 * Fiecare stare definește ce se randează vizual și ce acțiuni sunt permise.
 */

const OrderStates = {
  NEW: 'New',
  PAID: 'Paid',
  SHIPPED: 'Shipped'
};

const NewState = {
  name: OrderStates.NEW,
  progress: 25,
  color: 'bg-blue-500',
  message: 'Order placed, awaiting payment confirmation.',
  renderAction: (context) => (
    <button 
      onClick={() => context.transitionTo(PaidState)}
      className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-neutral-800"
    >
      Simulate Payment
    </button>
  )
};

const PaidState = {
  name: OrderStates.PAID,
  progress: 60,
  color: 'bg-yellow-500',
  message: 'Payment received. Preparing for shipment.',
  renderAction: (context) => (
    <button 
      onClick={() => context.transitionTo(ShippedState)}
      className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-neutral-800"
    >
      Simulate Shipping
    </button>
  )
};

const ShippedState = {
  name: OrderStates.SHIPPED,
  progress: 100,
  color: 'bg-green-500',
  message: 'Order shipped! It will arrive soon.',
  renderAction: (context) => (
    <span className="text-xs font-bold text-green-500 bg-green-50 px-3 py-1.5 rounded-lg">
      Completed
    </span>
  )
};

export const OrderTracker = ({ orderId, initialState = NewState }) => {
  const [currentState, setCurrentState] = useState(initialState);

  const context = {
    transitionTo: (newState) => {
      setCurrentState(newState);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm mb-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-sm text-black">Order #{orderId}</h4>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${currentState.color}`}>
          {currentState.name}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-neutral-100 rounded-full h-2 mb-4 overflow-hidden relative">
        <div 
          className={`h-2 rounded-full transition-all duration-700 ease-in-out ${currentState.color}`}
          style={{ width: `${currentState.progress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-xs text-neutral-500 font-medium">{currentState.message}</p>
        <div>
          {/* Aici starea își randează propria logică de UI */}
          {currentState.renderAction(context)}
        </div>
      </div>
    </div>
  );
};

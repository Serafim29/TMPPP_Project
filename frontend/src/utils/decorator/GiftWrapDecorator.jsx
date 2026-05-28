import React, { useState } from 'react';

/**
 * DECORATOR PATTERN (React Component Wrapper)
 * Adaugă dinamic responsabilități noi (Împachetare Cadou și Cost Extra)
 * peste un produs existent, fără a modifica structura de bază a produsului.
 */

export const GiftWrapDecorator = ({ product, children, onGiftWrapChange }) => {
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const giftWrapPrice = 5.00;

  const handleToggle = () => {
    const newValue = !isGiftWrapped;
    setIsGiftWrapped(newValue);
    
    if (onGiftWrapChange) {
      onGiftWrapChange(newValue ? giftWrapPrice : 0);
    }
  };

  return (
    <div className={`relative transition-all duration-300 ${isGiftWrapped ? 'p-4 bg-red-50/50 rounded-3xl border-2 border-red-200 shadow-inner' : ''}`}>
      {/* Element vizual adăugat de Decorator */}
      {isGiftWrapped && (
        <div className="absolute -top-4 -right-4 bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg rotate-12 z-20 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
        </div>
      )}
      
      {/* Componenta originală "decorată" */}
      {children}

      {/* Controlerul adăugat de Decorator */}
      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            onClick={handleToggle}
            className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${isGiftWrapped ? 'bg-red-500' : 'bg-neutral-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isGiftWrapped ? 'left-7' : 'left-1'}`}></div>
          </div>
          <div>
            <p className="text-sm font-bold text-black">Gift Wrapping</p>
            <p className="text-xs text-neutral-500 font-semibold">Make it special</p>
          </div>
        </div>
        <span className="font-bold text-sm text-black">+${giftWrapPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

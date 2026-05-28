import React, { createContext, useContext, useState } from 'react';

/**
 * STRATEGY PATTERN (React Implementation)
 * Permite schimbarea dinamică a strategiei de calculare a livrării.
 */

// Strategia 1: Livrare Standard
export const standardShipping = {
  name: 'Standard Shipping',
  calculate: (total) => total > 100 ? 0 : 15,
  estimatedDays: '3-5 business days',
};

// Strategia 2: Livrare Express
export const expressShipping = {
  name: 'Express Shipping',
  calculate: () => 30, // Cost fix
  estimatedDays: '1-2 business days',
};

// Componenta de UI pentru selectarea strategiei
export const ShippingStrategySelector = ({ selectedStrategy, onSelect }) => {
  return (
    <div className="space-y-3 mt-4">
      <div 
        onClick={() => onSelect(standardShipping)}
        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
          selectedStrategy.name === standardShipping.name 
            ? 'border-black bg-neutral-50' 
            : 'border-neutral-100 hover:border-neutral-300'
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="font-bold text-sm">Standard Shipping</span>
          <span className="text-sm font-semibold">{standardShipping.calculate(0) === 0 ? 'Free' : 'Calculated'}</span>
        </div>
        <p className="text-xs text-neutral-500 mt-1">Delivery in {standardShipping.estimatedDays}</p>
      </div>

      <div 
        onClick={() => onSelect(expressShipping)}
        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
          selectedStrategy.name === expressShipping.name 
            ? 'border-black bg-neutral-50' 
            : 'border-neutral-100 hover:border-neutral-300'
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="font-bold text-sm">Express Shipping</span>
          <span className="text-sm font-semibold">$30.00</span>
        </div>
        <p className="text-xs text-neutral-500 mt-1">Delivery in {expressShipping.estimatedDays}</p>
      </div>
    </div>
  );
};

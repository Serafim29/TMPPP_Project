import { useState, useCallback, useEffect } from 'react';

/**
 * COMMAND PATTERN (React Hook implementation)
 * Încapsulăm logica de adăugare/ștergere din coș în "comenzi".
 * Hook-ul gestionează istoricul comenzilor pentru a permite Undo.
 */

class CartCommand {
  constructor(cart, setCart, product) {
    this.cart = cart;
    this.setCart = setCart;
    this.product = product;
    this.previousState = [...cart];
  }

  execute() {
    throw new Error("Method 'execute()' must be implemented.");
  }

  undo() {
    this.setCart(this.previousState);
  }
}

class AddToCartCommand extends CartCommand {
  execute() {
    const newCart = [...this.cart];
    const cartItem = {
      ...this.product,
      selectedColor: this.product.colors ? this.product.colors[0] : null,
      selectedSize: this.product.sizes ? this.product.sizes[0] : null,
      quantity: 1
    };
    
    const existingIndex = newCart.findIndex(item => 
      item.id === cartItem.id && 
      item.selectedColor === cartItem.selectedColor && 
      item.selectedSize === cartItem.selectedSize
    );
    
    if (existingIndex >= 0) {
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newCart[existingIndex].quantity + 1
      };
    } else {
      newCart.push(cartItem);
    }
    
    this.setCart(newCart);
  }
}

class RemoveFromCartCommand extends CartCommand {
  execute() {
    const newCart = [...this.cart];
    const existingIndex = newCart.findIndex(item => 
      item.id === this.product.id
    );
    
    if (existingIndex >= 0) {
      if (newCart[existingIndex].quantity > 1) {
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity - 1
        };
      } else {
        newCart.splice(existingIndex, 1);
      }
    }
    
    this.setCart(newCart);
  }
}

export const useCartCommand = () => {
  const [cart, setCartState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });
  
  const [history, setHistory] = useState([]);

  const setCart = useCallback((newCart) => {
    setCartState(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  }, []);

  const executeCommand = useCallback((command) => {
    command.execute();
    setHistory(prev => [...prev, command]);
  }, []);

  const undoLastCommand = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const lastCommand = newHistory.pop();
      lastCommand.undo();
      localStorage.setItem('cart', JSON.stringify(lastCommand.previousState));
      setCartState(lastCommand.previousState);
      return newHistory;
    });
  }, []);

  const addToCart = useCallback((product) => {
    const command = new AddToCartCommand(cart, setCart, product);
    executeCommand(command);
  }, [cart, executeCommand, setCart]);

  const removeFromCart = useCallback((product) => {
    const command = new RemoveFromCartCommand(cart, setCart, product);
    executeCommand(command);
  }, [cart, executeCommand, setCart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    undoLastCommand,
    canUndo: history.length > 0,
    cartCount: cart.reduce((acc, item) => acc + (item.quantity || 1), 0)
  };
};

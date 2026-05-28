import { useCallback } from 'react';
import { useCartCommand } from '../command/useCartCommand';
import { useNotification } from '../observer/NotificationContext';
import { useNavigate } from 'react-router-dom';

/**
 * FACADE PATTERN (React Hook implementation)
 * Acest hook ascunde complexitatea interacțiunilor între Coș, Notificări și API,
 * oferind o interfață simplificată (addToCart, toggleFavorite, etc.) pentru UI.
 */
export const useEcommerceFacade = (user) => {
  const { cart, cartCount, addToCart: commandAddToCart, removeFromCart: commandRemoveFromCart, undoLastCommand, canUndo } = useCartCommand();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const handleAddToCart = useCallback((product, redirect = false) => {
    if (!user) {
      notify('You need to be logged in to add to cart', 'error');
      navigate('/login');
      return;
    }

    commandAddToCart(product);
    notify(`Added ${product.name} to cart!`, 'success');
    
    if (redirect) {
      navigate('/cart');
    }
  }, [user, commandAddToCart, notify, navigate]);

  const handleToggleFavorite = useCallback(async (product, favorites, setFavorites) => {
    if (!user) {
      notify('You need to be logged in to add to favorites', 'error');
      navigate('/login');
      return;
    }
    
    const token = localStorage.getItem('token');
    const existingIndex = favorites.findIndex(item => item.id === product.id);
    const newFavorites = [...favorites];
    
    if (existingIndex >= 0) {
      newFavorites.splice(existingIndex, 1);
      try {
        await fetch(`http://localhost:5001/api/favorites/${product.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        notify(`Removed ${product.name} from favorites`, 'error');
      } catch (err) { 
        console.error(err); 
      }
    } else {
      newFavorites.push(product);
      try {
        await fetch('http://localhost:5001/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ productId: product.id })
        });
        notify(`Added ${product.name} to favorites`, 'success');
      } catch (err) { 
        console.error(err); 
      }
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  }, [user, notify, navigate]);

  return {
    cart,
    cartCount,
    handleAddToCart,
    handleToggleFavorite,
    undoLastCartAction: undoLastCommand,
    canUndoCartAction: canUndo
  };
};

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const fetchFavorites = async (token) => {
    try {
      const response = await fetch('http://localhost:5001/api/favorites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('favorites', JSON.stringify(data));
        setFavoriteItems(data);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        setFavoriteItems(JSON.parse(storedFavorites));
      } catch (e) {
        console.error(e);
      }
    }
    
    fetchFavorites(token);
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((acc, item) => acc + (item.quantity || 1), 0));
  }, [navigate]);

  const removeFromFavorites = async (indexToRemove) => {
    const productToRemove = favoriteItems[indexToRemove];
    const updatedFavorites = favoriteItems.filter((_, idx) => idx !== indexToRemove);
    setFavoriteItems(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    
    const token = localStorage.getItem('token');
    if (token && productToRemove) {
      try {
        await fetch(`http://localhost:5001/api/favorites/${productToRemove.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) { console.error(err); }
    }
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = {
      ...product,
      selectedColor: product.colors ? product.colors[0] : null,
      selectedSize: product.sizes ? product.sizes[0] : null,
      quantity: 1
    };
    
    const existingIndex = cart.findIndex(item => item.id === cartItem.id && item.selectedColor === cartItem.selectedColor && item.selectedSize === cartItem.selectedSize);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setCartCount(cart.reduce((acc, item) => acc + (item.quantity || 1), 0));
    
    alert('Product added to cart!');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-black selection:text-white">
      {/* Simple Header */}
      <nav className="bg-white border-b border-neutral-100 py-4 px-6 md:px-12 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span className="font-extrabold text-xl tracking-tight text-black">TechStore</span>
          </div>
          <button onClick={() => navigate(-1)} className="text-sm font-bold text-neutral-500 hover:text-black">
            Continue Shopping
          </button>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        <h1 className="text-3xl font-extrabold text-black mb-8">Your Favorites</h1>
        
        {favoriteItems.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] text-center border border-neutral-100 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <h2 className="text-xl font-bold mb-2">No favorites yet</h2>
            <p className="text-neutral-500 mb-8">You haven't saved any items to your favorites. Explore our products and add some!</p>
            <button onClick={() => navigate('/')} className="px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-neutral-800 transition-colors">
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteItems.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-6 flex flex-col border border-neutral-100 shadow-sm relative group">
                <button 
                  onClick={() => removeFromFavorites(idx)}
                  className="absolute top-4 right-4 w-8 h-8 bg-neutral-50 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors z-10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div 
                  className="relative aspect-square rounded-[1.5rem] bg-[#f5f5f4] overflow-hidden p-4 flex items-center justify-center mb-4 cursor-pointer"
                  onClick={() => navigate(`/product/${item.realId}`, { state: { product: item } })}
                >
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1 block">{item.category}</span>
                    <h3 className="font-bold text-sm text-black line-clamp-2 mb-2">{item.name}</h3>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-extrabold text-lg text-black">
                      ${Number(item.displayPrice || item.price).toFixed(2)}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                      className="px-4 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;

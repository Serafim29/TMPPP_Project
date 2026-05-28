import React from 'react';
import { useNavigate } from 'react-router-dom';

const GenericProductCard = ({ product, handleToggleFavorite, handleAddToCart }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/product/${product.realId}`, { state: { product } })}
      className="group cursor-pointer flex flex-col"
    >
      <div className="relative aspect-square rounded-[2rem] bg-[#f2f2f2] overflow-hidden p-6 flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-[#e8e8e8]">
        <span className="absolute top-4 right-4 px-3 py-1 bg-white/80 backdrop-blur-sm text-[10px] font-bold text-neutral-600 rounded-full shadow-sm z-10">
          {product.category}
        </span>
        {product.originalPrice && (
          <span className="absolute bottom-4 right-4 px-2.5 py-1 bg-red-500 text-white text-[10px] font-black rounded-lg shadow-md z-10">
            REDUCERE
          </span>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); handleToggleFavorite(product); }}
          className="absolute top-4 left-4 w-8 h-8 bg-white/80 backdrop-blur-sm text-neutral-400 hover:text-red-500 rounded-full shadow-sm z-10 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="px-2">
        <div className="flex justify-between items-start mb-1 gap-4">
          <h3 className="font-bold text-base line-clamp-1">{product.name}</h3>
          <div className="flex flex-col items-end">
            {product.originalPrice && (
              <span className="font-bold text-xs text-neutral-400 line-through decoration-red-500 decoration-2">${Number(product.originalPrice).toFixed(2)}</span>
            )}
            <span className={`font-extrabold text-lg ${product.originalPrice ? 'text-red-600' : ''}`}>${Number(product.displayPrice).toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mb-5">
          <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <span className="text-xs font-semibold">{product.rating || '5.0'}</span>
          <span className="text-xs text-neutral-400">({product.reviews || 0} Reviews)</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); handleAddToCart(product, false); }}
            className="flex-1 py-3 border-2 border-neutral-200 hover:border-black rounded-full text-sm font-bold transition-colors active:scale-95"
          >
            Add to Cart
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleAddToCart(product, true); }}
            className="flex-1 py-3 bg-black text-white rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors active:scale-95"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

const ElectronicProductCard = (props) => {
  return (
    <div className="relative border-2 border-blue-500/20 rounded-[2.2rem] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 z-20"></div>
      <GenericProductCard {...props} />
    </div>
  );
};

const HomeProductCard = (props) => {
  return (
    <div className="relative border border-orange-200 rounded-[2.2rem] overflow-hidden bg-orange-50/30">
      <GenericProductCard {...props} />
    </div>
  );
};

/**
 * FACTORY PATTERN (React Component)
 * Construiește și returnează componenta UI corectă pe baza tipului de produs.
 * Acest design decuplează logica de afișare de lista principală.
 */
const ProductFactory = ({ product, handleToggleFavorite, handleAddToCart }) => {
  const category = product.category || 'Other';
  
  if (category === 'For Phone' || category === 'For Music') {
    return <ElectronicProductCard product={product} handleToggleFavorite={handleToggleFavorite} handleAddToCart={handleAddToCart} />;
  }
  
  if (category === 'For Home') {
    return <HomeProductCard product={product} handleToggleFavorite={handleToggleFavorite} handleAddToCart={handleAddToCart} />;
  }
  
  return <GenericProductCard product={product} handleToggleFavorite={handleToggleFavorite} handleAddToCart={handleAddToCart} />;
};

export default ProductFactory;

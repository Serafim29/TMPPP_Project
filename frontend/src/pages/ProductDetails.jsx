import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { GiftWrapDecorator } from '../utils/decorator/GiftWrapDecorator';
import { useEcommerceFacade } from '../utils/facade/useEcommerceFacade';

const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const CartIcon = ({ count = 0 }) => (
  <div className="relative">
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    {count > 0 && (
      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">{count}</span>
    )}
  </div>
);

const FavoritesIcon = ({ count = 0 }) => (
  <div className="relative">
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    {count > 0 && (
      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">{count}</span>
    )}
  </div>
);

const UserAvatar = ({ user }) => (
  <div className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
    {user ? (
      <span className="font-bold text-neutral-600 text-sm">{user.name.charAt(0)}</span>
    ) : (
      <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )}
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const passedProduct = location.state?.product;
  const [product, setProduct] = useState(passedProduct || null);
  const [loading, setLoading] = useState(!passedProduct);
  const [user, setUser] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [activeColor, setActiveColor] = useState('');
  const [activeSize, setActiveSize] = useState('');
  const [giftWrapPrice, setGiftWrapPrice] = useState(0);

  const { cartCount, handleAddToCart: facadeAddToCart, handleToggleFavorite: facadeToggleFavorite } = useEcommerceFacade(user);

  const handleAddToCart = (redirect = false) => {
    const productToAdd = {
      ...product,
      displayPrice: (Number(product.displayPrice || product.price) + giftWrapPrice).toFixed(2),
      name: giftWrapPrice > 0 ? `${product.name} (Gift Wrapped)` : product.name,
      colors: activeColor ? [activeColor] : null,
      sizes: activeSize ? [activeSize] : null
    };
    facadeAddToCart(productToAdd, redirect);
  };

  const handleToggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    facadeToggleFavorite(product, favs, (newFavs) => {
      setFavoritesCount(newFavs.length);
      setIsFavorite(newFavs.some(item => item.id === product.id));
    });
  };

  useEffect(() => {
    if (product) {
      if (product.colors && !activeColor) setActiveColor(product.colors[0]);
      if (product.sizes && !activeSize) setActiveSize(product.sizes[0]);
    }
  }, [product, activeColor, activeSize]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoritesCount(favs.length);
    if (product) {
      setIsFavorite(favs.some(item => item.id === product.id));
    }

    const fetchProduct = async () => {
      if (passedProduct) return; 
      
      try {
        const response = await fetch(`http://localhost:5200/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, passedProduct]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-black text-white rounded-full">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white pb-24">
      {/* Navbar - Same as Home */}
      <nav className="bg-white py-4 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span className="font-extrabold text-xl tracking-tight text-black">TechStore</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-neutral-500">
            <a onClick={() => navigate('/support')} className="hover:text-black transition-colors cursor-pointer">Support</a>
            <a href="#" className="text-black transition-colors">Shop</a>
            <a onClick={() => navigate('/profile')} className="hover:text-black transition-colors cursor-pointer">Profile</a>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-neutral-600 hover:text-black"><SearchIcon /></button>
            <button onClick={() => navigate('/favorites')} className="text-neutral-600 hover:text-black"><FavoritesIcon count={favoritesCount} /></button>
            <button onClick={() => navigate('/cart')} className="text-neutral-600 hover:text-black"><CartIcon count={cartCount} /></button>
            
            <div className="relative group cursor-pointer">
              <UserAvatar user={user} />
              <div className="absolute right-0 top-10 w-48 bg-white shadow-xl rounded-xl border border-neutral-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2 z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-neutral-50 mb-2">
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    </div>
                    {user.role === 'Admin' && (
                      <button className="text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg">Admin Dashboard</button>
                    )}
                    <button onClick={handleLogout} className="text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Log Out</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => navigate('/login')} className="text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg">Log In</button>
                    <button onClick={() => navigate('/register')} className="text-left px-4 py-2 text-sm text-black font-medium hover:bg-neutral-50 rounded-lg">Register</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-8">
          <span className="hover:text-black cursor-pointer" onClick={() => navigate('/')}>Electronics</span>
          <span>-</span>
          <span className="hover:text-black cursor-pointer">Premium</span>
          <span>-</span>
          <span className="text-black">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Column - Images */}
          <div className="flex-1">
            {/* Main Image */}
            <div className="w-full aspect-square md:aspect-[4/3] bg-[#f5f5f4] rounded-[2rem] flex items-center justify-center p-8 mb-4 border border-neutral-100">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {[product.image_url, product.image_url, product.image_url, product.image_url].map((img, idx) => (
                <div 
                  key={idx} 
                  className={`min-w-[80px] w-[80px] h-[80px] rounded-xl bg-[#f5f5f4] p-2 flex items-center justify-center cursor-pointer border-2 transition-all ${idx === 0 ? 'border-black' : 'border-transparent hover:border-neutral-300'}`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
              ))}
              <div className="min-w-[80px] w-[80px] h-[80px] rounded-xl bg-white border border-neutral-200 p-2 flex items-center justify-center cursor-pointer hover:border-black transition-all">
                <span className="text-xs font-bold text-neutral-600">+4 more</span>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="flex-1 flex flex-col justify-start pt-4 lg:pt-8">
            
            {/* Brand Logo & Model ID */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <span className="font-bold text-sm">Stuffus Tech</span>
              </div>
              <span className="text-xs font-semibold text-neutral-400">PRD-{product.id}-2026</span>
            </div>

            {/* Title */}
            <GiftWrapDecorator product={product} onGiftWrapChange={setGiftWrapPrice}>
              <h1 className="text-3xl md:text-[2.5rem] leading-tight font-bold text-black mb-4">
                {product.name}
              </h1>

              {/* Stars */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex text-yellow-400">
                  {[1,2,3,4].map(i => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                  <svg className="w-4 h-4 text-neutral-200" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </div>
                <span className="text-xs text-neutral-400 font-semibold ml-1">42 reviews</span>
              </div>

              {/* Price */}
              <div className="text-5xl font-extrabold text-black mb-10">
                ${(Number(product.displayPrice || product.price) + giftWrapPrice).toFixed(2)}
              </div>
            </GiftWrapDecorator>

            {/* Key Specifications */}
            {product.characteristics && product.characteristics.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-sm mb-4">Key Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.characteristics.map((char, idx) => (
                    <div key={idx} className="bg-[#f8f8f8] p-4 rounded-xl border border-neutral-100">
                      <div className="text-xs text-neutral-500 font-semibold mb-1">{char.label}</div>
                      <div className="text-sm font-bold text-black">{char.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Color Picker */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-sm">Color</span>
                  <span className="text-sm text-neutral-400 font-medium">· {activeColor}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c) => (
                    <button 
                      key={c}
                      onClick={() => setActiveColor(c)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${activeColor === c ? 'border-black text-black bg-white shadow-sm' : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 bg-[#fafafa]'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size/Capacity Picker */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-sm">Capacity / Size</span>
                  <span className="text-sm text-neutral-400 font-medium">· Selected: {activeSize}</span>
                </div>
                <div className="flex flex-wrap gap-2 max-w-md">
                  {product.sizes.map((size) => (
                    <button 
                      key={size}
                      onClick={() => setActiveSize(size)}
                      className={`flex-1 min-w-[80px] py-3 text-sm font-semibold rounded-lg border transition-all ${activeSize === size ? 'bg-black text-white border-black shadow-md' : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart & Favorite */}
            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => handleAddToCart(false)}
                className="flex-1 py-4 bg-black text-white rounded-xl text-sm font-bold flex items-center justify-center gap-3 hover:bg-neutral-800 transition-colors shadow-lg shadow-black/10 active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Add to cart
              </button>
              <button 
                onClick={() => handleAddToCart(true)}
                className="flex-1 py-4 border-2 border-black text-black rounded-xl text-sm font-bold flex items-center justify-center hover:bg-neutral-50 transition-colors active:scale-[0.98]"
              >
                Buy Now
              </button>
              <button 
                onClick={handleToggleFavorite}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-neutral-100 text-black hover:bg-neutral-200'}`}
              >
                <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-3 text-sm font-semibold text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              Free delivery on orders over $30.0
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

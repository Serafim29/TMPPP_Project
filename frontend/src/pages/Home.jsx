import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DiscountProxy from '../utils/proxy/DiscountProxy';
import ProductFactory from '../utils/factory/ProductFactory';
import { useEcommerceFacade } from '../utils/facade/useEcommerceFacade';
import { ProductIterator } from '../utils/iterator/ProductIterator';

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

const Home = () => {
  const [user, setUser] = useState(null);
  const [baseProducts, setBaseProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Product');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const [favoritesCount, setFavoritesCount] = useState(0);
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  // Folosirea Facade Pattern pentru a încapsula operațiunile complexe
  const { cartCount, handleAddToCart, handleToggleFavorite: facadeToggleFavorite, undoLastCartAction, canUndoCartAction } = useEcommerceFacade(user);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 304; 
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      
      if (direction === 'left') {
        if (scrollLeft <= 0) {
          carouselRef.current.scrollTo({ left: scrollWidth - clientWidth, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
    carouselRef.current.style.scrollSnapType = 'none';
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    if (carouselRef.current) carouselRef.current.style.scrollSnapType = '';
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (carouselRef.current) carouselRef.current.style.scrollSnapType = '';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; 
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleDragClickCapture = (e) => {
    if (carouselRef.current && Math.abs(scrollLeft.current - carouselRef.current.scrollLeft) > 5) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const categories = ['All Product', 'For Home', 'For Music', 'For Phone', 'For Storage', 'Other'];

  const fetchFavorites = async (token) => {
    try {
      const response = await fetch('http://localhost:5001/api/favorites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('favorites', JSON.stringify(data));
        setFavoritesCount(data.length);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        fetchFavorites(token);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    } else {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavoritesCount(favs.length);
    }
    
    fetchProducts();
  }, []);

  useEffect(() => {
    if (baseProducts.length === 0) return;
    
    const productDiscounts = JSON.parse(localStorage.getItem('productDiscounts') || '{}');
    const proxy = new DiscountProxy(user?.role || 'User');
    
    const mappedProducts = baseProducts.map(p => {
      let displayPrice = p.price;
      let originalPrice = null;
      let discountCodeApplied = null;
      
      const code = productDiscounts[p.id];
      if (code) {
        const result = proxy.applyDiscount(p.price, code);
        if (result.success) {
            displayPrice = result.price;
            originalPrice = p.price;
            discountCodeApplied = code;
        }
      }

      return {
        ...p,
        realId: p.id,
        displayId: p.id,
        displayPrice,
        originalPrice,
        discountCodeApplied,
        rating: '5.0', 
        reviews: 0 
      };
    });
    setDisplayProducts(mappedProducts);
  }, [baseProducts, user]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5200/api/products');
      if (response.ok) {
        const data = await response.json();
        setBaseProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleToggleFavorite = (product) => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    facadeToggleFavorite(product, favs, (newFavs) => {
      setFavoritesCount(newFavs.length);
    });
  };

  const filteredProducts = displayProducts.filter(p => {
    if (activeCategory === 'On Discount') return p.originalPrice !== null;
    const matchesCategory = activeCategory === 'All Product' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Iterator Pattern: Create iterator for current filtered products
  const productIterator = new ProductIterator(filteredProducts, productsPerPage);
  productIterator.setPage(currentPage);
  
  const totalPages = productIterator.getTotalPages();
  const currentProducts = productIterator.getCurrentItems();
  const visiblePages = productIterator.getVisiblePages();

  const recommendations = displayProducts.slice(0, 12);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-neutral-100 py-4 px-6 md:px-12 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span className="font-extrabold text-xl tracking-tight text-black">TechStore</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-neutral-500">
            <a onClick={() => navigate('/custom-pc')} className="text-amber-500 hover:text-amber-600 transition-colors cursor-pointer font-bold hover:underline decoration-amber-500 decoration-2 underline-offset-4">Build PC</a>
            <a onClick={() => navigate('/support')} className="text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer font-bold hover:underline decoration-emerald-600 decoration-2 underline-offset-4">Support</a>
            <a onClick={() => navigate('/profile')} className="text-sky-600 hover:text-sky-700 transition-colors cursor-pointer font-bold hover:underline decoration-sky-600 decoration-2 underline-offset-4">Profile</a>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-neutral-600 hover:text-black"><SearchIcon /></button>
            <button onClick={() => navigate('/favorites')} className="text-neutral-600 hover:text-black"><FavoritesIcon count={favoritesCount} /></button>
            <button onClick={() => navigate('/cart')} className="text-neutral-600 hover:text-black"><CartIcon count={cartCount} /></button>
            {canUndoCartAction && (
              <button 
                onClick={undoLastCartAction} 
                className="text-xs font-bold bg-neutral-200 text-black px-3 py-1 rounded-full hover:bg-neutral-300"
                title="Undo last cart action"
              >
                Undo
              </button>
            )}
            
            <div className="relative group cursor-pointer">
              <UserAvatar user={user} />
              <div className="absolute right-0 top-10 w-48 bg-white shadow-xl rounded-xl border border-neutral-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-neutral-50 mb-2">
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    </div>
                    {user.role === 'Admin' && (
                      <button onClick={() => navigate('/admin')} className="text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg">Admin Dashboard</button>
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

      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-6">
        <div className="relative w-full h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden group">
          <img 
            src="/assets/backgound-image.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1 className="text-[120px] md:text-[200px] font-black text-white/90 tracking-tighter mix-blend-overlay">Shop</h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-6">
          <h2 className="text-3xl font-extrabold tracking-tight">Give All You Need</h2>
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search an Electronic" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-24 py-4 bg-neutral-100/80 border-none rounded-full text-sm focus:ring-2 focus:ring-black outline-none transition-all"
            />
            <button className="absolute right-2 top-2 bottom-2 px-6 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-12 flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="space-y-8 sticky top-24">
            <div>
              <h3 className="font-bold text-lg mb-4">Category</h3>
              <div className="space-y-1">
                {categories.map((cat, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-neutral-100 text-black' : 'text-neutral-500 hover:text-black hover:bg-neutral-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      {cat === 'All Product' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                      {cat === 'For Home' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                      {cat === 'For Music' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>}
                      {cat === 'For Phone' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                      {cat === 'For Storage' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>}
                      {cat === 'Other' && <span className="w-4 h-4 border border-current rounded-sm"></span>}
                      {cat}
                    </div>
                    {cat === 'All Product' && displayProducts.length > 0 && <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full font-bold">{displayProducts.length}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {['New Arrival', 'Best Seller', 'On Discount'].map((filter, idx) => (
                <button 
                  key={idx} 
                  onClick={() => filter === 'On Discount' ? setActiveCategory('On Discount') : null}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-neutral-600 hover:text-black border-b border-neutral-100 group"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-neutral-400 group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {filter}
                    {filter === 'On Discount' && displayProducts.filter(p => p.originalPrice).length > 0 && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full font-bold ml-2 border border-red-200 shadow-sm">{displayProducts.filter(p => p.originalPrice).length}</span>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <ProductFactory 
                key={product.displayId} 
                product={product} 
                handleToggleFavorite={handleToggleFavorite} 
                handleAddToCart={handleAddToCart} 
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-16 px-4 border-t border-neutral-100 pt-8">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${currentPage === 1 ? 'text-neutral-300 cursor-not-allowed' : 'text-neutral-500 hover:text-black'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {visiblePages.map((page, idx) => (
                  page === "..." ? (
                    <span key={`ellipsis-${idx}`} className="text-neutral-400 px-2">...</span>
                  ) : (
                    <button 
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${currentPage === page ? 'bg-neutral-100 text-black font-bold' : 'text-neutral-500 hover:bg-neutral-50 hover:text-black font-semibold'}`}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${currentPage === totalPages ? 'text-neutral-300 cursor-not-allowed' : 'text-neutral-500 hover:text-black'}`}
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">Explore our recommendations</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => scrollCarousel('left')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-black hover:border-black transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scrollCarousel('right')} className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-black hover:border-black transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        
        <div 
          ref={carouselRef} 
          className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onClickCapture={handleDragClickCapture}
        >
          {recommendations.map((product) => (
            <div key={`rec-${product.displayId}`} className="min-w-[280px] w-[280px] snap-start group cursor-pointer" onClick={() => navigate(`/product/${product.realId}`, { state: { product } })}>
              <div className="relative aspect-[4/3] rounded-[1.5rem] bg-[#f2f2f2] overflow-hidden p-6 flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-[#e8e8e8]">
                <span className="absolute top-3 right-3 px-2.5 py-1 bg-white text-[9px] font-bold text-neutral-600 rounded-full shadow-sm z-10">
                  {product.category}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleToggleFavorite(product); }}
                  className="absolute top-3 left-3 w-7 h-7 bg-white/80 backdrop-blur-sm text-neutral-400 hover:text-red-500 rounded-full shadow-sm z-10 flex items-center justify-center transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="px-1">
                <h3 className="font-bold text-sm mb-1 line-clamp-1">{product.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <span className="text-[10px] font-semibold">{product.rating} <span className="text-neutral-400 font-normal">({product.reviews} Reviews)</span></span>
                  </div>
                  <span className="font-extrabold text-sm">${Number(product.displayPrice).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product, false); }} className="flex-1 py-2 border-2 border-neutral-200 rounded-full text-xs font-bold hover:border-black transition-colors">Add to Cart</button>
                  <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product, true); }} className="flex-1 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-neutral-800 transition-colors">Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-16 mb-24">
        <div className="bg-[#2d2d2d] rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight leading-tight">Ready to Get<br/>Our New Stuff?</h2>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full pl-6 pr-32 py-4 rounded-full bg-white text-sm outline-none font-medium"
              />
              <button className="absolute right-2 top-2 bottom-2 px-8 bg-[#2d2d2d] text-white text-xs font-bold rounded-full hover:bg-black transition-colors">
                Send
              </button>
            </div>
          </div>
          <div className="max-w-sm text-neutral-400 text-sm leading-relaxed">
            TechStore is for Homes and Needs.<br/><br/>
            We'll listen to your needs, identify the best approach, and then create a bespoke smart for charging solution that's right for you.
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-100 pt-16 pb-8 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div className="grid grid-cols-2 gap-24">
            <div>
              <h4 className="font-bold mb-6">About</h4>
              <ul className="space-y-4 text-sm text-neutral-500 font-medium">
                <li><a href="#" className="hover:text-black">Blog</a></li>
                <li><a href="#" className="hover:text-black">Meet The Team</a></li>
                <li><a href="#" className="hover:text-black">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-neutral-500 font-medium">
                <li><a href="#" className="hover:text-black">Contact Us</a></li>
                <li><a href="#" className="hover:text-black">Shipping</a></li>
                <li><a href="#" className="hover:text-black">Return</a></li>
                <li><a href="#" className="hover:text-black">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-end justify-between">
            <div>
              <h4 className="font-bold text-sm text-neutral-500 mb-4 text-right">Social Media</h4>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-neutral-800 hover:bg-black rounded-full flex items-center justify-center text-white cursor-pointer transition-colors">X</div>
                <div className="w-10 h-10 bg-neutral-800 hover:bg-black rounded-full flex items-center justify-center text-white cursor-pointer transition-colors">f</div>
                <div className="w-10 h-10 bg-neutral-800 hover:bg-black rounded-full flex items-center justify-center text-white cursor-pointer transition-colors">in</div>
                <div className="w-10 h-10 bg-neutral-800 hover:bg-black rounded-full flex items-center justify-center text-white cursor-pointer transition-colors">ig</div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto border-t border-neutral-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-neutral-400">
          <p>Copyright © 2026 TechStore. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black">Terms of Service</a>
            <a href="#" className="hover:text-black">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

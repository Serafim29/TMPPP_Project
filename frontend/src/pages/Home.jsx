import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
      fetchProducts();
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
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
    navigate('/login');
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white selection:bg-blue-500/30">
      <nav className="bg-neutral-800/50 backdrop-blur-md border-b border-neutral-700/50 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            TechStore
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium text-white">{user.name}</span>
              <span className="text-xs text-neutral-400">{user.email}</span>
            </div>
            <span className="px-3 py-1 bg-neutral-700/50 border border-neutral-600 rounded-full text-xs font-semibold text-neutral-300">
              {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-sm font-medium transition-all active:scale-95"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 mt-8">
        {user.role === 'Admin' && (
          <div className="mb-8 p-6 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-2xl flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Admin Dashboard</h2>
              <p className="text-neutral-400 text-sm">You have administrative privileges to manage products and users.</p>
            </div>
            <button className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 transition-all active:scale-95">
              Manage Store
            </button>
          </div>
        )}

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-3">Featured Products</h1>
          <p className="text-neutral-400 text-lg">Discover our premium selection of tech gear.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-neutral-800/40 border border-neutral-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 group flex flex-col">
              <div className="relative h-48 overflow-hidden bg-neutral-800">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-neutral-900/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold border border-neutral-700">
                  ${Number(product.price).toFixed(2)}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">{product.name}</h3>
                <p className="text-sm text-neutral-400 mb-6 line-clamp-2 flex-1">{product.description}</p>
                
                <button className="w-full py-3 px-4 bg-white/5 hover:bg-blue-500 text-white border border-white/10 hover:border-blue-500 rounded-xl font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2 group/btn">
                  <svg className="w-5 h-5 text-neutral-400 group-hover/btn:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;

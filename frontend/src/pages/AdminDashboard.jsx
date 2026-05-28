import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FrontendSalesReportGenerator, FrontendInventoryReportGenerator } from '../utils/templateMethod/ReportGenerator';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // States for report generation (Template Method)
  const [reportResult, setReportResult] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'Other',
    discount_code: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userDataStr = localStorage.getItem('user');

    if (!token || !userDataStr) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userDataStr);
      if (userData.role !== 'Admin') {
        navigate('/');
        return;
      }
      setUser(userData);
    } catch (e) {
      console.error('Error parsing user data:', e);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'Dashboard') {
      fetchOrders();
    } else if (activeTab === 'Products') {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoadingData(true);
    try {
      const res = await fetch('http://localhost:5200/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders', err);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingData(true);
    try {
      const res = await fetch('http://localhost:5200/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Template Method Executor
  const handleGenerateReport = async (type) => {
    setGeneratingReport(true);
    setReportResult(null);

    try {
      const apiCall = async (reportType) => {
        const res = await fetch(`http://localhost:5200/api/orders/report?type=${reportType}`);
        if (!res.ok) throw new Error("Failed to communicate with C# backend reports controller.");
        return await res.json();
      };

      let generator;
      if (type === 'Sales') {
        generator = new FrontendSalesReportGenerator();
      } else {
        generator = new FrontendInventoryReportGenerator();
      }

      // Execute Template Method Pattern sequence on Frontend which triggers C# Backend Template Method!
      const result = await generator.generate(type, apiCall);
      setReportResult(result);
    } catch (err) {
      console.error(err);
      alert("Eroare la generarea raportului: " + err.message);
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!editingProduct;
    const url = isEdit ? `http://localhost:5200/api/products/${editingProduct.id}` : 'http://localhost:5200/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price) || 0,
      imageUrl: productForm.image_url,
      category: productForm.category
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        let savedProduct = null;
        try { savedProduct = await res.json(); } catch(e) {}
        const productId = isEdit ? editingProduct.id : (savedProduct?.id || null);

        if (productId) {
            const productDiscounts = JSON.parse(localStorage.getItem('productDiscounts') || '{}');
            if (productForm.discount_code) {
                productDiscounts[productId] = productForm.discount_code;
            } else {
                delete productDiscounts[productId];
            }
            localStorage.setItem('productDiscounts', JSON.stringify(productDiscounts));
        }

        setShowProductModal(false);
        fetchProducts();
      } else {
        alert('Failed to save product');
      }
    } catch (err) {
      console.error('Error saving product', err);
      alert('Error saving product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`http://localhost:5200/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product', err);
      alert('Error deleting product');
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: '', image_url: '', category: 'Other', discount_code: '' });
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    const productDiscounts = JSON.parse(localStorage.getItem('productDiscounts') || '{}');
    const existingDiscount = productDiscounts[product.id] || '';

    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      image_url: product.image_url || '',
      category: product.category || 'Other',
      discount_code: existingDiscount
    });
    setShowProductModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-black selection:text-white flex flex-col md:flex-row relative">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-neutral-100 flex flex-col shrink-0 min-h-screen">
        <div className="p-6 md:p-8 flex items-center justify-between md:justify-center border-b border-neutral-100">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span className="font-extrabold text-xl tracking-tight text-black">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <button 
            onClick={() => setActiveTab('Dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer ${activeTab === 'Dashboard' ? 'bg-black text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('Products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer ${activeTab === 'Products' ? 'bg-black text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            Products
          </button>
          <button 
            onClick={() => { setActiveTab('Reports'); setReportResult(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer ${activeTab === 'Reports' ? 'bg-black text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Reports
          </button>
        </nav>

        <div className="p-6 border-t border-neutral-100">
          <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 rounded-2xl mb-4">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-black border border-neutral-100">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-bold text-black">{user?.name}</p>
              <p className="text-xs font-semibold text-neutral-400">Admin</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="w-full py-3 text-sm font-bold text-neutral-500 hover:text-black border-2 border-neutral-200 hover:border-black rounded-xl transition-colors">
            Back to Store
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-black">
              {activeTab === 'Dashboard' && `Welcome back, ${user?.name}`}
              {activeTab === 'Products' && 'Product Management'}
              {activeTab === 'Reports' && 'Template Method Reports'}
            </h1>
            <p className="text-neutral-500 mt-2 font-medium">
              {activeTab === 'Dashboard' && "Here are the latest orders placed on your store."}
              {activeTab === 'Products' && "Manage your store's inventory from here."}
              {activeTab === 'Reports' && "Generate structural business reports built upon base templates."}
            </p>
          </div>
          {activeTab === 'Products' && (
            <button 
              onClick={openAddProductModal}
              className="px-6 py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
            >
              + Add Product
            </button>
          )}
        </header>

        {loadingData ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === 'Dashboard' && (
              <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-black">Recent Orders (DB)</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                        <th className="pb-4 font-bold">Order ID</th>
                        <th className="pb-4 font-bold">Customer Name</th>
                        <th className="pb-4 font-bold">Date</th>
                        <th className="pb-4 font-bold">Items Count</th>
                        <th className="pb-4 font-bold">Total Amount</th>
                        <th className="pb-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-neutral-500 font-medium">No orders found.</td>
                        </tr>
                      ) : (
                        orders.map((order) => {
                          const itemsCount = Array.isArray(order.items) ? order.items.length : 0;
                          const date = new Date(order.createdAt).toLocaleDateString();
                          return (
                            <tr key={order.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                              <td className="py-4 font-bold text-black">#{order.id}</td>
                              <td className="py-4 font-medium text-neutral-700">{order.customerName}</td>
                              <td className="py-4 text-neutral-500">{date}</td>
                              <td className="py-4 font-medium text-neutral-500">{itemsCount} items</td>
                              <td className="py-4 font-bold text-black">${Number(order.total).toFixed(2)}</td>
                              <td className="py-4">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                  order.status.includes('Paid') ? 'bg-green-100 text-green-700' : 
                                  order.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                  order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Products' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-neutral-500 font-medium">No products found.</div>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col">
                      <div className="aspect-square bg-neutral-50 p-4">
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">{product.category}</span>
                        <h3 className="font-bold text-sm text-black line-clamp-2 mb-2">{product.name}</h3>
                        <span className="font-extrabold text-lg text-black mt-auto">${Number(product.price).toFixed(2)}</span>
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-100">
                          <button onClick={() => openEditProductModal(product)} className="flex-1 py-2 text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer">Edit</button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="flex-1 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Reports (Template Method UI) */}
            {activeTab === 'Reports' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Sales Report Box */}
                  <div className="bg-white/70 backdrop-blur-md border border-neutral-100 p-8 rounded-[2rem] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="w-12 h-12 bg-amber-50 border border-amber-200/50 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-black mb-2">Raport Financiar Vânzări</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed font-medium mb-6">
                        Evaluează performanța magazinului colectând datele despre încasări și taxe pe ultima lună. Folosește formatul financiar și se exportă ca fișier PDF standard.
                      </p>
                    </div>
                    <button 
                      type="button"
                      disabled={generatingReport}
                      onClick={() => handleGenerateReport('Sales')}
                      className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-4 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 text-xs uppercase tracking-wider"
                    >
                      Generează Raport Vânzări
                    </button>
                  </div>

                  {/* Inventory Report Box */}
                  <div className="bg-white/70 backdrop-blur-md border border-neutral-100 p-8 rounded-[2rem] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="w-12 h-12 bg-emerald-50 border border-emerald-200/50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-black mb-2">Raport Stocuri Inventar</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed font-medium mb-6">
                        Interoghează baza de date pentru cantitățile de produse active, semnalând elementele care necesită re-aprovizionare. Se formatează simplu și se exportă sub formă de tabel Excel (CSV).
                      </p>
                    </div>
                    <button 
                      type="button"
                      disabled={generatingReport}
                      onClick={() => handleGenerateReport('Inventory')}
                      className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-4 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 text-xs uppercase tracking-wider"
                    >
                      Generează Raport Inventar
                    </button>
                  </div>

                </div>

                {/* Loading State */}
                {generatingReport && (
                  <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-12 text-center flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-neutral-500 font-bold tracking-wide">Se compilează algoritmul șablon...</p>
                  </div>
                )}

                {/* Interactive Console showing Template Method Steps execution */}
                {reportResult && (
                  <div className="bg-white/80 backdrop-blur-md border border-neutral-100 rounded-[2rem] shadow-lg p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                        <h3 className="text-lg font-black text-black tracking-tight">Consolă Execuție Template Method</h3>
                      </div>
                      <span className="px-3 py-1 bg-green-50 border border-green-200 text-green-700 font-bold text-xs rounded-full">
                        {reportResult.reportType === 'Sales' ? 'Sales Report Class' : 'Inventory Report Class'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Frontend execution list */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black tracking-wider uppercase text-neutral-400">PASUL A: RULARE SHABLON CLIENT (JS)</h4>
                        <div className="space-y-2">
                          {reportResult.frontendSteps.map((step, idx) => (
                            <div key={idx} className="p-3 bg-neutral-50 rounded-xl text-xs font-mono font-semibold text-neutral-700 border border-neutral-100/50">
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Backend execution list */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black tracking-wider uppercase text-neutral-400">PASUL B: RULARE ȘABLON SERVER (C# ENDPOINT)</h4>
                        <div className="space-y-2">
                          {reportResult.backendSteps.map((step, idx) => (
                            <div key={idx} className="p-3 bg-neutral-900 text-neutral-200 rounded-xl text-xs font-mono font-bold border border-neutral-800 shadow-inner">
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-neutral-100 text-center flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="text-left">
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest block">Status execuție</span>
                        <p className="text-sm font-bold text-black">{reportResult.status}</p>
                      </div>
                      <span className="px-5 py-3 bg-green-50 border border-green-200 text-green-700 text-xs font-black tracking-wider uppercase rounded-xl shadow-sm">
                        Conexiune bidirecțională activă
                      </span>
                    </div>
                  </div>
                )}

              </div>
            )}
          </>
        )}
      </main>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowProductModal(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-extrabold text-black mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Name</label>
                <input required type="text" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium text-black" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Category</label>
                <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium text-black">
                  <option value="For Home">For Home</option>
                  <option value="For Music">For Music</option>
                  <option value="For Phone">For Phone</option>
                  <option value="For Storage">For Storage</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Discount Coupon Code</label>
                <input type="text" placeholder="e.g. VIP20" value={productForm.discount_code} onChange={(e) => setProductForm({...productForm, discount_code: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium text-black placeholder:text-neutral-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea required rows="3" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium text-black"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Price ($)</label>
                  <input required type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium text-black" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Image URL</label>
                  <input required type="url" value={productForm.image_url} onChange={(e) => setProductForm({...productForm, image_url: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium text-black" />
                </div>
              </div>
              <div className="flex gap-4 pt-4 mt-6 border-t border-neutral-100">
                <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 py-3 text-sm font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 text-sm font-bold text-white bg-black hover:bg-neutral-800 rounded-xl transition-colors">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

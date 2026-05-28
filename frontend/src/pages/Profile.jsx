import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderTracker } from '../utils/state/OrderTracker';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [deliveryData, setDeliveryData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      console.error(e);
    }

    const savedDelivery = localStorage.getItem('deliveryData');
    if (savedDelivery) {
      try {
        setDeliveryData(JSON.parse(savedDelivery));
      } catch (e) {
        console.error(e);
      }
    }
  }, [navigate]);

  const handleSaveDeliveryData = (e) => {
    e.preventDefault();
    localStorage.setItem('deliveryData', JSON.stringify(deliveryData));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('deliveryData');
    navigate('/login');
  };

  if (!user) return null;

  const registrationDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-black selection:text-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-neutral-100 py-4 px-6 md:px-12 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span className="font-extrabold text-xl tracking-tight text-black">TechStore</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-neutral-500">
            <a onClick={() => navigate('/')} className="hover:text-black transition-colors cursor-pointer hover:underline decoration-black decoration-2 underline-offset-4">Home</a>
            <a onClick={() => navigate('/custom-pc')} className="text-amber-500 hover:text-amber-600 transition-colors cursor-pointer font-bold hover:underline decoration-amber-500 decoration-2 underline-offset-4">Build PC</a>
            <a onClick={() => navigate('/support')} className="text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer font-bold hover:underline decoration-emerald-600 decoration-2 underline-offset-4">Support</a>
            <a onClick={() => navigate('/profile')} className="text-sky-600 hover:text-sky-700 transition-colors cursor-pointer font-bold hover:underline decoration-sky-600 decoration-2 underline-offset-4">Profile</a>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        <h1 className="text-4xl font-extrabold text-black mb-10 tracking-tight">Your Profile</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* User Info Card */}
          <div className="flex-[2] space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-50 rounded-bl-[100px] -z-10"></div>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-black/20">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-black">{user.name}</h2>
                  <span className="inline-block mt-1 px-3 py-1 bg-neutral-100 text-xs font-bold text-neutral-500 rounded-full">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    value={user.email} 
                    readOnly 
                    className="w-full px-4 py-3 rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-700 font-medium cursor-not-allowed focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">Password</label>
                  <input 
                    type="password" 
                    value="********" 
                    readOnly 
                    className="w-full px-4 py-3 rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-700 font-medium cursor-not-allowed focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">Member Since</label>
                  <input 
                    type="text" 
                    value={registrationDate} 
                    readOnly 
                    className="w-full px-4 py-3 rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-700 font-medium cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="mt-10 px-6 py-3 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-100 transition-colors"
              >
                Log Out
              </button>
            </div>

            {/* State Pattern: Order Tracker */}
            <div className="mt-8">
              <h2 className="text-xl font-extrabold text-black mb-6">Recent Orders</h2>
              <OrderTracker orderId="ORD-7829-X" />
              <OrderTracker orderId="ORD-5521-Z" />
            </div>
          </div>

          {/* Delivery Details Form */}
          <div className="flex-[3]">
            <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-xl">
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-black mb-2">Delivery Details</h2>
                <p className="text-sm font-medium text-neutral-500">
                  Update your shipping information. These details will be used for your future orders.
                </p>
              </div>

              <form onSubmit={handleSaveDeliveryData} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={deliveryData.fullName}
                    onChange={(e) => setDeliveryData({...deliveryData, fullName: e.target.value})}
                    placeholder="John Doe" 
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-[#fafafa] text-sm" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Delivery Address</label>
                  <input 
                    required 
                    type="text" 
                    value={deliveryData.address}
                    onChange={(e) => setDeliveryData({...deliveryData, address: e.target.value})}
                    placeholder="123 Main St, Apt 4B" 
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-[#fafafa] text-sm" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 mb-1.5">City</label>
                    <input 
                      required 
                      type="text" 
                      value={deliveryData.city}
                      onChange={(e) => setDeliveryData({...deliveryData, city: e.target.value})}
                      placeholder="New York" 
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-[#fafafa] text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Postal Code</label>
                    <input 
                      required 
                      type="text" 
                      value={deliveryData.postalCode}
                      onChange={(e) => setDeliveryData({...deliveryData, postalCode: e.target.value})}
                      placeholder="10001" 
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-[#fafafa] text-sm" 
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors active:scale-95"
                  >
                    Save Delivery Details
                  </button>
                  {isSaved && (
                    <span className="text-sm font-bold text-green-500 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Saved!
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;

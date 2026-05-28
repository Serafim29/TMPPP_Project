import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isPressingBtn, setIsPressingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.error || 'Înregistrare eșuată');
      }
    } catch (err) {
      setError('Eroare de rețea. Te rugăm să încerci din nou mai târziu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ecf0f3] flex items-center justify-center p-6 relative overflow-hidden font-sans select-none">
      
      {/* Neumorphic Soft UI Floating Card */}
      <div 
        className={`max-w-[430px] w-full bg-[#ecf0f3] rounded-[2.5rem] border border-white/20 p-10 md:p-12 transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) ${
          isMounted 
            ? 'opacity-100 scale-100 translate-y-0 shadow-[18px_18px_30px_#d1d9e6,-18px_-18px_30px_#ffffff]' 
            : 'opacity-0 scale-[0.93] translate-y-8 shadow-[0_0_0_#d1d9e6,0_0_0_#ffffff]'
        }`}
      >
        <div className="space-y-6">
          
          {/* Form Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-extrabold text-neutral-800 tracking-tight mb-2">Create Account</h1>
            <p className="text-neutral-400 text-xs font-semibold">Join the TechStore ecosystem</p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl text-xs font-bold text-red-500 bg-[#ecf0f3] shadow-[inset_2px_2px_5px_#b8b9be,inset_-2px_-2px_5px_#ffffff] text-center font-mono">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest pl-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-[#ecf0f3] border-none text-neutral-700 outline-none text-sm font-semibold tracking-wide placeholder:text-neutral-400/80 transition-all shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] focus:shadow-[inset_4px_4px_8px_#a6a8b1,inset_-4px_-4px_8px_#ffffff]"
                placeholder="John Doe"
                required
              />
            </div>
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest pl-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-[#ecf0f3] border-none text-neutral-700 outline-none text-sm font-semibold tracking-wide placeholder:text-neutral-400/80 transition-all shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] focus:shadow-[inset_4px_4px_8px_#a6a8b1,inset_-4px_-4px_8px_#ffffff]"
                placeholder="name@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest pl-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-[#ecf0f3] border-none text-neutral-700 outline-none text-sm font-semibold tracking-wide placeholder:text-neutral-400/80 transition-all shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] focus:shadow-[inset_4px_4px_8px_#a6a8b1,inset_-4px_-4px_8px_#ffffff]"
                placeholder="Minimum 6 characters"
                minLength="6"
                required
              />
            </div>

            {/* Account Type Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest pl-2">Account Type</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#ecf0f3] border-none text-neutral-700 outline-none text-sm font-semibold tracking-wide appearance-none cursor-pointer transition-all shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] focus:shadow-[inset_4px_4px_8px_#a6a8b1,inset_-4px_-4px_8px_#ffffff]"
                >
                  <option value="User" className="bg-[#ecf0f3] text-neutral-700">User</option>
                  <option value="Admin" className="bg-[#ecf0f3] text-neutral-700">Admin</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-neutral-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Premium Neumorphic Sign Up Button */}
            <div className="pt-4">
              <button
                type="submit"
                onMouseDown={() => setIsPressingBtn(true)}
                onMouseUp={() => setIsPressingBtn(false)}
                onMouseLeave={() => setIsPressingBtn(false)}
                className={`w-full py-4.5 rounded-full text-white text-sm font-extrabold transition-all duration-200 cursor-pointer text-center bg-[#707070] ${
                  isPressingBtn 
                    ? 'shadow-[inset_4px_4px_8px_#404040,inset_-4px_-4px_8px_#a0a0a0] scale-[0.98]' 
                    : 'shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] hover:bg-[#666666]'
                }`}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>

          </form>

          <p className="mt-6 text-center text-neutral-500 text-xs font-bold">
            Already have an account?{' '}
            <Link to="/login" className="text-neutral-800 hover:underline transition-all font-black">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

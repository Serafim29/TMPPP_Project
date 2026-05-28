import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isPressingBtn, setIsPressingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.error || 'Autentificare eșuată');
      }
    } catch (err) {
      setError('Eroare de rețea. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ecf0f3] flex items-center justify-center p-6 relative overflow-hidden font-sans select-none">
      
      <div 
        className={`max-w-[430px] w-full bg-[#ecf0f3] rounded-[2.5rem] border border-white/20 p-10 md:p-12 transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) ${
          isMounted 
            ? 'opacity-100 scale-100 translate-y-0 shadow-[18px_18px_30px_#d1d9e6,-18px_-18px_30px_#ffffff]' 
            : 'opacity-0 scale-[0.93] translate-y-8 shadow-[0_0_0_#d1d9e6,0_0_0_#ffffff]'
        }`}
      >
        <div className="space-y-8">
          
          {/* Form Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-neutral-800 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-neutral-400 text-xs font-semibold">Sign in to your account</p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl text-xs font-bold text-red-500 bg-[#ecf0f3] shadow-[inset_2px_2px_5px_#b8b9be,inset_-2px_-2px_5px_#ffffff] text-center font-mono">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Username/Email Field */}
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest pl-2">Username</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-[#ecf0f3] border-none text-neutral-700 outline-none text-sm font-semibold tracking-wide placeholder:text-neutral-400/80 transition-all shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] focus:shadow-[inset_4px_4px_8px_#a6a8b1,inset_-4px_-4px_8px_#ffffff]"
                placeholder="admin@CSSScript.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest pl-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-[#ecf0f3] border-none text-neutral-700 outline-none text-sm font-semibold tracking-wide placeholder:text-neutral-400/80 transition-all shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] focus:shadow-[inset_4px_4px_8px_#a6a8b1,inset_-4px_-4px_8px_#ffffff]"
                placeholder="Enter Password"
                required
              />
            </div>

            {/* Remember Me & Forget Password */}
            <div className="flex items-center justify-between text-xs font-bold text-neutral-500 px-1 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                  rememberMe 
                    ? 'shadow-[inset_2px_2px_5px_#b8b9be,inset_-2px_-2px_5px_#ffffff] bg-[#ecf0f3]' 
                    : 'shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff]'
                }`}>
                  {rememberMe && (
                    <svg className="w-3.5 h-3.5 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span>Remember me</span>
              </label>

              <a href="#" className="hover:text-neutral-800 transition-colors">Forget password?</a>
            </div>

            {/* Premium Neumorphic Sign In Button */}
            <div className="pt-2">
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
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

          </form>

          {/* Social Sign In Divider */}
          <div className="space-y-5 pt-2">
            <p className="text-center text-xs font-bold text-neutral-400">or sign in with</p>
            
            {/* Social Neumorphic Circle Buttons */}
            <div className="flex items-center justify-center gap-5">
              {/* Facebook */}
              <button type="button" className="w-12 h-12 rounded-full bg-[#ecf0f3] flex items-center justify-center text-neutral-800 shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_5px_#b8b9be,inset_-2px_-2px_5px_#ffffff] active:scale-95 transition-all cursor-pointer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              
              {/* Google */}
              <button type="button" className="w-12 h-12 rounded-full bg-[#ecf0f3] flex items-center justify-center text-neutral-800 shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_5px_#b8b9be,inset_-2px_-2px_5px_#ffffff] active:scale-95 transition-all cursor-pointer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.445-2.89-6.445-6.445s2.89-6.445 6.445-6.445c1.555 0 2.973.555 4.09 1.482l3.23-3.23C19.034 1.83 15.84 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.8 0 12.24-5.44 12.24-12.24 0-.82-.085-1.61-.24-2.385H12.24z"/></svg>
              </button>
              
              {/* LinkedIn */}
              <button type="button" className="w-12 h-12 rounded-full bg-[#ecf0f3] flex items-center justify-center text-neutral-800 shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_5px_#b8b9be,inset_-2px_-2px_5px_#ffffff] active:scale-95 transition-all cursor-pointer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </button>
              
              {/* Twitter */}
              <button type="button" className="w-12 h-12 rounded-full bg-[#ecf0f3] flex items-center justify-center text-neutral-800 shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_5px_#b8b9be,inset_-2px_-2px_5px_#ffffff] active:scale-95 transition-all cursor-pointer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-neutral-500 text-xs font-bold">
            Don't have an account?{' '}
            <Link to="/register" className="text-neutral-800 hover:underline transition-all font-black">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

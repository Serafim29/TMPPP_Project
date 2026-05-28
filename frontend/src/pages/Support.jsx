import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildSupportChain } from '../utils/chainOfResponsibility/SupportChain';

function Support() {
  const [issueType, setIssueType] = useState('Basic');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultMsg('');

    try {
      const chain = buildSupportChain();
      
      const result = await chain.handle({ issueType, description });
      
      if (result.success) {
        setResultMsg(result.message);
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to process support request.");
    } finally {
      setLoading(false);
      setDescription('');
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white flex flex-col">
      {/* Minimal Navbar */}
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

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 md:px-12 py-16 max-w-4xl flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">How can we help?</h1>
          <p className="text-neutral-500 text-lg">Our Chain of Responsibility handles your tickets automatically through multiple support levels.</p>
        </div>

        <div className="w-full bg-[#f8f8f8] p-8 md:p-12 rounded-[2rem] border border-neutral-100 shadow-sm">
          {resultMsg && (
            <div className="mb-8 p-6 bg-green-50 text-green-800 rounded-2xl border border-green-200 font-bold text-center text-lg shadow-sm">
              {resultMsg}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-neutral-800 pl-2">What is the issue about?</label>
              <select 
                value={issueType} 
                onChange={e => setIssueType(e.target.value)} 
                className="w-full bg-white border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-black outline-none font-semibold text-neutral-700 shadow-sm transition-all cursor-pointer"
              >
                <option value="Basic">General Question (Level 1)</option>
                <option value="Password Reset">Password Reset (Level 1)</option>
                <option value="Technical">Technical Issue (Level 2)</option>
                <option value="Payment Issue">Payment Issue (Level 2)</option>
                <option value="Refund">Refund Request (Level 3 - Manager)</option>
                <option value="Critical">Critical Server Down (Level 3 - Manager)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-neutral-800 pl-2">Describe the problem</label>
              <textarea 
                required
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="w-full bg-white border-none p-4 rounded-2xl h-40 text-sm focus:ring-2 focus:ring-black outline-none font-medium text-neutral-700 shadow-sm transition-all resize-none"
                placeholder="I am having trouble with..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white font-bold py-5 px-6 rounded-full hover:bg-neutral-800 transition-colors disabled:opacity-50 mt-4 active:scale-95 text-lg"
            >
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Support;

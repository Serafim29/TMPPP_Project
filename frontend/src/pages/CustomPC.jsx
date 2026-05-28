import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PCBuilder } from '../utils/builder/PCBuilder';
import { PCConfigCaretaker } from '../utils/memento/PCConfigMemento';

// List of available components matching both frontend pricing and backend switch-cases
const CPU_OPTIONS = [
  { id: 'AMD Ryzen 5', name: 'AMD Ryzen 5', spec: '6 Cores / 12 Threads', price: 180 },
  { id: 'Intel i5', name: 'Intel Core i5', spec: '10 Cores / 16 Threads', price: 200 },
  { id: 'Intel i7', name: 'Intel Core i7', spec: '12 Cores / 20 Threads', price: 300 },
  { id: 'AMD Ryzen 9', name: 'AMD Ryzen 9', spec: '12 Cores / 24 Threads', price: 450 },
  { id: 'Intel i9', name: 'Intel Core i9', spec: '24 Cores / 32 Threads', price: 500 },
];

const RAM_OPTIONS = [
  { id: '8GB', name: '8GB DDR4', spec: '3200MHz Dual Channel', price: 40 },
  { id: '16GB', name: '16GB DDR4', spec: '3600MHz High Speed', price: 80 },
  { id: '32GB', name: '32GB DDR5', spec: '5200MHz Next-Gen', price: 150 },
  { id: '64GB', name: '64GB DDR5', spec: '6000MHz Ultra-Performance', price: 300 },
];

const GPU_OPTIONS = [
  { id: 'GTX 1660', name: 'NVIDIA GTX 1660', spec: '6GB VRAM Entry-Level', price: 200 },
  { id: 'RTX 3060', name: 'NVIDIA RTX 3060', spec: '12GB VRAM Ray Tracing', price: 350 },
  { id: 'RTX 4070', name: 'NVIDIA RTX 4070', spec: '12GB VRAM DLSS 3.0', price: 600 },
  { id: 'RX 7900 XTX', name: 'AMD RX 7900 XTX', spec: '24GB VRAM Flagship RDNA3', price: 1000 },
  { id: 'RTX 4090', name: 'NVIDIA RTX 4090', spec: '24GB VRAM Peak Powerhouse', price: 1600 },
];

function CustomPC() {
  const [cpu, setCpu] = useState('Intel i5');
  const [ram, setRam] = useState('16GB');
  const [gpu, setGpu] = useState('RTX 3060');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Instantiate Memento Caretaker once and preserve it in a ref across re-renders
  const caretakerRef = useRef(new PCConfigCaretaker());
  const caretaker = caretakerRef.current;

  // Track if we are currently performing an undo/redo to avoid adding redundant snapshots
  const isUndoingRedoing = useRef(false);

  // Initialize and save first snapshot on mount
  useEffect(() => {
    caretaker.clear();
    caretaker.save({ cpu, ram, gpu });
  }, []);

  // Whenever choices change by user interaction (not by undo/redo), save to Memento history
  const handleComponentSelect = (type, value) => {
    let nextCpu = cpu;
    let nextRam = ram;
    let nextGpu = gpu;

    if (type === 'cpu') { nextCpu = value; setCpu(value); }
    if (type === 'ram') { nextRam = value; setRam(value); }
    if (type === 'gpu') { nextGpu = value; setGpu(value); }

    caretaker.save({ cpu: nextCpu, ram: nextRam, gpu: nextGpu });
  };

  // Memento operations
  const handleUndo = () => {
    if (caretaker.canUndo()) {
      isUndoingRedoing.current = true;
      const prevState = caretaker.undo();
      if (prevState) {
        setCpu(prevState.cpu);
        setRam(prevState.ram);
        setGpu(prevState.gpu);
      }
      isUndoingRedoing.current = false;
    }
  };

  const handleRedo = () => {
    if (caretaker.canRedo()) {
      isUndoingRedoing.current = true;
      const nextState = caretaker.redo();
      if (nextState) {
        setCpu(nextState.cpu);
        setRam(nextState.ram);
        setGpu(nextState.gpu);
      }
      isUndoingRedoing.current = false;
    }
  };

  // BUILDER PATTERN execution: instantiate builder, set items, build final product model
  const pcBuilder = new PCBuilder();
  pcBuilder.setCPU(cpu).setRAM(ram).setGPU(gpu);
  const pcProduct = pcBuilder.build();
  const totalPrice = pcProduct.price;

  const handleBuild = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5200/api/custompc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpu, ram, gpu })
      });
      const data = await res.json();
      if (res.ok) {
        // Redirect to ProductDetails page passing the built product model
        const newProduct = {
          id: data.id,
          realId: data.id,
          displayId: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          displayPrice: data.price,
          category: "For Home",
          image_url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=1000",
          rating: '5.0',
          reviews: 0
        };
        navigate(`/product/${data.id}`, { state: { product: newProduct } });
      } else {
        alert("Error: " + data.error);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to reach backend.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-neutral-900 font-sans selection:bg-black selection:text-white flex flex-col relative overflow-hidden">
      <div className="absolute top-[5%] left-[-15%] w-[60%] h-[50%] bg-blue-100/40 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-15%] w-[60%] h-[50%] bg-orange-100/30 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[50%] w-[350px] h-[350px] bg-purple-100/30 rounded-full blur-[100px] pointer-events-none"></div>

      <nav className="bg-white/80 backdrop-blur-md border-b border-neutral-100 py-4 px-6 md:px-12 sticky top-0 z-50">
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
      <main className="flex-grow container mx-auto px-4 md:px-8 py-12 max-w-[1400px] z-10">
        <div className="text-center mb-12 relative">
          <span className="text-neutral-500 text-[10px] font-black tracking-[0.2em] uppercase bg-neutral-100 px-4 py-1.5 rounded-full border border-neutral-200/50">
            Custom Configurator
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-5 mb-4 text-neutral-900 leading-tight">
            Asamblează PC-ul Tău
          </h1>
          <p className="text-neutral-500 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed">
            Personalizează-ți computerul ideal. Dezvoltat prin <strong className="text-black">Builder Pattern</strong> și asigurat cu istoric reversibil <strong className="text-black">Memento History</strong>.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Options Panels */}
          <div className="flex-[3] space-y-8">
                        <div className="bg-white/60 backdrop-blur-md border border-white/80 p-4 rounded-[1.8rem] flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
              <div className="flex items-center gap-2.5 pl-2">
                <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
                <span className="text-[11px] font-bold tracking-wider text-neutral-500 uppercase font-mono">
                  Istoric Configurații (Memento)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={handleUndo}
                  disabled={!caretaker.canUndo()}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    caretaker.canUndo() 
                    ? 'bg-neutral-100 text-neutral-900 hover:bg-black hover:text-white hover:shadow-md active:scale-95' 
                    : 'bg-neutral-50/50 text-neutral-300 border border-neutral-100 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/></svg>
                  Undo
                </button>
                <button 
                  type="button"
                  onClick={handleRedo}
                  disabled={!caretaker.canRedo()}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    caretaker.canRedo() 
                    ? 'bg-neutral-100 text-neutral-900 hover:bg-black hover:text-white hover:shadow-md active:scale-95' 
                    : 'bg-neutral-50/50 text-neutral-300 border border-neutral-100 cursor-not-allowed'
                  }`}
                >
                  Redo
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4zM19.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z"/></svg>
                </button>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-md border border-white/60 p-6 md:p-8 rounded-[2.2rem] shadow-[0_10px_40px_rgba(0,0,0,0.01)] relative">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-800 font-extrabold text-xs flex items-center justify-center border border-neutral-200">1</span>
                <h2 className="text-lg font-black tracking-wider uppercase text-neutral-950">Selectează Procesorul (CPU)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CPU_OPTIONS.map((item) => {
                  const isActive = cpu === item.id;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => handleComponentSelect('cpu', item.id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between hover:translate-y-[-2px] relative overflow-hidden group ${
                        isActive 
                        ? 'bg-white border-black shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1)]' 
                        : 'bg-white/40 border-neutral-100 hover:border-neutral-300/80 hover:bg-white/60'
                      }`}
                    >
                      {isActive && <div className="absolute top-0 right-0 bg-black text-white font-bold text-[9px] px-2.5 py-0.5 rounded-bl-lg tracking-wider">SELECTAT</div>}
                      <div>
                        <h4 className="font-extrabold text-sm text-neutral-900 group-hover:text-black transition-colors">{item.name}</h4>
                        <p className="text-xs text-neutral-400 mt-1 font-medium">{item.spec}</p>
                      </div>
                      <span className="font-black text-sm text-neutral-900 mt-4 block">+${item.price}.00</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-md border border-white/60 p-6 md:p-8 rounded-[2.2rem] shadow-[0_10px_40px_rgba(0,0,0,0.01)] relative">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-800 font-extrabold text-xs flex items-center justify-center border border-neutral-200">2</span>
                <h2 className="text-lg font-black tracking-wider uppercase text-neutral-950">Selectează Memoria (RAM)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RAM_OPTIONS.map((item) => {
                  const isActive = ram === item.id;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => handleComponentSelect('ram', item.id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between hover:translate-y-[-2px] relative overflow-hidden group ${
                        isActive 
                        ? 'bg-white border-black shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1)]' 
                        : 'bg-white/40 border-neutral-100 hover:border-neutral-300/80 hover:bg-white/60'
                      }`}
                    >
                      {isActive && <div className="absolute top-0 right-0 bg-black text-white font-bold text-[9px] px-2.5 py-0.5 rounded-bl-lg tracking-wider">SELECTAT</div>}
                      <div>
                        <h4 className="font-extrabold text-sm text-neutral-900 group-hover:text-black transition-colors">{item.name}</h4>
                        <p className="text-xs text-neutral-400 mt-1 font-medium">{item.spec}</p>
                      </div>
                      <span className="font-black text-sm text-neutral-900 mt-4 block">+${item.price}.00</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-md border border-white/60 p-6 md:p-8 rounded-[2.2rem] shadow-[0_10px_40px_rgba(0,0,0,0.01)] relative">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-800 font-extrabold text-xs flex items-center justify-center border border-neutral-200">3</span>
                <h2 className="text-lg font-black tracking-wider uppercase text-neutral-950">Selectează Placa Video (GPU)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GPU_OPTIONS.map((item) => {
                  const isActive = gpu === item.id;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => handleComponentSelect('gpu', item.id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between hover:translate-y-[-2px] relative overflow-hidden group ${
                        isActive 
                        ? 'bg-white border-black shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1)]' 
                        : 'bg-white/40 border-neutral-100 hover:border-neutral-300/80 hover:bg-white/60'
                      }`}
                    >
                      {isActive && <div className="absolute top-0 right-0 bg-black text-white font-bold text-[9px] px-2.5 py-0.5 rounded-bl-lg tracking-wider">SELECTAT</div>}
                      <div>
                        <h4 className="font-extrabold text-sm text-neutral-900 group-hover:text-black transition-colors">{item.name}</h4>
                        <p className="text-xs text-neutral-400 mt-1 font-medium">{item.spec}</p>
                      </div>
                      <span className="font-black text-sm text-neutral-900 mt-4 block">+${item.price}.00</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Sticky Configuration Summary Card in frosted style */}
          <div className="flex-[2] lg:max-w-[420px]">
            <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-8 rounded-[2.2rem] shadow-[0_20px_50px_rgba(0,0,0,0.035)] sticky top-24 space-y-6 relative overflow-hidden">
              <div className="absolute top-[-30px] right-[-30px] w-20 h-20 bg-blue-100/30 rounded-full blur-xl"></div>
              
              <div>
                <h3 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1">Specificații</h3>
                <h2 className="text-xl font-black text-neutral-900 tracking-tight">Rezumat Desktop</h2>
              </div>

              {/* Hardware specification stack */}
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                
                {/* CPU */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-200/50 text-neutral-800 flex items-center justify-center shrink-0">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                  </div>
                  <div>
                    <span className="text-[9px] tracking-wider text-neutral-400 font-bold uppercase block">Procesor</span>
                    <span className="text-xs font-black text-neutral-800">{CPU_OPTIONS.find(c => c.id === cpu)?.name}</span>
                  </div>
                </div>

                {/* RAM */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-200/50 text-neutral-800 flex items-center justify-center shrink-0">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <div>
                    <span className="text-[9px] tracking-wider text-neutral-400 font-bold uppercase block">Memorie</span>
                    <span className="text-xs font-black text-neutral-800">{RAM_OPTIONS.find(r => r.id === ram)?.name}</span>
                  </div>
                </div>

                {/* GPU */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-200/50 text-neutral-800 flex items-center justify-center shrink-0">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <span className="text-[9px] tracking-wider text-neutral-400 font-bold uppercase block">Placă Video</span>
                    <span className="text-xs font-black text-neutral-800">{GPU_OPTIONS.find(g => g.id === gpu)?.name}</span>
                  </div>
                </div>

              </div>

              {/* Price segment */}
              <div className="pt-6 border-t border-neutral-100">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Preț configurat</span>
                    <span className="text-[10px] text-neutral-400 mt-1 font-mono font-medium">Asamblat la standard</span>
                  </div>
                  <span className="text-3xl font-extrabold tracking-tight text-neutral-900">${totalPrice}.00</span>
                </div>

                <form onSubmit={handleBuild}>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-black text-white font-extrabold py-4 px-6 rounded-full transition-all duration-300 disabled:opacity-50 active:scale-95 shadow-md shadow-neutral-900/10 cursor-pointer text-center group tracking-wider text-xs uppercase"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Se asamblează...
                      </div>
                    ) : 'Asamblează și Cumpără'}
                  </button>
                </form>
              </div>

              {/* Builder log panel */}
              <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-2xl text-[10px] text-neutral-500 font-medium leading-relaxed font-mono">
                <span className="text-neutral-700 font-bold block mb-1">PRODUSUL CONSTRUIT:</span>
                {pcProduct.description}
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default CustomPC;

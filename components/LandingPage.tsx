
import React from 'react';
import { ToolType, HistoryItem } from '../types';
import { 
  ArrowRight, Sparkles, Zap, Smartphone, 
  Dice1, Lock, Coins, Layers, Shuffle, Calculator, Brain, 
  RotateCw, Globe, ArrowRightLeft, Type, ShieldCheck
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (type: ToolType) => void;
  recentHistory: HistoryItem[];
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, recentHistory }) => {
  
  const scrollToTools = () => {
    document.getElementById('tool-categories')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-full animate-in fade-in duration-500 overflow-x-hidden">
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 border-b border-slate-800 overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
             
             {/* Left: Text Content */}
             <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 text-sm font-medium mb-8 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Smart AI Tools Available Now</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                  Smart Random Tools <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">for Everyone</span>
                </h1>
                
                <p className="text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                  Generate numbers, text, choices, converters, games — fast, accurate and free.
                  The modern toolkit for developers, gamers, and creators.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <button 
                      onClick={() => onNavigate(ToolType.BASIC)}
                      className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      Start Generating <ArrowRight className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={scrollToTools}
                      className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all"
                    >
                      Explore Tools
                    </button>
                </div>
             </div>

             {/* Right: Visual */}
             <div className="flex-1 relative w-full max-w-lg lg:max-w-full">
                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 group animate-float">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 z-10"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1620641788421-7f1c91ade3a0?q=80&w=1200&auto=format&fit=crop" 
                      alt="Abstract 3D Randomness" 
                      className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                </div>

                {/* Floating Widget 1: Secure Password */}
                <div className="absolute -bottom-6 -left-6 bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-2xl z-20 hidden md:block animate-float-delayed">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/20 rounded-lg text-emerald-400 ring-1 ring-emerald-500/30"><Lock className="w-5 h-5"/></div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Secure Key</div>
                          <div className="text-white font-mono text-lg tracking-wider">a8F9#k2L</div>
                        </div>
                    </div>
                </div>

                {/* Floating Widget 2: Dice Result */}
                <div className="absolute -top-8 -right-8 bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-2xl z-20 hidden md:block animate-float" style={{animationDelay: '0.5s'}}>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-500/20 rounded-lg text-indigo-400 ring-1 ring-indigo-500/30"><Dice1 className="w-5 h-5"/></div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Result</div>
                          <div className="text-white font-bold text-2xl">42</div>
                        </div>
                    </div>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* 2. TOOLS GRID SECTION */}
      <section id="tool-categories" className="max-w-7xl mx-auto px-4 py-24">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Complete Tool Suite</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need in one secure platform.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Numbers */}
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors group">
               <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <Dice1 className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">Numbers</h3>
               <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Advanced random number generation, custom ranges, lottery quick picks, and mathematical sets.
               </p>
               <div className="flex flex-wrap gap-2">
                  <span onClick={() => onNavigate(ToolType.BASIC)} className="text-xs px-2 py-1 bg-slate-900 rounded text-slate-300 cursor-pointer hover:text-white border border-slate-700">RNG</span>
                  <span onClick={() => onNavigate(ToolType.LOTTERY)} className="text-xs px-2 py-1 bg-slate-900 rounded text-slate-300 cursor-pointer hover:text-white border border-slate-700">Lottery</span>
                  <span onClick={() => onNavigate(ToolType.MATH)} className="text-xs px-2 py-1 bg-slate-900 rounded text-slate-300 cursor-pointer hover:text-white border border-slate-700">Math</span>
               </div>
            </div>

            {/* Decisions */}
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors group">
               <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                  <RotateCw className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">Decisions</h3>
               <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Make unbiased choices instantly. Flip coins, roll dice, spin wheels, and randomize lists.
               </p>
               <div className="flex flex-wrap gap-2">
                  <span onClick={() => onNavigate(ToolType.GAMES)} className="text-xs px-2 py-1 bg-slate-900 rounded text-slate-300 cursor-pointer hover:text-white border border-slate-700">Coin/Dice</span>
                  <span onClick={() => onNavigate(ToolType.UTILITY)} className="text-xs px-2 py-1 bg-slate-900 rounded text-slate-300 cursor-pointer hover:text-white border border-slate-700">List Picker</span>
               </div>
            </div>

            {/* Text Tools */}
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors group">
               <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                  <Type className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">Text Tools</h3>
               <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Generate secure passwords, UUIDs, strings, and clean up text formatting effortlessly.
               </p>
               <div className="flex flex-wrap gap-2">
                  <span onClick={() => onNavigate(ToolType.TECHNICAL)} className="text-xs px-2 py-1 bg-slate-900 rounded text-slate-300 cursor-pointer hover:text-white border border-slate-700">Passwords</span>
                  <span onClick={() => onNavigate(ToolType.TECHNICAL)} className="text-xs px-2 py-1 bg-slate-900 rounded text-slate-300 cursor-pointer hover:text-white border border-slate-700">UUID</span>
               </div>
            </div>

            {/* Converters */}
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors group">
               <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                  <ArrowRightLeft className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">Converters</h3>
               <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Transform data between formats. Hex to Decimal, Binary, RGB colors, and Roman numerals.
               </p>
               <div className="flex flex-wrap gap-2">
                  <span onClick={() => onNavigate(ToolType.UTILITY)} className="text-xs px-2 py-1 bg-slate-900 rounded text-slate-300 cursor-pointer hover:text-white border border-slate-700">Base Converter</span>
                  <span onClick={() => onNavigate(ToolType.TECHNICAL)} className="text-xs px-2 py-1 bg-slate-900 rounded text-slate-300 cursor-pointer hover:text-white border border-slate-700">Colors</span>
               </div>
            </div>

            {/* AI Tools */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-slate-800 p-8 rounded-2xl border border-indigo-500/30 hover:border-indigo-500/50 transition-colors group md:col-span-2 lg:col-span-2 cursor-pointer" onClick={() => onNavigate(ToolType.AI)}>
               <div className="flex items-start justify-between">
                  <div>
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-300 mb-6 group-hover:scale-110 transition-transform">
                        <Brain className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">AI Creative Studio</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-md">
                        Powered by Gemini AI. Generate creative concepts, names, ideas, and context-aware random lists that standard algorithms can't handle.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 bg-indigo-500/20 rounded text-indigo-300 border border-indigo-500/30">AI Generator</span>
                        <span className="text-xs px-2 py-1 bg-indigo-500/20 rounded text-indigo-300 border border-indigo-500/30">Creative Writing</span>
                    </div>
                  </div>
                  <ArrowRight className="text-indigo-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
               </div>
            </div>

         </div>
      </section>

      {/* 4. POPULAR QUICK ACTIONS */}
      <section className="py-12 bg-slate-900/50 border-y border-slate-800">
         <div className="max-w-7xl mx-auto px-4 w-full">
             <h3 className="text-center text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Popular Quick Actions</h3>
             <div className="flex flex-wrap justify-center gap-4">
                {[
                   { label: 'Generate 1-100', icon: Dice1, action: () => onNavigate(ToolType.BASIC) },
                   { label: 'Flip a Coin', icon: Coins, action: () => onNavigate(ToolType.GAMES) },
                   { label: 'Pick 6 Lottery', icon: Layers, action: () => onNavigate(ToolType.LOTTERY) },
                   { label: 'Spin a Wheel', icon: RotateCw, action: () => onNavigate(ToolType.UTILITY) },
                   { label: 'Generate Password', icon: Lock, action: () => onNavigate(ToolType.TECHNICAL) },
                   { label: 'Random Country', icon: Globe, action: () => onNavigate(ToolType.AI) },
                ].map((btn, i) => (
                   <button 
                      key={i}
                      onClick={btn.action}
                      className="flex items-center gap-3 px-6 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl text-slate-300 hover:text-white transition-all shadow-sm hover:-translate-y-1"
                   >
                      <btn.icon className="w-5 h-5 text-indigo-400" />
                      <span className="font-semibold">{btn.label}</span>
                   </button>
                ))}
             </div>
         </div>
      </section>

      {/* 5. NEW VISUAL SECTION: AI INTELLIGENCE */}
      <section className="py-24 bg-slate-900 border-b border-slate-800 overflow-hidden relative">
          <div className="absolute inset-0 bg-indigo-900/10 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 w-full order-2 md:order-1">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/80 to-transparent z-10"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop" 
                        alt="Artificial Intelligence Network" 
                        className="w-full h-auto transform transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 p-8 z-20">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-xs font-mono text-indigo-300 mb-2">
                              <Sparkles className="w-3 h-3" /> Gemini 2.5 Flash
                          </div>
                          <h3 className="text-2xl font-bold text-white">Generative Intelligence</h3>
                      </div>
                  </div>
              </div>
              <div className="flex-1 space-y-8 order-1 md:order-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Beyond Simple Randomness</h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                      Standard generators are limited to math. NexusRandom leverages Google's Gemini AI to understand 
                      <span className="text-indigo-400 italic font-semibold"> context</span>. 
                      Ask for "Sci-fi city names" or "Dinner ideas" and get creative, unique results instantly.
                  </p>
                  <ul className="space-y-4">
                      {[
                          "Context-aware generation",
                          "Creative writing prompts",
                          "Unique data sets for developers"
                      ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-slate-300">
                              <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                                  <ArrowRight className="w-3 h-3" />
                              </div>
                              {item}
                          </li>
                      ))}
                  </ul>
                  <button 
                    onClick={() => onNavigate(ToolType.AI)}
                    className="mt-4 px-8 py-3 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-lg transition-colors shadow-lg"
                  >
                      Try AI Tools
                  </button>
              </div>
          </div>
      </section>

      {/* 6. FEATURE HIGHLIGHTS */}
      <section className="bg-slate-800/30 py-24">
          <div className="max-w-7xl mx-auto px-4">
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
                <div className="space-y-3">
                   <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-green-400 border border-slate-700"><Zap className="w-6 h-6"/></div>
                   <h4 className="font-bold text-white text-sm">Fast & Accurate</h4>
                </div>
                <div className="space-y-3">
                   <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 border border-slate-700"><ShieldCheck className="w-6 h-6"/></div>
                   <h4 className="font-bold text-white text-sm">Ad-Free Premium</h4>
                </div>
                 <div className="space-y-3">
                   <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 border border-slate-700"><Layers className="w-6 h-6"/></div>
                   <h4 className="font-bold text-white text-sm">Custom Lists</h4>
                </div>
                 <div className="space-y-3">
                   <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-pink-400 border border-slate-700"><Smartphone className="w-6 h-6"/></div>
                   <h4 className="font-bold text-white text-sm">Mobile Friendly</h4>
                </div>
                 <div className="space-y-3">
                   <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 border border-slate-700"><Brain className="w-6 h-6"/></div>
                   <h4 className="font-bold text-white text-sm">Smart AI Tools</h4>
                </div>
             </div>
          </div>
      </section>

      {/* 7. RECENT ACTIVITY */}
      {recentHistory.length > 0 && (
          <section className="py-16 bg-slate-900 border-t border-slate-800">
             <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                   <span className="text-xs text-slate-500 uppercase tracking-widest">Your Session</span>
                </div>
                <div className="space-y-3">
                   {recentHistory.slice(0, 3).map((item) => (
                      <div key={item.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center justify-between">
                         <div>
                            <div className="text-xs text-indigo-400 font-bold mb-1">{item.label}</div>
                            <div className="text-slate-300 text-sm font-mono truncate max-w-md">
                               {Array.isArray(item.result) ? item.result.join(', ') : item.result}
                            </div>
                         </div>
                         <div className="text-xs text-slate-500 font-mono">
                            {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </section>
      )}

      {/* 8. ABOUT SECTION */}
      <section className="py-24 max-w-3xl mx-auto px-4 text-center">
         <h2 className="text-3xl font-bold text-white mb-6">About NexusRandom</h2>
         <p className="text-lg text-slate-400 leading-relaxed">
            NexusRandom is a free online toolkit offering random number generators,
            lottery tools, decision makers, text utilities, converters, and smart AI —
            designed for gamers, students, coders, creators, teachers, and everyday users.
         </p>
         <button onClick={() => onNavigate(ToolType.ABOUT)} className="mt-8 text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-2 mx-auto">
            Read full story <ArrowRight className="w-4 h-4" />
         </button>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
               <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white"><Dice1 className="w-4 h-4" /></div>
                  <span className="font-bold text-white text-lg">NexusRandom</span>
               </div>
               <p className="text-slate-600 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
               <button onClick={() => onNavigate(ToolType.ABOUT)} className="hover:text-white transition-colors">Privacy Policy</button>
               <button onClick={() => onNavigate(ToolType.ABOUT)} className="hover:text-white transition-colors">Terms</button>
               <button onClick={() => onNavigate(ToolType.ABOUT)} className="hover:text-white transition-colors">Contact</button>
               <button onClick={scrollToTools} className="hover:text-white transition-colors">All Tools</button>
               <span className="hover:text-white transition-colors cursor-pointer">Sitemap</span>
            </div>
         </div>
      </footer>

    </div>
  );
};

export default LandingPage;

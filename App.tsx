import React, { useState, useEffect } from 'react';
import { ToolType, HistoryItem } from './types';
import BasicRNG from './components/BasicRNG';
import UtilityTools from './components/ListRNG';
import LotteryRNG from './components/LotteryRNG';
import TechnicalRNG from './components/TechnicalRNG';
import AiRNG from './components/AiRNG';
import GamesRNG from './components/GamesRNG';
import MathRNG from './components/MathRNG';
import AdUnit from './components/AdUnit';
import PaymentModal from './components/DonationModal'; // Internally serves as PaymentModal
import { Dice1, Wrench, Ticket, Terminal, Sparkles, Clock, Trash2, ArrowRight, Gamepad2, Calculator, Menu, X, Crown, Star, Copy } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolType>(ToolType.BASIC);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Premium State
  const [isPremium, setIsPremium] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    const premiumStatus = localStorage.getItem('nexus_premium');
    if (premiumStatus === 'true') {
      setIsPremium(true);
    }
  }, []);

  const activatePremium = () => {
    setIsPremium(true);
    localStorage.setItem('nexus_premium', 'true');
    setPaymentModalOpen(false);
    alert("Premium activated! Thank you for your support.");
  };

  const handleGenerate = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev].slice(0, 50));
  };

  const clearHistory = () => setHistory([]);

  const copyAllHistory = () => {
    if (history.length === 0) return;
    const text = history.map(item => {
      const time = new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const res = Array.isArray(item.result) ? item.result.join(', ') : item.result;
      return `${time} - ${item.label}: ${res}`;
    }).join('\n');
    navigator.clipboard.writeText(text);
    // Optional: Visual feedback could be added here
  };

  const handleTabChange = (id: ToolType) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const renderActiveTool = () => {
    switch (activeTab) {
      case ToolType.BASIC: return <BasicRNG onGenerate={handleGenerate} />;
      case ToolType.UTILITY: return <UtilityTools onGenerate={handleGenerate} />;
      case ToolType.LOTTERY: return <LotteryRNG onGenerate={handleGenerate} />;
      case ToolType.TECHNICAL: return <TechnicalRNG onGenerate={handleGenerate} />;
      case ToolType.AI: return <AiRNG onGenerate={handleGenerate} />;
      case ToolType.GAMES: return <GamesRNG onGenerate={handleGenerate} />;
      case ToolType.MATH: return <MathRNG onGenerate={handleGenerate} />;
      default: return <BasicRNG onGenerate={handleGenerate} />;
    }
  };

  const tabs = [
    { id: ToolType.BASIC, label: 'Numbers', icon: Dice1, desc: 'Ranges, Sets & Codes' },
    { id: ToolType.UTILITY, label: 'Utility Tools', icon: Wrench, desc: 'Operations & Conversion' },
    { id: ToolType.LOTTERY, label: 'Lottery', icon: Ticket, desc: 'Draw simulation' },
    { id: ToolType.GAMES, label: 'Games & Fun', icon: Gamepad2, desc: 'Dice, Coins, Yes/No' },
    { id: ToolType.MATH, label: 'Math Features', icon: Calculator, desc: 'Partitions, Primes & Logic' },
    { id: ToolType.TECHNICAL, label: 'Technical', icon: Terminal, desc: 'Colors, Testing & Crypto' },
    { id: ToolType.AI, label: 'Smart AI', icon: Sparkles, desc: 'Contextual random' },
  ];

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Mobile Header */}
      <header className="md:hidden h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-40 relative">
         <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPremium ? 'bg-amber-500' : 'bg-indigo-600'}`}>
              <Dice1 className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Nexus<span className={`font-light ${isPremium ? 'text-amber-400' : 'text-indigo-400'}`}>Random</span>
            </h1>
            {isPremium && <Crown className="w-4 h-4 text-amber-500 ml-1" />}
         </div>
         <button 
           onClick={() => setSidebarOpen(!sidebarOpen)} 
           className="p-2 text-slate-400 hover:text-white transition-colors"
           aria-label="Toggle Menu"
         >
           {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
         </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        bg-slate-900 border-r border-slate-800 flex-col z-30
        md:w-64 lg:w-72 md:flex
        ${sidebarOpen ? 'fixed inset-0 top-16 flex' : 'hidden'}
        md:static md:h-full
      `}>
        {/* Desktop Logo Area */}
        <div className="hidden md:flex p-6 border-b border-slate-800 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${isPremium ? 'bg-gradient-to-br from-amber-400 to-orange-600' : 'bg-indigo-600'}`}>
              <Dice1 className="text-white w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-none">
                Nexus<span className={`font-light ${isPremium ? 'text-amber-400' : 'text-indigo-400'}`}>Random</span>
              </h1>
              {isPremium && <span className="text-[10px] text-amber-500 font-bold tracking-widest uppercase">Premium</span>}
            </div>
          </div>
        </div>

        {/* Tab List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-slate-900">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === tab.id 
                ? 'bg-indigo-600/10 text-indigo-300 border border-indigo-500/20' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <tab.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <div className="text-left overflow-hidden">
                <div className="font-medium text-sm truncate">{tab.label}</div>
                <div className="text-xs opacity-60 font-light truncate">{tab.desc}</div>
              </div>
              {activeTab === tab.id && <ArrowRight className="w-4 h-4 ml-auto text-indigo-400 flex-shrink-0" />}
            </button>
          ))}
          
          {/* Premium / Support Section */}
          <div className="pt-4 mt-6 border-t border-slate-800/50 px-2">
             {!isPremium ? (
               <>
                <div className="text-xs font-bold text-slate-500 uppercase px-2 mb-3">Upgrade</div>
                <button 
                  onClick={() => setPaymentModalOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white transition-all shadow-lg shadow-orange-900/20 group border border-white/10"
                >
                  <Crown className="w-5 h-5 fill-white/20 group-hover:fill-white/40 transition-colors shrink-0" />
                  <div className="text-left overflow-hidden">
                    <div className="font-bold text-sm truncate">Go Premium</div>
                    <div className="text-[10px] opacity-90 font-light truncate">Remove Ads • $2.00</div>
                  </div>
                </button>
               </>
             ) : (
                <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-amber-500/20 flex items-center gap-3">
                   <div className="p-2 bg-amber-500/10 rounded-full">
                     <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                   </div>
                   <div>
                      <div className="text-sm font-bold text-white">Premium Active</div>
                      <div className="text-[10px] text-slate-400">Thanks for supporting!</div>
                   </div>
                </div>
             )}
          </div>

          {/* Sidebar Ad Unit (Hidden if Premium) */}
          {!isPremium && (
            <div className="pt-4 mt-6 border-t border-slate-800/50 space-y-4 px-2 flex justify-center">
               <AdUnit format="rectangle" className="opacity-80 scale-90" />
            </div>
          )}
        </nav>
        
        {/* Desktop History Widget */}
        <div className="p-4 border-t border-slate-800 hidden md:block bg-slate-900">
          <div className="flex items-center justify-between mb-3">
             <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
               <Clock className="w-3 h-3" /> Recent Activity
             </h4>
             {history.length > 0 && (
               <div className="flex items-center gap-2">
                  <button onClick={copyAllHistory} className="text-slate-600 hover:text-indigo-400 transition-colors" title="Copy All">
                    <Copy className="w-3 h-3" />
                  </button>
                  <button onClick={clearHistory} className="text-slate-600 hover:text-red-400 transition-colors" title="Clear">
                    <Trash2 className="w-3 h-3" />
                  </button>
               </div>
             )}
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
            {history.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-4">No history yet.</p>
            ) : (
              history.map(item => (
                <div key={item.id} className="bg-slate-800/50 p-2 rounded border border-slate-700/50 text-xs">
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span className="truncate max-w-[120px]">{item.label}</span>
                    <span>{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="font-mono text-slate-300 truncate">
                    {Array.isArray(item.result) ? item.result.join(', ') : item.result}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-slate-950 relative z-0">
        <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-12 pb-24">
          
          <header className="mb-6 md:mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{tabs.find(t => t.id === activeTab)?.label}</h2>
              <p className="text-sm md:text-base text-slate-400">{tabs.find(t => t.id === activeTab)?.desc}</p>
            </div>
          </header>

          {/* Main Content Ad Banner (Hidden if Premium) */}
          {!isPremium && (
            <div className="mb-8 w-full overflow-hidden">
               <AdUnit format="horizontal" />
            </div>
          )}

          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4 md:p-8 shadow-2xl backdrop-blur-sm min-h-[400px]">
            {renderActiveTool()}
          </div>

          {/* SEO Footer Content */}
          <section className="mt-16 text-center border-t border-slate-800/50 pt-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Free Random Generators & Online Utility Tools</h2>
            <p className="text-sm md:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed">
              NexusRandom offers fast, simple and free tools including random number 
              generator, lottery number picker, dice roller, coin flip, yes or no generator, 
              unit converters, math calculators and fun decision-making utilities.
              Whether you need random results for games, work, study or entertainment,
              our tools are built to be accurate, easy to use and available instantly online.
            </p>
          </section>

          {/* Mobile History View */}
          <div className="md:hidden mt-10 border-t border-slate-800 pt-8">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-bold text-slate-400">Recent History</h3>
               {history.length > 0 && (
                 <div className="flex items-center gap-3">
                   <button onClick={copyAllHistory} className="text-xs text-slate-600 hover:text-indigo-400 flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copy
                   </button>
                   <button onClick={clearHistory} className="text-xs text-slate-600 hover:text-red-400 flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Clear
                   </button>
                 </div>
               )}
             </div>
             
             {history.length === 0 ? (
                <p className="text-center text-slate-600 py-4 text-sm">No activity yet.</p>
             ) : (
               <div className="space-y-3">
                  {history.slice(0, 5).map(item => (
                     <div key={item.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                           <span>{item.label}</span>
                           <span>{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="font-mono text-slate-200 truncate text-sm">
                           {Array.isArray(item.result) ? item.result.join(', ') : item.result}
                        </div>
                     </div>
                  ))}
               </div>
             )}
          </div>

        </div>
      </main>
      
      {/* Payment Gateway Modal */}
      <PaymentModal 
        isOpen={paymentModalOpen} 
        onClose={() => setPaymentModalOpen(false)} 
        onSuccess={activatePremium}
      />
    </div>
  );
};

export default App;
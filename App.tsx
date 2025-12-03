
import React, { useState } from 'react';
import { ToolType, HistoryItem } from './types';
import BasicRNG from './components/BasicRNG';
import UtilityTools from './components/ListRNG';
import LotteryRNG from './components/LotteryRNG';
import TechnicalRNG from './components/TechnicalRNG';
import AiRNG from './components/AiRNG';
import GamesRNG from './components/GamesRNG';
import MathRNG from './components/MathRNG';
import LandingPage from './components/LandingPage';
import { AboutUs } from './components/InfoPages';
import AdUnit from './components/AdUnit';
import PaymentModal from './components/DonationModal';
import { Dice1, Wrench, Ticket, Terminal, Sparkles, Clock, Trash2, Gamepad2, Calculator, Menu, X, Copy, Info, Crown, Home } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolType>(ToolType.HOME);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Premium / Monetization State
  const [isPremium, setIsPremium] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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
  };

  const handleTabChange = (id: ToolType) => {
    setActiveTab(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Maps ToolType to the specific Component
  const renderActiveTool = () => {
    switch (activeTab) {
      case ToolType.HOME: return <LandingPage onNavigate={handleTabChange} recentHistory={history} />;
      case ToolType.BASIC: return <BasicRNG onGenerate={handleGenerate} />;
      case ToolType.UTILITY: return <UtilityTools onGenerate={handleGenerate} />;
      case ToolType.LOTTERY: return <LotteryRNG onGenerate={handleGenerate} />;
      case ToolType.TECHNICAL: return <TechnicalRNG onGenerate={handleGenerate} />;
      case ToolType.AI: return <AiRNG onGenerate={handleGenerate} />;
      case ToolType.GAMES: return <GamesRNG onGenerate={handleGenerate} />;
      case ToolType.MATH: return <MathRNG onGenerate={handleGenerate} />;
      case ToolType.ABOUT: return <AboutUs />;
      default: return <LandingPage onNavigate={handleTabChange} recentHistory={history} />;
    }
  };

  const tabs = [
    { id: ToolType.HOME, label: 'Home', icon: Home, desc: 'Dashboard' },
    { id: ToolType.BASIC, label: 'Numbers', icon: Dice1, desc: 'Ranges & Sets' },
    { id: ToolType.UTILITY, label: 'Utility', icon: Wrench, desc: 'List Ops' },
    { id: ToolType.LOTTERY, label: 'Lottery', icon: Ticket, desc: 'Quick Pick' },
    { id: ToolType.GAMES, label: 'Games', icon: Gamepad2, desc: 'Dice & Coins' },
    { id: ToolType.MATH, label: 'Math', icon: Calculator, desc: 'Calc & Primes' },
    { id: ToolType.TECHNICAL, label: 'Tech', icon: Terminal, desc: 'Dev Tools' },
    { id: ToolType.AI, label: 'Smart AI', icon: Sparkles, desc: 'Magic Gen' },
  ];

  const infoTabs = [
    { id: ToolType.ABOUT, label: 'About', icon: Info, desc: 'Info' },
  ];

  // Helper to get current tab info safely
  const currentTabInfo = [...tabs, ...infoTabs].find(t => t.id === activeTab) || tabs[0];

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 flex flex-col md:flex-row font-sans overflow-hidden">
        
      {/* Mobile Header */}
      <header className="md:hidden h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-40">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleTabChange(ToolType.HOME)}>
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center">
              <Dice1 className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Nexus<span className="text-indigo-400">Random</span>
            </h1>
        </div>
        <div className="flex items-center gap-2">
          {!isPremium && (
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="p-1.5 bg-amber-500/10 text-amber-500 rounded-md border border-amber-500/20"
            >
              <Crown className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 text-slate-300 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        bg-slate-900 border-r border-slate-800 flex-col z-30
        md:w-64 lg:w-72 md:flex
        ${sidebarOpen ? 'fixed inset-0 top-16 flex' : 'hidden'}
        md:static md:h-full
      `}>
        {/* Desktop Logo Area */}
        <div className="hidden md:flex p-6 items-center justify-between border-b border-slate-800/50">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabChange(ToolType.HOME)}>
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Dice1 className="text-white w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Nexus<span className="text-indigo-500">Random</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Tab List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isActive
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${isActive ? 'text-indigo-200' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <div className="text-left">
                  <div className={`font-medium text-sm ${isActive ? 'text-white' : ''}`}>{tab.label}</div>
                </div>
              </button>
            )
          })}
          
          <div className="pt-6 mt-4 space-y-2 border-t border-slate-800/50">
            <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Info</div>
            {infoTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
                  activeTab === tab.id 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
                <div className="font-medium text-sm">{tab.label}</div>
              </button>
            ))}
          </div>

           {/* Sidebar Ad (Mobile only inside menu) */}
           {!isPremium && sidebarOpen && (
              <div className="mt-4 px-2 md:hidden">
                  <AdUnit format="rectangle" label="Sponsored" className="transform scale-90 origin-center" />
              </div>
           )}
        </nav>
        
        {/* Upgrade Button */}
        {!isPremium && (
          <div className="p-4 bg-slate-900 border-t border-slate-800">
             <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg shadow-lg shadow-orange-900/20 transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 group"
             >
                <Crown className="w-4 h-4 text-amber-100" />
                <span className="text-sm">Upgrade / Donate</span>
             </button>
          </div>
        )}

        {/* Desktop History Widget */}
        <div className="p-4 border-t border-slate-800 hidden md:block bg-slate-900">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest">
              <Clock className="w-3 h-3" /> Recent
            </h4>
            {history.length > 0 && (
              <div className="flex items-center gap-1">
                  <button onClick={copyAllHistory} className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-white transition-colors" title="Copy All">
                    <Copy className="w-3 h-3" />
                  </button>
                  <button onClick={clearHistory} className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-red-400 transition-colors" title="Clear">
                    <Trash2 className="w-3 h-3" />
                  </button>
              </div>
            )}
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center py-4 opacity-50 border border-dashed border-slate-800 rounded-lg">
                  <div className="text-[10px] text-slate-500">No history yet</div>
              </div>
            ) : (
              history.map(item => (
                <div key={item.id} className="bg-slate-800/50 p-2 rounded border border-slate-800 text-xs transition-colors hover:bg-slate-800 cursor-default">
                  <div className="flex justify-between text-indigo-400 mb-1 font-semibold">
                    <span className="truncate max-w-[120px]">{item.label}</span>
                  </div>
                  <div className="font-mono text-slate-300 truncate opacity-80">
                    {Array.isArray(item.result) ? item.result.join(', ') : item.result}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative z-0 custom-scrollbar bg-slate-950">
        
        {/* CONDITIONAL RENDERING: Home vs Tools */}
        {activeTab === ToolType.HOME ? (
          // Landing Page gets full width/height of the main area
          renderActiveTool()
        ) : (
          // Tools get a contained layout with headers and ads
          <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12 pb-32">
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-slate-800 inline-flex items-center justify-center border border-slate-700`}>
                      {React.createElement(currentTabInfo.icon, { className: "w-6 h-6 text-indigo-500" })}
                    </div>
                  {currentTabInfo.label}
                </h2>
                <p className="text-slate-400 ml-1">
                  {currentTabInfo.desc}
                </p>
              </div>
              {!isPremium && (
                  <div className="hidden md:block">
                    <button 
                        onClick={() => setShowPaymentModal(true)}
                        className="px-4 py-2 bg-slate-900 border border-amber-500/30 text-amber-500 hover:text-amber-400 hover:border-amber-500 font-medium rounded-lg text-sm transition-all flex items-center gap-2"
                    >
                        <Crown className="w-4 h-4" /> Go Premium
                    </button>
                  </div>
              )}
            </header>

            {/* Top Ad Unit */}
            {!isPremium && (
                <div className="mb-8 rounded-lg overflow-hidden border border-slate-800">
                  <AdUnit format="horizontal" className="w-full bg-slate-900" />
                </div>
            )}

            {/* Tool Container */}
            <div id="tools-grid" className="bg-slate-950 rounded-xl min-h-[400px]">
                {renderActiveTool()}
            </div>

            {/* Bottom Ad Unit */}
            {!isPremium && (
                <div className="mt-12 rounded-lg overflow-hidden border border-slate-800">
                  <AdUnit format="auto" label="Advertisement" className="bg-slate-900" />
                </div>
            )}
            
            {/* Mobile History View */}
            <div className="md:hidden mt-12 border-t border-slate-800 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-300">History Log</h3>
                {history.length > 0 && (
                  <div className="flex items-center gap-3">
                    <button onClick={copyAllHistory} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-slate-800 px-2 py-1 rounded">
                        <Copy className="w-3 h-3" /> Copy
                    </button>
                    <button onClick={clearHistory} className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 bg-slate-800 px-2 py-1 rounded">
                        <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </div>
                )}
              </div>
              
              {history.length === 0 ? (
                  <div className="text-center py-6 bg-slate-900 rounded-lg border border-slate-800">
                      <p className="text-slate-500 text-sm">No history available.</p>
                  </div>
              ) : (
                <div className="space-y-3">
                    {history.slice(0, 5).map(item => (
                      <div key={item.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 shadow-sm">
                          <div className="flex justify-between text-xs text-indigo-400 font-bold mb-1">
                            <span>{item.label}</span>
                            <span className="opacity-70 text-slate-500">{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <div className="font-mono text-white text-sm break-all">
                            {Array.isArray(item.result) ? item.result.join(', ') : item.result}
                          </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      {/* Payment/Donation Modal */}
      <PaymentModal 
         isOpen={showPaymentModal} 
         onClose={() => setShowPaymentModal(false)} 
         onSuccess={() => {
            setIsPremium(true);
            setShowPaymentModal(false);
            alert("🎉 Awesome! You're now a Premium member!");
         }}
      />
    </div>
  );
};

export default App;

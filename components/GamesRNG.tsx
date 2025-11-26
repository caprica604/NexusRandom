import React, { useState } from 'react';
import { getRandomInt } from '../utils/random';
import { HistoryItem, ToolType } from '../types';
import { Dices, Coins, HelpCircle, RefreshCcw } from 'lucide-react';

interface GamesRNGProps {
  onGenerate: (item: HistoryItem) => void;
}

type GameMode = 'DICE' | 'COIN' | 'DECISION';

const GamesRNG: React.FC<GamesRNGProps> = ({ onGenerate }) => {
  const [mode, setMode] = useState<GameMode>('DICE');

  // Dice State
  const [diceSides, setDiceSides] = useState(6);
  const [diceCount, setDiceCount] = useState(1);
  const [diceResults, setDiceResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  // Coin State
  const [coinCount, setCoinCount] = useState(1);
  const [coinResults, setCoinResults] = useState<string[]>([]);
  
  // Decision State
  const [decisionResult, setDecisionResult] = useState<string | null>(null);

  const handleRollDice = () => {
    if (isRolling) return;
    if (diceSides < 2) return;

    setIsRolling(true);

    // If changing count, reset view immediately so we see the right amount of tumbling dice
    if (diceResults.length !== diceCount) {
        setDiceResults(Array(diceCount).fill(1));
    }

    const duration = 800; // ms
    const intervalTime = 80; // ms
    
    const interval = setInterval(() => {
      const tempResults = [];
      for (let i = 0; i < diceCount; i++) {
        tempResults.push(getRandomInt(1, diceSides));
      }
      setDiceResults(tempResults);
    }, intervalTime);

    setTimeout(() => {
      clearInterval(interval);
      const finalResults = [];
      for (let i = 0; i < diceCount; i++) {
        finalResults.push(getRandomInt(1, diceSides));
      }
      setDiceResults(finalResults);
      
      onGenerate({
        id: crypto.randomUUID(),
        type: ToolType.GAMES,
        result: `Rolled ${diceCount}d${diceSides}: [${finalResults.join(', ')}] Total: ${finalResults.reduce((a,b) => a+b, 0)}`,
        timestamp: Date.now(),
        label: 'Dice Roll'
      });
      setIsRolling(false);
    }, duration);
  };

  const handleFlipCoin = () => {
    const results = [];
    for (let i = 0; i < coinCount; i++) {
      results.push(Math.random() > 0.5 ? 'Heads' : 'Tails');
    }
    setCoinResults(results);
    onGenerate({
      id: crypto.randomUUID(),
      type: ToolType.GAMES,
      result: `Flipped ${coinCount} coin(s): ${results.join(', ')}`,
      timestamp: Date.now(),
      label: 'Coin Flip'
    });
  };

  const handleDecision = () => {
    const res = Math.random() > 0.5 ? 'YES' : 'NO';
    setDecisionResult(res);
    onGenerate({
      id: crypto.randomUUID(),
      type: ToolType.GAMES,
      result: `Decision: ${res}`,
      timestamp: Date.now(),
      label: 'Yes/No'
    });
  };

  // Derived stats for Coin
  const headsCount = coinResults.filter(r => r === 'Heads').length;
  const tailsCount = coinResults.filter(r => r === 'Tails').length;

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800">
        <button 
          onClick={() => { setMode('DICE'); setDiceResults([]); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${mode === 'DICE' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Dices className="w-4 h-4" /> Dice Roller
        </button>
        <button 
          onClick={() => { setMode('COIN'); setCoinResults([]); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${mode === 'COIN' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Coins className="w-4 h-4" /> Coin Flip
        </button>
        <button 
          onClick={() => { setMode('DECISION'); setDecisionResult(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${mode === 'DECISION' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <HelpCircle className="w-4 h-4" /> Yes / No
        </button>
      </div>

      <div className="bg-slate-800/50 p-6 md:p-8 rounded-xl border border-slate-700 min-h-[300px] flex flex-col items-center justify-center">
        
        {/* DICE SECTION */}
        {mode === 'DICE' && (
          <div className="w-full max-w-lg space-y-8">
            <div className="grid grid-cols-4 gap-2">
               {[4, 6, 8, 10, 12, 20, 48, 100].map(sides => (
                 <button
                   key={sides}
                   onClick={() => setDiceSides(sides)}
                   disabled={isRolling}
                   className={`py-2 rounded-lg text-sm font-bold border transition-colors ${
                     diceSides === sides 
                     ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                     : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                   } ${isRolling ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                   D{sides}
                 </button>
               ))}
            </div>

            <div className="flex items-end gap-4">
               <div className="flex-1">
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Number of Dice</label>
                 <input 
                   type="number" min="1" max="50"
                   value={diceCount}
                   disabled={isRolling}
                   onChange={e => setDiceCount(Number(e.target.value))}
                   className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none disabled:opacity-50"
                 />
               </div>
               {diceSides === 0 && (
                 <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Sides</label>
                    <input type="number" placeholder="Custom" disabled={isRolling} onChange={e => setDiceSides(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded px-4 py-3 text-white disabled:opacity-50"/>
                 </div>
               )}
               <button
                 onClick={handleRollDice}
                 disabled={isRolling}
                 className={`flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 ${isRolling ? 'opacity-70 cursor-wait' : ''}`}
               >
                 <RefreshCcw className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} /> 
                 {isRolling ? 'Rolling...' : 'Roll'}
               </button>
            </div>

            {diceResults.length > 0 && (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                {!isRolling && (
                  <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-2">
                     <span className="text-4xl font-bold text-white block mb-1">
                       {diceResults.reduce((a, b) => a + b, 0)}
                     </span>
                     <span className="text-xs text-slate-500 uppercase tracking-widest">Total Sum</span>
                  </div>
                )}
                <div className="flex flex-wrap justify-center gap-3">
                  {diceResults.map((r, i) => (
                    <div 
                      key={i} 
                      className={`
                        w-12 h-12 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center text-lg font-mono text-indigo-300 shadow-inner transition-all duration-75
                        ${isRolling ? 'scale-90 opacity-80 border-indigo-500/50 text-indigo-200' : 'scale-100 opacity-100'}
                      `}
                    >
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* COIN SECTION */}
        {mode === 'COIN' && (
          <div className="w-full max-w-md space-y-8 text-center">
             <div className="flex items-center justify-center gap-4">
               <div className="text-left">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Count</label>
                  <input 
                    type="number" min="1" max="100"
                    value={coinCount}
                    onChange={e => setCoinCount(Number(e.target.value))}
                    className="w-24 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-center"
                  />
               </div>
               <button
                 onClick={handleFlipCoin}
                 className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg active:scale-95 transition-transform flex items-center gap-2"
               >
                 <Coins className="w-5 h-5" /> Flip Coin{coinCount > 1 ? 's' : ''}
               </button>
             </div>

             {coinResults.length > 0 && (
               <div className="animate-in fade-in slide-in-from-bottom-2">
                 
                 {/* Statistics Display */}
                 <div className="flex gap-4 justify-center mb-6 text-sm font-bold">
                    <div className="px-4 py-2 bg-indigo-900/40 border border-indigo-500/30 rounded-lg text-indigo-200 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block"></span>
                       Heads: {headsCount}
                    </div>
                    <div className="px-4 py-2 bg-emerald-900/40 border border-emerald-500/30 rounded-lg text-emerald-200 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                       Tails: {tailsCount}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {coinResults.map((res, i) => (
                     <div key={i} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${res === 'Heads' ? 'bg-indigo-900/20 border-indigo-500/50 hover:bg-indigo-900/30' : 'bg-emerald-900/20 border-emerald-500/50 hover:bg-emerald-900/30'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 shadow-lg ${
                          res === 'Heads' 
                          ? 'bg-indigo-600 border-indigo-300 text-white' 
                          : 'bg-emerald-600 border-emerald-300 text-white'
                        }`}>
                          {res === 'Heads' ? 'H' : 'T'}
                        </div>
                        <span className="text-sm font-medium text-slate-300">{res}</span>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
        )}

        {/* DECISION SECTION */}
        {mode === 'DECISION' && (
          <div className="w-full max-w-sm text-center space-y-8">
            <button
               onClick={handleDecision}
               className="w-full py-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xl rounded-2xl shadow-xl active:scale-95 transition-all"
            >
               Make a Decision
            </button>

            {decisionResult && (
              <div key={decisionResult} className="animate-in zoom-in-50 duration-300">
                 <div className={`text-6xl font-black tracking-tighter ${decisionResult === 'YES' ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]' : 'text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.5)]'}`}>
                   {decisionResult}
                 </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default GamesRNG;
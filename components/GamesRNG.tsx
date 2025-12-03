
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
    if (diceResults.length !== diceCount) {
        setDiceResults(Array(diceCount).fill(1));
    }

    const duration = 600; // ms
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

  const headsCount = coinResults.filter(r => r === 'Heads').length;
  const tailsCount = coinResults.filter(r => r === 'Tails').length;

  return (
    <div className="space-y-8">
      {/* Professional Tab Switcher */}
      <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800 max-w-lg mx-auto">
        <button 
          onClick={() => { setMode('DICE'); setDiceResults([]); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${mode === 'DICE' ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Dices className="w-4 h-4" /> Dice Roller
        </button>
        <button 
          onClick={() => { setMode('COIN'); setCoinResults([]); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${mode === 'COIN' ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Coins className="w-4 h-4" /> Coin Flip
        </button>
        <button 
          onClick={() => { setMode('DECISION'); setDecisionResult(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${mode === 'DECISION' ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <HelpCircle className="w-4 h-4" /> Decision
        </button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[300px]">
        
        {/* DICE SECTION */}
        {mode === 'DICE' && (
          <div className="w-full max-w-2xl space-y-8">
            <div className="flex flex-wrap justify-center gap-2">
               {[4, 6, 8, 10, 12, 20, 100].map(sides => (
                 <button
                   key={sides}
                   onClick={() => setDiceSides(sides)}
                   disabled={isRolling}
                   className={`
                     w-12 h-12 rounded-lg font-bold text-sm border transition-all
                     ${diceSides === sides 
                       ? 'bg-indigo-600 border-indigo-500 text-white' 
                       : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                     }
                   `}
                 >
                   D{sides}
                 </button>
               ))}
            </div>

            <div className="flex items-center gap-4 max-w-xs mx-auto bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                 <button 
                    onClick={() => setDiceCount(Math.max(1, diceCount - 1))}
                    className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                 >-</button>
                 <div className="flex-1 text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Count</div>
                    <div className="text-lg font-bold text-white leading-none">{diceCount}</div>
                 </div>
                 <button 
                    onClick={() => setDiceCount(Math.min(50, diceCount + 1))}
                    className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                 >+</button>
            </div>

            <button
                 onClick={handleRollDice}
                 disabled={isRolling}
                 className={`w-full max-w-xs mx-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 ${isRolling ? 'opacity-80' : ''}`}
               >
                 <RefreshCcw className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} /> 
                 {isRolling ? 'Rolling...' : 'Roll Dice'}
            </button>

            {diceResults.length > 0 && (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                {!isRolling && (
                  <div className="text-center mb-6">
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
                      className="w-12 h-12 bg-slate-800 border border-slate-700 text-indigo-400 rounded-lg flex items-center justify-center text-xl font-bold"
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
             <div className="flex items-center gap-4 max-w-xs mx-auto bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                 <button 
                    onClick={() => setCoinCount(Math.max(1, coinCount - 1))}
                    className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                 >-</button>
                 <div className="flex-1 text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Coins</div>
                    <div className="text-lg font-bold text-white leading-none">{coinCount}</div>
                 </div>
                 <button 
                    onClick={() => setCoinCount(Math.min(20, coinCount + 1))}
                    className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                 >+</button>
            </div>

             <button
                 onClick={handleFlipCoin}
                 className="w-full max-w-xs mx-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
               >
                 <Coins className="w-5 h-5" /> Flip Coin
             </button>

             {coinResults.length > 0 && (
               <div className="animate-in fade-in slide-in-from-bottom-2">
                 <div className="flex gap-4 justify-center mb-6 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span>Heads: <span className="text-white">{headsCount}</span></span>
                    <span>Tails: <span className="text-white">{tailsCount}</span></span>
                 </div>

                 <div className="flex flex-wrap justify-center gap-3">
                   {coinResults.map((res, i) => (
                     <div key={i} className={`
                        w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 shadow-sm
                        ${res === 'Heads' 
                          ? 'bg-indigo-900/50 border-indigo-500 text-indigo-200' 
                          : 'bg-emerald-900/50 border-emerald-500 text-emerald-200'
                        }
                     `}>
                        {res === 'Heads' ? 'H' : 'T'}
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
               className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xl rounded-full shadow-lg transition-all"
            >
               Yes or No?
            </button>

            {decisionResult && (
              <div key={decisionResult} className="animate-in zoom-in-95 duration-300">
                 <div className={`
                    text-6xl font-black tracking-tight drop-shadow-lg
                    ${decisionResult === 'YES' ? 'text-emerald-500' : 'text-rose-500'}
                 `}>
                   {decisionResult}
                 </div>
                 <div className="text-slate-500 text-sm mt-2 font-medium">Random Decision</div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default GamesRNG;

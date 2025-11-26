import React, { useState } from 'react';
import { getRandomInt } from '../utils/random';
import { HistoryItem, ToolType, LotteryPreset } from '../types';
import { Ticket, Dna, Info } from 'lucide-react';

interface LotteryRNGProps {
  onGenerate: (item: HistoryItem) => void;
}

const PRESETS: LotteryPreset[] = [
  { name: 'Powerball', type: 'POOL', min: 1, max: 69, count: 5, extra: { min: 1, max: 26, count: 1, label: 'PB' } },
  { name: 'Mega Millions', type: 'POOL', min: 1, max: 70, count: 5, extra: { min: 1, max: 25, count: 1, label: 'MB' } },
  { name: 'Euromillions', type: 'POOL', min: 1, max: 50, count: 5, extra: { min: 1, max: 12, count: 2, label: 'Star' } },
  { name: 'Lotto 6/49', type: 'POOL', min: 1, max: 49, count: 6 },
  { name: 'UK 49s', type: 'POOL', min: 1, max: 49, count: 6 },
  { name: 'Keno Quick Pick', type: 'POOL', min: 1, max: 80, count: 20 },
  { name: 'Pick 3', type: 'DIGIT', min: 0, max: 9, count: 3 },
  { name: 'Pick 4', type: 'DIGIT', min: 0, max: 9, count: 4 },
  { name: 'Custom', type: 'POOL', min: 1, max: 49, count: 6 }
];

const LotteryRNG: React.FC<LotteryRNGProps> = ({ onGenerate }) => {
  const [selectedPreset, setSelectedPreset] = useState<LotteryPreset>(PRESETS[0]);
  const [result, setResult] = useState<{ main: number[], extra: number[] } | null>(null);

  // Custom state
  const [customConfig, setCustomConfig] = useState<LotteryPreset>(PRESETS[PRESETS.length - 1]);

  const handlePresetChange = (preset: LotteryPreset) => {
    setSelectedPreset(preset);
    setResult(null);
  };

  const generatePoolNumbers = (min: number, max: number, count: number): number[] => {
    const available = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    const nums: number[] = [];
    for (let i = 0; i < count; i++) {
      if (available.length === 0) break;
      const idx = getRandomInt(0, available.length - 1);
      nums.push(available[idx]);
      available.splice(idx, 1);
    }
    return nums.sort((a, b) => a - b);
  };

  const generateDigitNumbers = (count: number): number[] => {
    const nums: number[] = [];
    for (let i = 0; i < count; i++) {
      nums.push(getRandomInt(0, 9));
    }
    // Do not sort Pick 3/4 typically, order matters or it's just a set of digits. 
    // Usually displayed as drawn.
    return nums; 
  };

  const handleGenerate = () => {
    const config = selectedPreset.name === 'Custom' ? customConfig : selectedPreset;
    
    let mainNums: number[] = [];
    
    if (config.type === 'DIGIT') {
      mainNums = generateDigitNumbers(config.count);
    } else {
      mainNums = generatePoolNumbers(config.min, config.max, config.count);
    }

    let extraNums: number[] = [];
    if (config.extra) {
      extraNums = generatePoolNumbers(config.extra.min, config.extra.max, config.extra.count);
    }

    setResult({ main: mainNums, extra: extraNums });

    const resultStr = `${config.name}: ${mainNums.join(config.type === 'DIGIT' ? '-' : ', ')} ${extraNums.length ? ` + ${config.extra?.label}: ${extraNums.join(', ')}` : ''}`;

    onGenerate({
      id: crypto.randomUUID(),
      type: ToolType.LOTTERY,
      result: resultStr,
      timestamp: Date.now(),
      label: config.name
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Quick Pick Presets</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handlePresetChange(p)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                selectedPreset.name === p.name 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {selectedPreset.name === 'Custom' && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
           <div>
             <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Balls to Draw</label>
             <input 
              type="number" value={customConfig.count} min={1} max={50}
              onChange={e => setCustomConfig({...customConfig, count: Number(e.target.value)})}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
             />
           </div>
           <div>
             <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Range Min</label>
             <input 
              type="number" value={customConfig.min} min={0}
              onChange={e => setCustomConfig({...customConfig, min: Number(e.target.value)})}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
             />
           </div>
           <div>
             <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Range Max</label>
             <input 
              type="number" value={customConfig.max} max={1000}
              onChange={e => setCustomConfig({...customConfig, max: Number(e.target.value)})}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
             />
           </div>
           <div className="md:col-span-3 text-xs text-slate-500 flex items-center gap-2">
              <Info className="w-3 h-3" /> Custom settings use standard pool logic (unique numbers).
           </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-6 py-6">
        <button
          onClick={handleGenerate}
          className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transform transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-xl border border-white/10"
        >
          <Ticket className="w-6 h-6" />
          Quick Pick {selectedPreset.name}
        </button>
      </div>

      {result && (
        <div className="mt-8 text-center animate-in zoom-in-95 duration-300">
           <div className="inline-block p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden max-w-full">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              
              <div className={`flex flex-wrap justify-center gap-3 mb-2 ${result.main.length > 10 ? 'max-w-2xl' : ''}`}>
                {result.main.map((n, i) => (
                  <div 
                    key={`m-${i}`} 
                    className={`
                      rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center font-bold text-white shadow-inner
                      ${result.main.length > 10 ? 'w-10 h-10 text-sm' : 'w-16 h-16 text-2xl'}
                    `}
                  >
                    {n}
                  </div>
                ))}
                {result.extra.map((n, i) => (
                  <div 
                    key={`e-${i}`} 
                    className={`
                      rounded-full bg-indigo-900 border-2 border-indigo-500 flex items-center justify-center font-bold text-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.5)]
                      ${result.main.length > 10 ? 'w-10 h-10 text-sm' : 'w-16 h-16 text-2xl'}
                    `}
                  >
                    {n}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex flex-col items-center gap-1">
                 <span className="text-white font-medium text-lg">{selectedPreset.name}</span>
                 <span className="text-slate-500 text-xs font-mono uppercase tracking-widest opacity-60">Verified Random</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LotteryRNG;
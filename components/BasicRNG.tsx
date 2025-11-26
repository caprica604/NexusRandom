import React, { useState } from 'react';
import { getRandomInt, shuffleArray } from '../utils/random';
import { HistoryItem, ToolType } from '../types';
import { RefreshCw, Copy, Layers, Trash2, SlidersHorizontal, ArrowDownAZ, Shuffle, AlignLeft } from 'lucide-react';

interface BasicRNGProps {
  onGenerate: (item: HistoryItem) => void;
}

type Mode = 'RANGE' | 'DIGITS' | 'LIST';
type Parity = 'ANY' | 'ODD' | 'EVEN' | 'HALF' | 'CUSTOM';
type Separator = 'COMMA' | 'SPACE' | 'NEWLINE' | 'NONE';

const BasicRNG: React.FC<BasicRNGProps> = ({ onGenerate }) => {
  // Modes
  const [mode, setMode] = useState<Mode>('RANGE');
  
  // Inputs
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [digitLength, setDigitLength] = useState<number>(3);
  const [pinStyle, setPinStyle] = useState<boolean>(true);
  const [listInput, setListInput] = useState<string>("");

  // Configuration
  const [countPerSet, setCountPerSet] = useState<number>(1);
  const [numberOfSets, setNumberOfSets] = useState<number>(1);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [sortResults, setSortResults] = useState<boolean>(false); // false = Permutation (Unsorted), true = Combination (Sorted)

  // Advanced Filters (Range Only)
  const [parity, setParity] = useState<Parity>('ANY');
  const [customOddCount, setCustomOddCount] = useState<number>(1);

  // Formatting
  const [separator, setSeparator] = useState<Separator>('COMMA');
  
  // Output
  const [results, setResults] = useState<string[]>([]);

  // Helpers
  const applyShortcut = (type: string) => {
    setNumberOfSets(1);
    setResults([]);
    setParity('ANY');
    setSeparator('COMMA');
    
    switch (type) {
      case '1-10':
        setMode('RANGE'); setMin(1); setMax(10); setCountPerSet(1); setAllowDuplicates(true); setSortResults(false);
        break;
      case '1-50':
        setMode('RANGE'); setMin(1); setMax(50); setCountPerSet(1); setAllowDuplicates(true); setSortResults(false);
        break;
      case '1-100':
        setMode('RANGE'); setMin(1); setMax(100); setCountPerSet(1); setAllowDuplicates(true); setSortResults(false);
        break;
      case '6-49':
        setMode('RANGE'); setMin(1); setMax(49); setCountPerSet(6); setAllowDuplicates(false); setSortResults(true); setNumberOfSets(5);
        break;
      case '7-49':
        setMode('RANGE'); setMin(1); setMax(49); setCountPerSet(7); setAllowDuplicates(false); setSortResults(true); setNumberOfSets(5);
        break;
      case '3-digit':
        setMode('DIGITS'); setDigitLength(3); setPinStyle(true); setCountPerSet(1);
        break;
      case '4-digit':
        setMode('DIGITS'); setDigitLength(4); setPinStyle(true); setCountPerSet(1);
        break;
      case '6-digit':
        setMode('DIGITS'); setDigitLength(6); setPinStyle(true); setCountPerSet(1);
        break;
    }
  };

  const getSeparatorChar = (sep: Separator) => {
    switch(sep) {
      case 'COMMA': return ', ';
      case 'SPACE': return ' ';
      case 'NEWLINE': return '\n';
      case 'NONE': return '';
      default: return ', ';
    }
  };

  const generateWithParity = (targetOdds: number, targetEvens: number, currentMin: number, currentMax: number): number[] => {
    const nums: number[] = [];
    const maxAttempts = 10000;
    
    // Helper to generate a batch
    const pickBatch = (target: number, isOdd: boolean) => {
      let attempts = 0;
      let count = 0;
      const batchSet = new Set<number>();
      
      // If range is small, pre-calculate pool to avoid infinite loops
      const rangeSize = currentMax - currentMin;
      if (rangeSize < 5000) {
        const pool = [];
        for (let i = currentMin; i <= currentMax; i++) {
           if ((i % 2 !== 0) === isOdd) pool.push(i);
        }
        
        if (!allowDuplicates && target > pool.length) {
          throw new Error(`Not enough ${isOdd ? 'odd' : 'even'} numbers in range.`);
        }

        const shuffled = shuffleArray(pool);
        if (allowDuplicates) {
           for(let k=0; k<target; k++) nums.push(pool[getRandomInt(0, pool.length-1)]);
        } else {
           for(let k=0; k<target; k++) nums.push(shuffled[k]);
        }
        return;
      }

      // Large range: Use rejection sampling
      while (count < target && attempts < maxAttempts) {
        const r = getRandomInt(currentMin, currentMax);
        const rIsOdd = r % 2 !== 0;
        
        if (rIsOdd === isOdd) {
          if (allowDuplicates || !nums.includes(r)) { // Check mainly against global result so far? No, simpler to build locally then merge
             if (allowDuplicates || !batchSet.has(r)) {
                batchSet.add(r);
                nums.push(r);
                count++;
             }
          }
        }
        attempts++;
      }
      
      if (count < target) throw new Error("Could not find enough unique numbers matching criteria.");
    };

    if (targetOdds > 0) pickBatch(targetOdds, true);
    if (targetEvens > 0) pickBatch(targetEvens, false);

    return nums;
  };

  const handleGenerate = () => {
    const newResults: string[] = [];
    
    try {
      // Parse list if needed
      let parsedList: number[] = [];
      if (mode === 'LIST') {
        parsedList = listInput.split(/[\n,]+/)
          .map(s => Number(s.trim()))
          .filter(n => !isNaN(n));
        
        if (parsedList.length === 0) {
          alert("Please enter valid numbers in the list.");
          return;
        }
        if (!allowDuplicates && countPerSet > parsedList.length) {
          alert("Cannot pick more unique numbers than available in the list.");
          return;
        }
      }

      // Validation for Range
      if (mode === 'RANGE') {
        if (min > max) {
          alert("Min cannot be greater than Max");
          return;
        }
        if (!allowDuplicates && countPerSet > (max - min + 1)) {
          alert("Range is too small for the requested quantity of unique numbers.");
          return;
        }
      }

      for (let s = 0; s < numberOfSets; s++) {
        let currentSet: (number | string)[] = [];
        
        if (mode === 'RANGE') {
          // Parity Logic
          if (parity !== 'ANY') {
            let oddT = 0;
            if (parity === 'ODD') oddT = countPerSet;
            else if (parity === 'EVEN') oddT = 0;
            else if (parity === 'HALF') oddT = Math.floor(countPerSet / 2);
            else if (parity === 'CUSTOM') oddT = customOddCount;
            
            const evenT = countPerSet - oddT;
            currentSet = generateWithParity(oddT, evenT, min, max);
            
            // Re-shuffle mixed odds/evens if unsorted
            if (!sortResults) {
              currentSet = shuffleArray(currentSet as number[]);
            }
          } else {
            // Standard Logic
            if (allowDuplicates) {
              for (let i = 0; i < countPerSet; i++) currentSet.push(getRandomInt(min, max));
            } else {
              const available = new Set<number>();
              // Safety break
              let safety = 0;
              while (available.size < countPerSet && safety < 100000) {
                available.add(getRandomInt(min, max));
                safety++;
              }
              currentSet = Array.from(available);
            }
          }
        } 
        else if (mode === 'DIGITS') {
          for (let i = 0; i < countPerSet; i++) {
            if (pinStyle) {
              let code = "";
              for (let d = 0; d < digitLength; d++) code += getRandomInt(0, 9);
              currentSet.push(code);
            } else {
              const minD = Math.pow(10, digitLength - 1);
              const maxD = Math.pow(10, digitLength) - 1;
              currentSet.push(getRandomInt(minD, maxD));
            }
          }
        }
        else if (mode === 'LIST') {
          const pool = [...parsedList];
          if (allowDuplicates) {
            for (let i = 0; i < countPerSet; i++) {
              currentSet.push(pool[getRandomInt(0, pool.length - 1)]);
            }
          } else {
            const shuffled = shuffleArray(pool);
            currentSet = shuffled.slice(0, countPerSet);
          }
        }

        // Sort logic
        if (sortResults && mode !== 'DIGITS') {
          currentSet.sort((a, b) => Number(a) - Number(b));
        }

        newResults.push(currentSet.join(getSeparatorChar(separator)));
      }

      setResults(newResults);
      
      onGenerate({
        id: crypto.randomUUID(),
        type: ToolType.BASIC,
        result: newResults,
        timestamp: Date.now(),
        label: `${mode === 'RANGE' ? `Range ${min}-${max}` : mode === 'DIGITS' ? `${digitLength}-Digit` : 'Custom List'}`
      });

    } catch (e: any) {
      alert(e.message || "An error occurred during generation");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Shortcuts */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-2">
          {['1-10', '1-50', '1-100', '6-49', '7-49', '3-digit', '4-digit', '6-digit'].map(sc => (
            <button
              key={sc}
              onClick={() => applyShortcut(sc)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs font-medium text-slate-300 transition-colors whitespace-nowrap"
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {/* Main Control Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Input Configuration */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tabs */}
          <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button 
              onClick={() => setMode('RANGE')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'RANGE' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Range
            </button>
            <button 
              onClick={() => setMode('DIGITS')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'DIGITS' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Digits
            </button>
            <button 
              onClick={() => setMode('LIST')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'LIST' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Custom List
            </button>
          </div>

          {/* Dynamic Inputs based on Tab */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 min-h-[220px]">
            
            {mode === 'RANGE' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Min</label>
                    <input type="number" value={min} onChange={e => setMin(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-3 text-white text-lg font-mono focus:border-indigo-500 outline-none transition-colors" />
                  </div>
                  <div className="text-slate-600 font-bold text-xl pt-6">-</div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Max</label>
                    <input type="number" value={max} onChange={e => setMax(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-3 text-white text-lg font-mono focus:border-indigo-500 outline-none transition-colors" />
                  </div>
                </div>
                
                {/* Parity / Advanced Logic */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                     <SlidersHorizontal className="w-3 h-3 text-indigo-400" />
                     <span className="text-xs font-bold text-slate-400 uppercase">Constraint Rules</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'ANY', label: 'Any' },
                      { id: 'ODD', label: 'Odd Only' },
                      { id: 'EVEN', label: 'Even Only' },
                      { id: 'HALF', label: 'Half & Half' },
                      { id: 'CUSTOM', label: 'Custom Ratio' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setParity(opt.id as Parity)}
                        className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                          parity === opt.id 
                          ? 'bg-indigo-600 border-indigo-500 text-white' 
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {parity === 'CUSTOM' && (
                    <div className="mt-3 flex items-center gap-3">
                      <label className="text-xs text-slate-400">Odd Numbers Count:</label>
                      <input 
                        type="number" min="0" max={countPerSet}
                        value={customOddCount}
                        onChange={e => setCustomOddCount(Math.min(countPerSet, Math.max(0, Number(e.target.value))))}
                        className="w-20 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                      />
                      <span className="text-xs text-slate-500">
                        ({countPerSet - customOddCount} Evens)
                      </span>
                    </div>
                  )}
                  {parity === 'HALF' && (
                     <p className="text-xs text-slate-500 mt-2">
                       Attempts to generate {Math.floor(countPerSet / 2)} Odds and {Math.ceil(countPerSet / 2)} Evens.
                     </p>
                  )}
                </div>
              </div>
            )}

            {mode === 'DIGITS' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Number of Digits</label>
                   <input type="range" min="1" max="20" value={digitLength} onChange={e => setDigitLength(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                   <div className="text-right text-indigo-400 font-mono mt-2">{digitLength} digits</div>
                </div>
                <label className="flex items-center gap-3 p-3 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                   <input type="checkbox" checked={pinStyle} onChange={e => setPinStyle(e.target.checked)} className="rounded border-slate-600 bg-slate-800 text-indigo-500 w-5 h-5" />
                   <div>
                     <span className="block text-sm text-white font-medium">Allow leading zeros (PIN Code style)</span>
                     <span className="block text-xs text-slate-500">If checked, "007" is valid. If unchecked, value is 100-999.</span>
                   </div>
                </label>
              </div>
            )}

            {mode === 'LIST' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 h-full">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Number Pool</label>
                <textarea 
                  value={listInput}
                  onChange={e => setListInput(e.target.value)}
                  placeholder="Enter numbers separated by commas or newlines e.g.&#10;10, 20, 55, 99"
                  className="w-full h-32 bg-slate-900 border border-slate-600 rounded px-3 py-3 text-white font-mono text-sm focus:border-indigo-500 outline-none transition-colors resize-none"
                />
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Settings & Action */}
        <div className="space-y-6">
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 space-y-6">
             <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
               <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">Configuration</h3>
               </div>
             </div>
             
             {/* Quantities */}
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs text-slate-500 mb-1">Count per Set</label>
                   <input type="number" min="1" max="10000" value={countPerSet} onChange={e => setCountPerSet(Number(e.target.value))} className="w-full bg-slate-900 border-slate-600 rounded px-2 py-2 text-white" />
                </div>
                <div>
                   <label className="block text-xs text-slate-500 mb-1">Number of Sets</label>
                   <input type="number" min="1" max="100" value={numberOfSets} onChange={e => setNumberOfSets(Number(e.target.value))} className="w-full bg-slate-900 border-slate-600 rounded px-2 py-2 text-white" />
                </div>
             </div>

             {/* Logic Switches */}
             <div className="space-y-3">
               <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Allow Duplicates</span>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${allowDuplicates ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                    <input type="checkbox" checked={allowDuplicates} onChange={e => setAllowDuplicates(e.target.checked)} className="opacity-0 w-0 h-0" />
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${allowDuplicates ? 'left-6' : 'left-1'}`} />
                  </div>
               </label>
               
               <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                  <label className="block text-xs text-slate-500 mb-2 font-bold uppercase">Result Order</label>
                  <div className="flex bg-slate-800 rounded p-1">
                     <button 
                       onClick={() => setSortResults(true)}
                       className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded text-xs transition-colors ${sortResults ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                       title="Order doesn't matter (Sorted)"
                     >
                        <ArrowDownAZ className="w-3 h-3" /> Comb.
                     </button>
                     <button 
                       onClick={() => setSortResults(false)}
                       className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded text-xs transition-colors ${!sortResults ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                       title="Order matters (Random)"
                     >
                        <Shuffle className="w-3 h-3" /> Perm.
                     </button>
                  </div>
               </div>
             </div>

             {/* Output Formatting */}
             <div className="space-y-2">
               <label className="block text-xs text-slate-500 font-bold uppercase flex items-center gap-2">
                 <AlignLeft className="w-3 h-3" /> Output Format
               </label>
               <select 
                 value={separator} 
                 onChange={(e) => setSeparator(e.target.value as Separator)}
                 className="w-full bg-slate-900 border border-slate-600 text-white text-sm rounded px-3 py-2 outline-none focus:border-indigo-500"
               >
                 <option value="COMMA">CSV (Comma)</option>
                 <option value="SPACE">Space Separated</option>
                 <option value="NEWLINE">New Line</option>
                 <option value="NONE">No Space (Code)</option>
               </select>
             </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <RefreshCw className="w-5 h-5" />
            Generate
          </button>
        </div>
      </div>

      {/* Results Area */}
      {results.length > 0 && (
        <div className="mt-8 border-t border-slate-800 pt-8 animate-in fade-in slide-in-from-bottom-4">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-medium text-white flex items-center gap-2">
               <Layers className="w-5 h-5 text-indigo-400" /> 
               Results 
               <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{results.length} Set{results.length > 1 ? 's' : ''}</span>
             </h3>
             <button 
               onClick={() => setResults([])}
               className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
             >
               <Trash2 className="w-3 h-3" /> Clear
             </button>
           </div>
           
           <div className={`grid gap-3 ${results.length === 1 && separator === 'NEWLINE' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
             {results.map((res, idx) => (
               <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-start gap-4 group hover:border-indigo-500/30 transition-colors relative">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center text-xs font-mono text-slate-500 mt-1">
                    {idx + 1}
                  </div>
                  <div className="flex-1 font-mono text-lg text-indigo-100 break-all whitespace-pre-wrap leading-relaxed">
                    {res}
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(res)}
                    className="absolute top-4 right-4 p-2 text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all bg-slate-900/80 rounded"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default BasicRNG;
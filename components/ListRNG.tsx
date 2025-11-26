import React, { useState } from 'react';
import { shuffleArray, isPrime } from '../utils/random';
import { HistoryItem, ToolType } from '../types';
import { ListChecks, ArrowRightLeft, Filter, Shuffle, Calculator, Binary, Palette, Hash, Type } from 'lucide-react';

interface UtilityToolsProps {
  onGenerate: (item: HistoryItem) => void;
}

type Tab = 'OPERATIONS' | 'CONVERTER';
type FilterType = 'ODD' | 'EVEN' | 'PRIME' | 'DIVISIBLE';
type InputFormat = 'DECIMAL' | 'HEX' | 'BINARY';

const UtilityTools: React.FC<UtilityToolsProps> = ({ onGenerate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('OPERATIONS');
  
  // -- List Operations State --
  const [listInput, setListInput] = useState<string>("");
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(100);
  const [filterDivisor, setFilterDivisor] = useState<number>(3);
  const [comboSize, setComboSize] = useState<number>(2);

  // -- Converter State --
  const [convInput, setConvInput] = useState<string>("42");
  const [inputFormat, setInputFormat] = useState<InputFormat>('DECIMAL');

  // Helper to get numbers from text
  const getNumbers = (): number[] => {
    return listInput.split(/[\n, ]+/).map(s => Number(s.trim())).filter(n => !isNaN(n));
  };

  // --- Actions ---

  const handleGenerateRange = () => {
    if (rangeEnd < rangeStart) return;
    if (rangeEnd - rangeStart > 10000) {
      if(!confirm("Large range (>10k). This might be slow. Continue?")) return;
    }
    const arr = [];
    for (let i = rangeStart; i <= rangeEnd; i++) arr.push(i);
    setListInput(arr.join(', '));
  };

  const handleShuffle = () => {
    const nums = getNumbers();
    if (nums.length === 0) return;
    const shuffled = shuffleArray(nums);
    setListInput(shuffled.join(', '));
    onGenerate({
      id: crypto.randomUUID(),
      type: ToolType.UTILITY,
      result: shuffled.join(', '),
      timestamp: Date.now(),
      label: 'Shuffled List'
    });
  };

  const handleFilter = (type: FilterType) => {
    const nums = getNumbers();
    if (nums.length === 0) return;
    
    let filtered: number[] = [];
    let label = "";

    switch(type) {
      case 'ODD':
        filtered = nums.filter(n => n % 2 !== 0);
        label = "Filter Odd";
        break;
      case 'EVEN':
        filtered = nums.filter(n => n % 2 === 0);
        label = "Filter Even";
        break;
      case 'PRIME':
        filtered = nums.filter(isPrime);
        label = "Filter Primes";
        break;
      case 'DIVISIBLE':
        filtered = nums.filter(n => n % filterDivisor === 0);
        label = `Filter Divisible by ${filterDivisor}`;
        break;
    }

    setListInput(filtered.join(', '));
    onGenerate({
      id: crypto.randomUUID(),
      type: ToolType.UTILITY,
      result: filtered.join(', '),
      timestamp: Date.now(),
      label
    });
  };

  const handleCombinatorics = (type: 'PERM' | 'COMB') => {
    const nums = getNumbers();
    if (nums.length > 8) {
      alert("List is too long (max 8 numbers) for combinatorics in the browser.");
      return;
    }
    if (nums.length === 0) return;

    const getCombinations = (arr: number[], k: number): number[][] => {
       if (k === 0) return [[]];
       if (arr.length === 0) return [];
       const [first, ...rest] = arr;
       const withFirst = getCombinations(rest, k - 1).map(c => [first, ...c]);
       const withoutFirst = getCombinations(rest, k);
       return [...withFirst, ...withoutFirst];
    };

    const getPermutations = (arr: number[], k: number): number[][] => {
       if (k === 0) return [[]];
       return arr.flatMap((v, i) => {
          const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
          return getPermutations(rest, k - 1).map(p => [v, ...p]);
       });
    };

    const res = type === 'COMB' 
      ? getCombinations(nums, comboSize)
      : getPermutations(nums, comboSize);

    const resStr = res.map(r => `[${r.join(', ')}]`).join('\n');
    
    onGenerate({
      id: crypto.randomUUID(),
      type: ToolType.UTILITY,
      result: resStr,
      timestamp: Date.now(),
      label: `${type === 'COMB' ? 'Combinations' : 'Permutations'} of List`
    });
    alert(`Generated ${res.length} items. Check History.`);
  };

  // --- Converter ---
  
  const toRoman = (num: number): string => {
    if (num < 1 || num > 3999) return "N/A";
    const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    let roman = "";
    let n = num;
    for (let i = 0; i < val.length; i++) {
      while (n >= val[i]) {
        n -= val[i];
        roman += syms[i];
      }
    }
    return roman;
  };

  const renderConverter = () => {
    // 1. Parse Input
    let n = NaN;
    let cleanInput = convInput.trim();

    if (inputFormat === 'HEX') {
        // Handle # prefix
        cleanInput = cleanInput.replace(/^#/, '');
        n = parseInt(cleanInput, 16);
    } else if (inputFormat === 'BINARY') {
        n = parseInt(cleanInput, 2);
    } else {
        n = parseInt(cleanInput, 10);
    }
    
    const isValid = !isNaN(n);

    // RGB Logic
    let rgbVal = "Invalid";
    let hexColorString = ""; 

    if (isValid) {
        if (n >= 0 && n <= 0xFFFFFF) {
           let r, g, b;
           // If user specifically typed 3 chars in HEX mode, treat as shorthand color for RGB display
           if (inputFormat === 'HEX' && cleanInput.length === 3) {
               const rHex = cleanInput[0] + cleanInput[0];
               const gHex = cleanInput[1] + cleanInput[1];
               const bHex = cleanInput[2] + cleanInput[2];
               r = parseInt(rHex, 16);
               g = parseInt(gHex, 16);
               b = parseInt(bHex, 16);
               hexColorString = `#${cleanInput}`;
           } else {
               // Standard integer extraction
               r = (n >> 16) & 255;
               g = (n >> 8) & 255;
               b = n & 255;
               hexColorString = `#${n.toString(16).padStart(6, '0')}`;
           }
           rgbVal = `rgb(${r}, ${g}, ${b})`;
        } else {
           rgbVal = "Out of Range";
           hexColorString = "";
        }
    }

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
         {/* Input Section */}
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex gap-4 mb-3">
               {['DECIMAL', 'HEX', 'BINARY'].map(fmt => (
                  <button 
                     key={fmt}
                     onClick={() => setInputFormat(fmt as InputFormat)}
                     className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${
                        inputFormat === fmt ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                     }`}
                  >
                     {fmt} INPUT
                  </button>
               ))}
            </div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Value</label>
            <div className="relative">
               <input 
                 type="text" 
                 value={convInput} 
                 onChange={e => setConvInput(e.target.value)}
                 placeholder={inputFormat === 'HEX' ? 'e.g. FF5733' : inputFormat === 'BINARY' ? '101010' : '42'}
                 className="w-full bg-slate-900 border border-slate-600 rounded px-4 py-3 text-white text-xl font-mono focus:border-indigo-500 outline-none transition-colors"
               />
               {hexColorString && isValid && (
                  <div 
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/20 shadow-lg"
                    style={{ backgroundColor: hexColorString }}
                    title={`Preview: ${hexColorString}`}
                  />
               )}
            </div>
         </div>
         
         {/* Outputs Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {/* Decimal */}
             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                   <Hash className="w-3 h-3" /> Decimal
                </span>
                <span className="font-mono text-xl text-indigo-300 break-all">{isValid ? n.toString(10) : '-'}</span>
             </div>

             {/* Hex */}
             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                   <Hash className="w-3 h-3" /> Hexadecimal
                </span>
                <span className="font-mono text-xl text-purple-300 break-all uppercase">{isValid ? n.toString(16) : '-'}</span>
             </div>

             {/* Binary */}
             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 flex flex-col sm:col-span-2">
                <span className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                   <Binary className="w-3 h-3" /> Binary
                </span>
                <span className="font-mono text-xl text-emerald-300 break-all">{isValid ? n.toString(2) : '-'}</span>
             </div>

             {/* RGB */}
             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                   <Palette className="w-3 h-3" /> Color Format
                </span>
                <div className="flex items-center gap-3 h-full">
                   {isValid && hexColorString ? (
                     <>
                        <div className="w-10 h-10 rounded-lg border border-white/20 shadow-inner shrink-0" style={{backgroundColor: hexColorString}} />
                        <div className="flex flex-col">
                          <span className="font-mono text-sm text-slate-300">{rgbVal}</span>
                          <span className="font-mono text-sm text-indigo-400 font-bold uppercase">{hexColorString}</span>
                        </div>
                     </>
                   ) : (
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-800 shrink-0" />
                       <span className="font-mono text-lg text-slate-500">-</span>
                     </div>
                   )}
                </div>
             </div>

             {/* Roman */}
             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                   <Type className="w-3 h-3" /> Roman
                </span>
                <span className="font-serif text-lg text-amber-100">{isValid ? toRoman(n) : '-'}</span>
             </div>
         </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800 mb-6">
        <button 
          onClick={() => setActiveTab('OPERATIONS')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'OPERATIONS' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <ListChecks className="w-4 h-4" /> List Operations
        </button>
        <button 
          onClick={() => setActiveTab('CONVERTER')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'CONVERTER' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <ArrowRightLeft className="w-4 h-4" /> Number Conversion
        </button>
      </div>

      {activeTab === 'CONVERTER' ? renderConverter() : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
           {/* Left: Input Area */}
           <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
                 <div className="text-xs font-bold text-slate-400 px-2">GENERATE RANGE:</div>
                 <input 
                   type="number" value={rangeStart} onChange={e => setRangeStart(Number(e.target.value))} 
                   className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white" placeholder="Min"
                 />
                 <span className="text-slate-500 text-xs">TO</span>
                 <input 
                   type="number" value={rangeEnd} onChange={e => setRangeEnd(Number(e.target.value))} 
                   className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white" placeholder="Max"
                 />
                 <button onClick={handleGenerateRange} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded">
                   Generate
                 </button>
              </div>

              <textarea
                value={listInput}
                onChange={(e) => setListInput(e.target.value)}
                placeholder="Enter numbers separated by commas e.g. 10, 20, 33, 42..."
                className="w-full h-96 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm resize-none leading-relaxed"
              />
           </div>

           {/* Right: Tools */}
           <div className="space-y-6">
              
              {/* Randomize */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                 <div className="flex items-center gap-2 mb-3 text-indigo-400">
                    <Shuffle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Randomize</span>
                 </div>
                 <button onClick={handleShuffle} className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors">
                   Shuffle List
                 </button>
              </div>

              {/* Filters */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                 <div className="flex items-center gap-2 mb-3 text-indigo-400">
                    <Filter className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Filter List</span>
                 </div>
                 <div className="space-y-2">
                    <div className="flex gap-2">
                       <button onClick={() => handleFilter('ODD')} className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-700 border border-slate-600 rounded text-xs text-slate-300">Keep Odd</button>
                       <button onClick={() => handleFilter('EVEN')} className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-700 border border-slate-600 rounded text-xs text-slate-300">Keep Even</button>
                    </div>
                    <button onClick={() => handleFilter('PRIME')} className="w-full py-1.5 bg-slate-900 hover:bg-slate-700 border border-slate-600 rounded text-xs text-slate-300">Keep Primes</button>
                    
                    <div className="flex gap-2 pt-2 border-t border-slate-700/50">
                       <input 
                         type="number" value={filterDivisor} onChange={e => setFilterDivisor(Number(e.target.value))}
                         className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white"
                       />
                       <button onClick={() => handleFilter('DIVISIBLE')} className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-700 border border-slate-600 rounded text-xs text-slate-300">
                         Keep Divisible
                       </button>
                    </div>
                 </div>
              </div>

              {/* Combinatorics */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                 <div className="flex items-center gap-2 mb-3 text-indigo-400">
                    <Calculator className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Combinatorics</span>
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                       <span>Subset Size</span>
                       <input 
                         type="number" min="1" max="8" value={comboSize} onChange={e => setComboSize(Number(e.target.value))}
                         className="w-12 bg-slate-900 border border-slate-600 rounded px-1 py-0.5 text-center text-white"
                       />
                    </div>
                    <button onClick={() => handleCombinatorics('PERM')} className="w-full py-1.5 bg-slate-900 hover:bg-slate-700 border border-slate-600 rounded text-xs text-slate-300">
                       Get Permutations
                    </button>
                    <button onClick={() => handleCombinatorics('COMB')} className="w-full py-1.5 bg-slate-900 hover:bg-slate-700 border border-slate-600 rounded text-xs text-slate-300">
                       Get Combinations
                    </button>
                 </div>
              </div>

           </div>
        </div>
      )}
    </div>
  );
};

export default UtilityTools;
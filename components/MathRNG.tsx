import React, { useState } from 'react';
import { getRandomInt, shuffleArray } from '../utils/random';
import { HistoryItem, ToolType } from '../types';
import { Calculator, Sigma, Divide, Hash, Grip, Copy, AlertTriangle } from 'lucide-react';

interface MathRNGProps {
  onGenerate: (item: HistoryItem) => void;
}

type MathMode = 'PARTITION' | 'DIGIT_SUM' | 'MULTIPLES' | 'PRIMES' | 'COMBO';

const MathRNG: React.FC<MathRNGProps> = ({ onGenerate }) => {
  const [mode, setMode] = useState<MathMode>('PARTITION');
  const [result, setResult] = useState<string[]>([]);
  
  // Partition State
  const [partSum, setPartSum] = useState<number>(100);
  const [partCount, setPartCount] = useState<number>(5);

  // Digit Sum State
  const [digitLen, setDigitLen] = useState<number>(4);
  const [targetDigitSum, setTargetDigitSum] = useState<number>(20);
  const [digitSumCount, setDigitSumCount] = useState<number>(5);

  // Multiples State
  const [multMin, setMultMin] = useState<number>(1);
  const [multMax, setMultMax] = useState<number>(1000);
  const [divisor, setDivisor] = useState<number>(7);
  const [multCount, setMultCount] = useState<number>(5);

  // Primes State
  const [primeMin, setPrimeMin] = useState<number>(1);
  const [primeMax, setPrimeMax] = useState<number>(100);
  const [primeAction, setPrimeAction] = useState<'LIST' | 'PICK'>('LIST');

  // Combo State
  const [comboInput, setComboInput] = useState<string>("A, B, C");
  const [comboSize, setComboSize] = useState<number>(2);
  const [comboType, setComboType] = useState<'PERM' | 'COMB'>('PERM');

  // --- ALGORITHMS ---

  const generatePartitions = () => {
    // Generate N random numbers that sum to S.
    // Method: Generate N-1 cut points in range [0, S], add 0 and S, sort, calculate differences.
    try {
      if (partCount < 1) return;
      if (partSum < partCount) {
        alert("Sum must be at least equal to the count (integers >= 1).");
        return;
      }

      const results = [];
      // To get mostly non-zero integers, we can solve for Sum - Count (distribution of surplus), then add 1 to each.
      const surplus = partSum - partCount;
      
      const cuts = [0, surplus];
      for (let i = 0; i < partCount - 1; i++) {
        cuts.push(getRandomInt(0, surplus));
      }
      cuts.sort((a, b) => a - b);
      
      const parts = [];
      for (let i = 0; i < partCount; i++) {
        parts.push((cuts[i+1] - cuts[i]) + 1);
      }
      
      // Shuffle them so the order is random (cuts method sorts them implicitly by size often)
      const shuffled = shuffleArray(parts);
      results.push(`${shuffled.join(' + ')} = ${partSum}`);
      setResult(results);
      onGenerate({ id: crypto.randomUUID(), type: ToolType.MATH, result: results, timestamp: Date.now(), label: `Sum to ${partSum}` });
    } catch (e) { console.error(e); }
  };

  const generateDigitSums = () => {
    // Construct random numbers of length L where digits sum to S
    const generated: string[] = [];
    const maxVal = 9 * digitLen;
    const minVal = 1; 

    if (targetDigitSum > maxVal || targetDigitSum < minVal) {
      alert(`Impossible sum. For ${digitLen} digits, sum must be between 1 and ${maxVal}.`);
      return;
    }

    for (let c = 0; c < digitSumCount; c++) {
      let currentSum = targetDigitSum;
      let numStr = "";
      
      for (let i = 0; i < digitLen; i++) {
        const isLast = i === digitLen - 1;
        const isFirst = i === 0;
        
        // Remaining slots
        const remainingDigits = digitLen - 1 - i;
        
        // Constraints for current digit d:
        // 1. d <= currentSum
        // 2. d <= 9
        // 3. remaining sum (currentSum - d) must be fillable by remaining digits (max 9 * remaining)
        // 4. if isFirst, d >= 1 (unless len 1)
        
        const maxPossibleRemain = 9 * remainingDigits;
        const minRequiredRemain = 0; // standard

        const minD = Math.max(0, currentSum - maxPossibleRemain, isFirst ? 1 : 0);
        const maxD = Math.min(9, currentSum);

        if (minD > maxD) {
            // Should not happen with valid initial checks, but fail-safe
            numStr = "Error"; break;
        }

        const d = getRandomInt(minD, maxD);
        numStr += d;
        currentSum -= d;
      }
      if (numStr !== "Error") generated.push(numStr);
    }
    
    setResult(generated);
    onGenerate({ id: crypto.randomUUID(), type: ToolType.MATH, result: generated, timestamp: Date.now(), label: `Digit Sum ${targetDigitSum}` });
  };

  const generateMultiples = () => {
    if (divisor === 0) return;
    const candidates = [];
    
    // Find first multiple
    const first = Math.ceil(multMin / divisor) * divisor;
    const last = Math.floor(multMax / divisor) * divisor;
    
    if (first > last) {
      setResult(["No multiples in range"]);
      return;
    }

    const totalMultiples = (last - first) / divisor + 1;
    
    // If range is huge, don't generate all. Pick random indices.
    const picks = new Set<number>();
    const generated = [];

    let safety = 0;
    while(picks.size < Math.min(multCount, totalMultiples) && safety < 10000) {
       const idx = getRandomInt(0, totalMultiples - 1);
       if (!picks.has(idx)) {
         picks.add(idx);
         generated.push(first + (idx * divisor));
       }
       safety++;
    }

    const sorted = generated.sort((a,b) => a-b).map(String);
    setResult(sorted);
    onGenerate({ id: crypto.randomUUID(), type: ToolType.MATH, result: sorted, timestamp: Date.now(), label: `Multiples of ${divisor}` });
  };

  const generatePrimes = () => {
     // Sieve for range. Limit max range to avoid hanging.
     if (primeMax > 100000) {
       alert("Max limit for prime generation is 100,000 for browser performance.");
       return;
     }
     
     const sieve = new Uint8Array(primeMax + 1);
     // 0 and 1 are not prime
     sieve[0] = 1; sieve[1] = 1;
     
     for (let i = 2; i * i <= primeMax; i++) {
        if (sieve[i] === 0) {
           for (let j = i * i; j <= primeMax; j += i) {
              sieve[j] = 1;
           }
        }
     }

     const primes = [];
     for (let i = primeMin; i <= primeMax; i++) {
        if (sieve[i] === 0) primes.push(i);
     }

     if (primes.length === 0) {
       setResult(["No primes found in range."]);
       return;
     }

     if (primeAction === 'PICK') {
        const picked = [];
        for(let k=0; k<5; k++) {
           picked.push(primes[getRandomInt(0, primes.length - 1)]);
        }
        setResult(picked.map(String));
        onGenerate({ id: crypto.randomUUID(), type: ToolType.MATH, result: picked.map(String), timestamp: Date.now(), label: 'Random Primes' });
     } else {
        setResult([primes.join(', ')]);
        onGenerate({ id: crypto.randomUUID(), type: ToolType.MATH, result: `Primes ${primeMin}-${primeMax}`, timestamp: Date.now(), label: 'Prime List' });
     }
  };

  const generateCombinatorics = () => {
    const items = comboInput.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    if (items.length === 0) return;
    if (items.length > 8) {
       alert("Limit inputs to 8 items to prevent browser freeze (Combinatorics grow exponentially).");
       return;
    }
    
    // Combinations Logic
    const getCombinations = (arr: string[], k: number): string[][] => {
       if (k === 0) return [[]];
       if (arr.length === 0) return [];
       const [first, ...rest] = arr;
       const withFirst = getCombinations(rest, k - 1).map(c => [first, ...c]);
       const withoutFirst = getCombinations(rest, k);
       return [...withFirst, ...withoutFirst];
    };

    // Permutations Logic
    const getPermutations = (arr: string[], k: number): string[][] => {
       if (k === 0) return [[]];
       return arr.flatMap((v, i) => {
          const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
          return getPermutations(rest, k - 1).map(p => [v, ...p]);
       });
    };

    const fn = comboType === 'COMB' ? getCombinations : getPermutations;
    const rawRes = fn(items, comboSize);
    const formatted = rawRes.map(r => `[${r.join(', ')}]`);
    
    if (formatted.length > 5000) {
       setResult(formatted.slice(0, 5000).concat(`... and ${formatted.length - 5000} more.`));
    } else {
       setResult(formatted);
    }
    
    onGenerate({ 
       id: crypto.randomUUID(), 
       type: ToolType.MATH, 
       result: `${formatted.length} ${comboType === 'COMB' ? 'Combinations' : 'Permutations'}`, 
       timestamp: Date.now(), 
       label: `${comboType} of ${items.length}` 
    });
  };

  return (
    <div className="space-y-6">
      {/* Math Tools Nav */}
      <div className="flex flex-wrap gap-2 pb-2">
        {[
          { id: 'PARTITION', label: 'Sum Partition', icon: Sigma },
          { id: 'DIGIT_SUM', label: 'Digit Sums', icon: Calculator },
          { id: 'MULTIPLES', label: 'Multiples', icon: Divide },
          { id: 'PRIMES', label: 'Primes', icon: Hash },
          { id: 'COMBO', label: 'Combinatorics', icon: Grip },
        ].map(t => (
           <button
             key={t.id}
             onClick={() => { setMode(t.id as MathMode); setResult([]); }}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
               mode === t.id 
               ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
               : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
             }`}
           >
             <t.icon className="w-4 h-4" />
             {t.label}
           </button>
        ))}
      </div>

      <div className="bg-slate-800/50 p-6 md:p-8 rounded-xl border border-slate-700/50 min-h-[250px] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-2">
         
         {/* PARTITION MODE */}
         {mode === 'PARTITION' && (
           <div className="space-y-6 max-w-lg mx-auto w-full">
              <div className="text-center">
                 <h3 className="text-lg font-bold text-white">Integer Partition Generator</h3>
                 <p className="text-xs text-slate-400">Generate {partCount} numbers that add up exactly to {partSum}.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Sum</label>
                    <input type="number" min="1" value={partSum} onChange={e => setPartSum(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Count of Numbers</label>
                    <input type="number" min="2" max="50" value={partCount} onChange={e => setPartCount(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white" />
                 </div>
              </div>
              <button onClick={generatePartitions} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg">Generate Partition</button>
           </div>
         )}

         {/* DIGIT SUM MODE */}
         {mode === 'DIGIT_SUM' && (
            <div className="space-y-6 max-w-lg mx-auto w-full">
              <div className="text-center">
                 <h3 className="text-lg font-bold text-white">Digit Sum Finder</h3>
                 <p className="text-xs text-slate-400">Find {digitLen}-digit numbers where the digits add up to {targetDigitSum}.</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Digits (Length)</label>
                    <input type="number" min="1" max="20" value={digitLen} onChange={e => setDigitLen(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Sum</label>
                    <input type="number" min="1" value={targetDigitSum} onChange={e => setTargetDigitSum(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
                    <input type="number" min="1" max="20" value={digitSumCount} onChange={e => setDigitSumCount(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white" />
                 </div>
              </div>
              <button onClick={generateDigitSums} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg">Find Numbers</button>
           </div>
         )}

         {/* MULTIPLES MODE */}
         {mode === 'MULTIPLES' && (
           <div className="space-y-6 max-w-lg mx-auto w-full">
              <div className="text-center">
                 <h3 className="text-lg font-bold text-white">Divisibility Generator</h3>
                 <p className="text-xs text-slate-400">Random numbers divisible by {divisor}.</p>
              </div>
              <div className="flex items-center gap-2">
                 <input type="number" value={multMin} onChange={e => setMultMin(Number(e.target.value))} className="w-24 bg-slate-900 border border-slate-600 rounded px-2 py-2 text-white text-center" placeholder="Min"/>
                 <span className="text-slate-500">-</span>
                 <input type="number" value={multMax} onChange={e => setMultMax(Number(e.target.value))} className="w-24 bg-slate-900 border border-slate-600 rounded px-2 py-2 text-white text-center" placeholder="Max"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Divisible By (k)</label>
                    <input type="number" min="1" value={divisor} onChange={e => setDivisor(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
                    <input type="number" min="1" max="100" value={multCount} onChange={e => setMultCount(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white" />
                 </div>
              </div>
              <button onClick={generateMultiples} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg">Generate Multiples</button>
           </div>
         )}

         {/* PRIMES MODE */}
         {mode === 'PRIMES' && (
           <div className="space-y-6 max-w-lg mx-auto w-full">
              <div className="text-center">
                 <h3 className="text-lg font-bold text-white">Prime Number Tools</h3>
                 <p className="text-xs text-slate-400">Find prime numbers in a range.</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                 <div className="flex-1">
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Min</label>
                   <input type="number" value={primeMin} onChange={e => setPrimeMin(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white" />
                 </div>
                 <div className="flex-1">
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Max</label>
                   <input type="number" value={primeMax} onChange={e => setPrimeMax(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white" />
                 </div>
              </div>
              <div className="flex gap-2 bg-slate-900 p-1 rounded-lg">
                 <button onClick={() => setPrimeAction('LIST')} className={`flex-1 py-2 text-xs font-bold rounded ${primeAction === 'LIST' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>List All</button>
                 <button onClick={() => setPrimeAction('PICK')} className={`flex-1 py-2 text-xs font-bold rounded ${primeAction === 'PICK' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>Pick Random</button>
              </div>
              <button onClick={generatePrimes} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg">Run</button>
           </div>
         )}

         {/* COMBO MODE */}
         {mode === 'COMBO' && (
           <div className="space-y-6 max-w-lg mx-auto w-full">
              <div className="text-center">
                 <h3 className="text-lg font-bold text-white">Combinatorics Engine</h3>
                 <div className="flex items-center justify-center gap-2 text-amber-500 text-xs mt-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Exponential growth: Keep items below 8.</span>
                 </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Items (comma separated)</label>
                 <input type="text" value={comboInput} onChange={e => setComboInput(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Size (r)</label>
                    <input type="number" min="1" max={8} value={comboSize} onChange={e => setComboSize(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Method</label>
                    <select value={comboType} onChange={e => setComboType(e.target.value as any)} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white outline-none">
                       <option value="PERM">Permutations</option>
                       <option value="COMB">Combinations</option>
                    </select>
                 </div>
              </div>
              <button onClick={generateCombinatorics} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg">Compute All</button>
           </div>
         )}
      </div>

      {/* RESULTS DISPLAY */}
      {result.length > 0 && (
        <div className="mt-8 border-t border-slate-800 pt-8 animate-in fade-in slide-in-from-bottom-4">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-medium text-white">Generated Results <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{result.length}</span></h3>
             <button onClick={() => navigator.clipboard.writeText(result.join('\n'))} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
               <Copy className="w-3 h-3" /> Copy All
             </button>
           </div>
           
           <div className={`bg-slate-900 rounded-xl p-4 border border-slate-800 max-h-96 overflow-y-auto custom-scrollbar ${result.length > 20 ? 'grid grid-cols-2 md:grid-cols-4 gap-2' : 'space-y-2'}`}>
              {result.map((res, idx) => (
                <div key={idx} className={`text-slate-300 font-mono ${result.length > 20 ? 'text-xs border border-slate-800 p-1 text-center bg-slate-950 rounded' : 'text-base p-2 bg-slate-950 rounded border border-slate-800'}`}>
                  {res}
                </div>
              ))}
           </div>
        </div>
      )}

      {/* SEO Content Section */}
      <section className="mt-12 pt-8 border-t border-slate-800/50 text-center">
         <h2 className="text-xl font-bold text-white mb-3">Math Partition & Primes Generator</h2>
         <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Solve complex numeric problems with our <strong>Math Random Tools</strong>. 
            Calculate <strong>Integer Partitions</strong> (random numbers summing to a specific target), find numbers with a specific <strong>Digit Sum</strong>, or generate lists of <strong>Prime Numbers</strong> within a custom range. 
            Perfect for math students, teachers, and puzzle creators needing instant combinatorics and probability solutions.
         </p>
      </section>
    </div>
  );
};

export default MathRNG;
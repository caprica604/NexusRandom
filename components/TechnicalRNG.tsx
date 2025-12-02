import React, { useState } from 'react';
import { generateUUID, generateHex, generatePassword, getRandomInt } from '../utils/random';
import { HistoryItem, ToolType } from '../types';
import { Fingerprint, Hash, Lock, Binary, Palette, Type, Smartphone, CreditCard, RefreshCw, Copy } from 'lucide-react';

interface TechnicalRNGProps {
  onGenerate: (item: HistoryItem) => void;
}

type TechMode = 'UUID' | 'HEX' | 'BINARY' | 'COLOR' | 'ASCII' | 'PIN' | 'PASSWORD' | 'PHONE' | 'CC';

const TechnicalRNG: React.FC<TechnicalRNGProps> = ({ onGenerate }) => {
  const [mode, setMode] = useState<TechMode>('UUID');
  const [result, setResult] = useState<string>("");
  
  // Generic Length Config
  const [length, setLength] = useState<number>(16);
  
  // Password Config
  const [pwOpts, setPwOpts] = useState({ numbers: true, symbols: true, uppercase: true });

  // CC Config
  const [ccType, setCcType] = useState<'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER'>('VISA');

  const generateLuhn = (prefix: string, len: number): string => {
    let cc = prefix;
    while (cc.length < len - 1) {
      cc += getRandomInt(0, 9).toString();
    }
    
    let sum = 0;
    let double = true; // We start doubling from the digit immediately left of the check digit (which is the last digit of payload)
    
    // Luhn algo: from right to left, double every second digit. 
    // Since we are calculating the check digit (which would be at index len-1), 
    // the digit at len-2 (last of payload) is the first one encountered, so it is doubled.
    for (let i = cc.length - 1; i >= 0; i--) {
      let d = parseInt(cc.charAt(i));
      if (double) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      double = !double;
    }
    
    const check = (10 - (sum % 10)) % 10;
    return cc + check;
  };

  const handleGenerate = () => {
    let res = "";
    switch (mode) {
      case 'UUID':
        res = generateUUID();
        break;
      case 'HEX':
        res = generateHex(length);
        break;
      case 'BINARY':
        res = Array.from({ length }, () => Math.random() > 0.5 ? '1' : '0').join('');
        break;
      case 'COLOR':
        res = '#' + generateHex(6).toUpperCase().substring(0, 6);
        break;
      case 'ASCII':
        // Printable ASCII 33 (!) to 126 (~)
        res = Array.from({ length }, () => String.fromCharCode(getRandomInt(33, 126))).join('');
        break;
      case 'PIN':
        res = Array.from({ length: Math.min(Math.max(length, 4), 12) }, () => getRandomInt(0, 9)).join('');
        break;
      case 'PASSWORD':
        res = generatePassword(length, pwOpts);
        break;
      case 'PHONE':
        res = `(${getRandomInt(200, 999)}) ${getRandomInt(200, 999)}-${getRandomInt(1000, 9999)}`;
        break;
      case 'CC':
        if (ccType === 'VISA') res = generateLuhn('4', 16);
        else if (ccType === 'MASTERCARD') res = generateLuhn(getRandomInt(51, 55).toString(), 16);
        else if (ccType === 'AMEX') res = generateLuhn(['34', '37'][getRandomInt(0, 1)], 15);
        else if (ccType === 'DISCOVER') res = generateLuhn('6011', 16);
        break;
    }
    setResult(res);
    onGenerate({
      id: crypto.randomUUID(),
      type: ToolType.TECHNICAL,
      result: res,
      timestamp: Date.now(),
      label: mode === 'CC' ? `Test ${ccType}` : mode
    });
  };

  const tools = [
     { id: 'UUID', icon: Fingerprint, label: 'UUID' },
     { id: 'HEX', icon: Hash, label: 'Hex' },
     { id: 'BINARY', icon: Binary, label: 'Binary' },
     { id: 'COLOR', icon: Palette, label: 'Color' },
     { id: 'ASCII', icon: Type, label: 'ASCII' },
     { id: 'PIN', icon: Lock, label: 'PIN' },
     { id: 'PASSWORD', icon: Lock, label: 'Pass' },
     { id: 'PHONE', icon: Smartphone, label: 'Phone' },
     { id: 'CC', icon: CreditCard, label: 'Cards' },
  ];

  return (
    <div className="space-y-6">
       {/* Tool Grid */}
       <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
         {tools.map(t => (
           <button
             key={t.id}
             onClick={() => { 
                setMode(t.id as TechMode); 
                setResult(""); 
                // Set sane defaults when switching
                if (t.id === 'PIN') setLength(4); 
                else if (t.id === 'HEX') setLength(16);
                else if (t.id === 'ASCII') setLength(12);
                else if (t.id === 'PASSWORD') setLength(16);
             }}
             className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
               mode === t.id 
               ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
               : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-500'
             }`}
           >
             <t.icon className="w-5 h-5 mb-1.5" />
             <span className="text-[10px] font-bold uppercase tracking-wider">{t.label}</span>
           </button>
         ))}
       </div>

       {/* Config Area */}
       <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 min-h-[160px] flex flex-col justify-center">
          
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              {tools.find(t => t.id === mode)?.label} Generator
            </h3>
            <p className="text-xs text-slate-500">
              {mode === 'UUID' && "RFC4122 version 4 Universally Unique Identifier."}
              {mode === 'HEX' && "Random Hexadecimal string."}
              {mode === 'BINARY' && "Random sequence of 0s and 1s."}
              {mode === 'COLOR' && "Random Hexadecimal color code with preview."}
              {mode === 'ASCII' && "Random printable ASCII characters (symbol heavy)."}
              {mode === 'PIN' && "Secure numeric PIN code."}
              {mode === 'CC' && "Luhn-valid credit card numbers for testing purposes only."}
              {mode === 'PHONE' && "Random US formatted phone numbers."}
              {mode === 'PASSWORD' && "Strong password generator."}
            </p>
          </div>

          <div className="space-y-4">
            {/* Length Slider for variable length modes */}
            {['HEX', 'BINARY', 'ASCII', 'PIN', 'PASSWORD'].includes(mode) && (
              <div>
                 <div className="flex justify-between text-xs text-slate-400 mb-2 uppercase font-bold">
                   <span>Length</span>
                   <span className="text-indigo-400 font-mono">{length}</span>
                 </div>
                 <input 
                   type="range" 
                   min={mode === 'PIN' ? 4 : 4} 
                   max={mode === 'PIN' ? 12 : 64} 
                   step={1}
                   value={length} 
                   onChange={(e) => setLength(Number(e.target.value))}
                   className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                 />
              </div>
            )}

            {/* Password Options */}
            {mode === 'PASSWORD' && (
               <div className="flex flex-wrap gap-4">
                 {['uppercase', 'numbers', 'symbols'].map(k => (
                   <label key={k} className="flex items-center gap-2 cursor-pointer">
                     <input 
                        type="checkbox" 
                        checked={pwOpts[k as keyof typeof pwOpts]} 
                        onChange={e => setPwOpts({...pwOpts, [k]: e.target.checked})} 
                        className="rounded border-slate-600 bg-slate-900 text-indigo-500" 
                     />
                     <span className="text-sm text-slate-300 capitalize">{k}</span>
                   </label>
                 ))}
               </div>
            )}

            {/* Credit Card Type */}
            {mode === 'CC' && (
              <div className="flex flex-wrap gap-2">
                {['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'].map(type => (
                  <button
                    key={type}
                    onClick={() => setCcType(type as any)}
                    className={`px-3 py-1.5 rounded text-xs font-bold border transition-colors ${
                      ccType === type 
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                      : 'bg-slate-900 border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}

            <button
               onClick={handleGenerate}
               className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
             >
               <RefreshCw className="w-4 h-4" /> Generate
             </button>
          </div>
       </div>

       {/* Result Area */}
       {result && (
         <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="relative group">
              <div 
                className={`
                  p-5 rounded-lg border border-slate-700 font-mono text-center break-all text-xl shadow-inner flex items-center justify-center gap-4
                  ${mode === 'COLOR' ? 'bg-slate-900' : 'bg-slate-950 text-emerald-400'}
                `}
              > 
                {mode === 'COLOR' && (
                  <div 
                    className="w-12 h-12 rounded-lg border border-white/20 shadow-lg shrink-0" 
                    style={{ backgroundColor: result }}
                  />
                )}
                
                <span className={mode === 'COLOR' ? 'text-white' : ''}>{result}</span>
              </div>
              
              <button 
                onClick={() => navigator.clipboard.writeText(result)}
                className="absolute top-2 right-2 p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition-all opacity-0 group-hover:opacity-100"
                title="Copy to Clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
         </div>
       )}

      {/* SEO Content Section */}
      <section className="mt-12 pt-8 border-t border-slate-800/50 text-center">
         <h2 className="text-xl font-bold text-white mb-3">Developer & Technical Generator Tools</h2>
         <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Essential tools for developers, testers, and security professionals. 
            Generate secure <strong>Passwords</strong>, standard <strong>UUIDs (v4)</strong>, random <strong>Hexadecimal Color Codes</strong>, and test credit card numbers with valid Luhn checksums (Visa, MasterCard, Amex).
            Create random binary strings, ASCII sequences, and secure numeric PINs instantly for QA testing and data mocking.
         </p>
      </section>
    </div>
  );
};

export default TechnicalRNG;
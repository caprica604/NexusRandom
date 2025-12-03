import React, { useState } from 'react';
import { generateCreativeRandom } from '../services/geminiService';
import { HistoryItem, ToolType } from '../types';
import { Sparkles, Brain, Loader2, AlertCircle } from 'lucide-react';

interface AiRNGProps {
  onGenerate: (item: HistoryItem) => void;
}

const SUGGESTIONS = [
  "Sci-fi Planet Names",
  "Startup Ideas",
  "Excuses for being late",
  "Color Palettes (Hex codes)",
  "D&D NPC Names"
];

const AiRNG: React.FC<AiRNGProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResults([]);
    
    const data = await generateCreativeRandom(prompt, count);
    
    setResults(data);
    setLoading(false);
    
    if (data.length > 0 && !data[0].startsWith("Error")) {
      onGenerate({
        id: crypto.randomUUID(),
        type: ToolType.AI,
        result: data,
        timestamp: Date.now(),
        label: `AI: ${prompt}`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 p-6 rounded-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Creative Random</h3>
              <p className="text-sm text-slate-400">Powered by Gemini.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">What do you want to generate?</label>
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Medieval tavern names' or 'Jazz song titles'"
              className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all placeholder-slate-600"
            />
          </div>

          <div className="flex items-center gap-4">
             <div className="flex-1">
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
               <input 
                 type="number" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))}
                 className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-2 text-white"
               />
             </div>
             <div className="flex-[3] flex items-end">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  {loading ? 'Thinking...' : 'Imagine'}
                </button>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {SUGGESTIONS.map(s => (
              <button 
                key={s} 
                onClick={() => setPrompt(s)}
                className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-400 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {results.length > 0 && !results[0].startsWith("Error") && (
        <div className="grid grid-cols-1 gap-3">
          {results.map((r, i) => (
            <div key={i} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2" style={{animationDelay: `${i * 50}ms`}}>
              <span className="text-indigo-500 font-mono text-sm opacity-50">{(i+1).toString().padStart(2, '0')}</span>
              <span className="text-white text-lg">{r}</span>
            </div>
          ))}
        </div>
      )}

      {results.length > 0 && results[0].startsWith("Error") && (
         <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg text-red-200 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {results[0]}
         </div>
      )}

      {/* SEO Content Section */}
      <section className="mt-12 pt-8 border-t border-slate-800/50 text-center">
         <h2 className="text-xl font-bold text-white mb-3">AI Powered Random Generator</h2>
         <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Go beyond simple numbers with our <strong>Smart AI Random Generator</strong>. 
            Powered by <strong>Google Gemini</strong>, this tool understands context to generate creative lists, names, ideas, and concepts.
            Whether you need "Sci-fi Planet Names", "Blog Post Ideas", or "D&D Encounter Scenarios", our AI delivers unique, context-aware results instantly.
         </p>
      </section>
    </div>
  );
};

export default AiRNG;
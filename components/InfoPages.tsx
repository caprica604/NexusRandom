
import React from 'react';
import { Shield, Zap, Globe, Github, Heart } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Cinematic Banner */}
      <div className="relative h-48 md:h-64 rounded-xl overflow-hidden shadow-2xl border border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop" 
          alt="Nexus Network Global" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 p-8 z-20">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Global & Secure</h1>
          <p className="text-indigo-300 font-mono">EST. {new Date().getFullYear()}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-xl">
        <h2 className="text-3xl font-bold text-white mb-4">About NexusRandom</h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          NexusRandom is a comprehensive digital toolkit for randomization, data generation, and utility calculations. 
          We provide a suite of free, fast, and privacy-focused tools for developers, gamers, and everyday users.
          No bloated software, no tracking—just instant results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mission */}
        <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-indigo-500/20 rounded-lg"><Zap className="w-5 h-5 text-indigo-400" /></div>
             <h3 className="text-xl font-bold text-white">Our Mission</h3>
          </div>
          <p className="text-slate-400 leading-relaxed text-sm">
            To create the most reliable and accessible set of random generation tools on the web. 
            Whether you need a lottery quick pick, a secure password, or a dice roller, we believe it should be instant and free.
          </p>
        </div>

        {/* Privacy */}
        <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-emerald-500/20 rounded-lg"><Shield className="w-5 h-5 text-emerald-400" /></div>
             <h3 className="text-xl font-bold text-white">Privacy First</h3>
          </div>
          <p className="text-slate-400 leading-relaxed text-sm">
            NexusRandom uses a client-side first architecture. 
            Your generated passwords, PINs, and data lists are created strictly within your browser using the Web Crypto API. 
            We do not transmit your generated data to any server.
          </p>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-xl mt-4">
         <h3 className="text-lg font-bold text-white mb-6">Why Choose Us?</h3>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <Globe className="w-8 h-8 text-blue-400 mb-3" />
              <h4 className="font-bold text-white text-sm">Always Online</h4>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <Heart className="w-8 h-8 text-rose-400 mb-3" />
              <h4 className="font-bold text-white text-sm">Free & Premium</h4>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <Github className="w-8 h-8 text-slate-400 mb-3" />
              <h4 className="font-bold text-white text-sm">Open Tech</h4>
            </div>
         </div>
      </div>
    </div>
  );
};


import React from 'react';
import { Shield, Zap, Globe, Github, Heart } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Hero Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500"></div>
        <h2 className="text-3xl font-bold text-white mb-4">About NexusRandom</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          The all-in-one digital toolkit for randomization, data generation, and utility calculations. 
          Fast, free, and privacy-focused.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mission */}
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
             <Zap className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
          <p className="text-slate-400 leading-relaxed">
            We aim to provide developers, gamers, teachers, and curious minds with the most comprehensive set of random generation tools on the web. 
            We believe simple tools should be beautiful, accessible, and instant—without bloated software or intrusive tracking.
          </p>
        </div>

        {/* Privacy */}
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
             <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Privacy First</h3>
          <p className="text-slate-400 leading-relaxed">
            NexusRandom is designed with a client-side first architecture. 
            Your generated passwords, PINs, and data lists are created strictly within your browser using the Web Crypto API. 
            We do not store, log, or transmit your generated data to any server.
          </p>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-xl">
         <h3 className="text-xl font-bold text-white mb-6 text-center">Why Choose Us?</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Globe className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-1">Always Online</h4>
              <p className="text-sm text-slate-500">Accessible from any device, anywhere, anytime.</p>
            </div>
            <div className="text-center">
              <Heart className="w-8 h-8 text-rose-400 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-1">Free to Use</h4>
              <p className="text-sm text-slate-500">Core features are completely free. Premium supports us.</p>
            </div>
            <div className="text-center">
              <Github className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-1">Modern Tech</h4>
              <p className="text-sm text-slate-500">Built with React and Tailwind for speed and reliability.</p>
            </div>
         </div>
      </div>
    </div>
  );
};
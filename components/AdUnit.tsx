import React from 'react';
import { Info } from 'lucide-react';

interface AdUnitProps {
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  slotId?: string;
  label?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ format = 'auto', className = '', slotId = '1234567890', label = 'Advertisement' }) => {
  // Styles mimicking Google AdSense placeholder
  // In a real implementation, this would contain the <ins> tag.
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} role="complementary" aria-label={label}>
        <div className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 w-full text-center select-none">{label}</div>
        <div className={`
            relative overflow-hidden bg-slate-900 border border-slate-800 rounded-sm flex items-center justify-center select-none
            ${format === 'rectangle' ? 'w-[250px] h-[250px] md:w-[300px]' : ''}
            ${format === 'horizontal' ? 'w-full h-[90px] max-w-[728px]' : ''}
            ${format === 'vertical' ? 'w-[160px] h-[600px]' : ''}
            ${format === 'auto' ? 'w-full h-32' : ''}
        `}>
            {/* Simulation of the AdSense Iframe/Container content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/20">
                <span className="text-xs font-sans text-slate-500 font-medium">Google Ads</span>
                <span className="text-[10px] text-slate-600">{format} unit</span>
            </div>
            
            {/* AdChoice / Info Icon simulation */}
            <div className="absolute top-0 right-0 p-0.5 bg-slate-800/80 rounded-bl">
                <Info className="w-3 h-3 text-slate-500" />
            </div>
        </div>
    </div>
  );
};

export default AdUnit;
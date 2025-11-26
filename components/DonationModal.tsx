import React, { useState, useEffect } from 'react';
import { X, Crown, Check, ShieldCheck, ArrowRight, ExternalLink, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'OFFER' | 'PAYMENT'>('OFFER');
  const [paymentUrl, setPaymentUrl] = useState<string>('');

  // ==============================================================================
  // 🟢 CONFIGURATION REQUIRED:
  // REPLACE THE EMAIL BELOW WITH YOUR ACTUAL PAYPAL BUSINESS/PERSONAL EMAIL
  // ==============================================================================
  const PAYPAL_EMAIL = "dk15586402@gmail.com"; 
  // ==============================================================================

  useEffect(() => {
    if (isOpen) {
      // Construct the PayPal "Buy Now" URL
      // This sends the user to PayPal to pay $2.00 directly to your email.
      const params = new URLSearchParams({
        cmd: "_xclick",             // _xclick = Buy Now button
        business: PAYPAL_EMAIL,     // Money goes here
        item_name: "Nexus Random Premium",
        amount: "2.00",
        currency_code: "USD",
        no_shipping: "1",           // Digital goods, no shipping needed
        no_note: "1",
        return: window.location.href, // Redirect back after payment
        cancel_return: window.location.href,
        rm: "1",
        notify_url: window.location.href
      });
      setPaymentUrl(`https://www.paypal.com/cgi-bin/webscr?${params.toString()}`);
      setStep('OFFER');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePaymentClick = () => {
    // Safety check for the developer
    if (PAYPAL_EMAIL.includes("example.com")) {
      alert("⚠️ Setup Required:\n\nPlease open 'components/DonationModal.tsx' and replace 'your-paypal-email@example.com' with your actual PayPal email address.");
      return;
    }
    
    // Attempt to open in new tab
    const newWindow = window.open(paymentUrl, '_blank');
    
    // Move to verification step immediately
    setStep('PAYMENT');
  };

  const handleVerify = () => {
    // In a client-only app (no backend database), we trust the user has completed the flow.
    // This activates the "Premium" state in the browser.
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-amber-600 to-orange-700 p-8 text-white text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px'}}></div>
          
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20 shadow-xl relative z-10">
            <Crown className="w-8 h-8 fill-amber-200 text-amber-100" />
          </div>
          <h3 className="text-2xl font-bold relative z-10">Upgrade to Premium</h3>
          <p className="text-amber-100 text-sm mt-2 opacity-90 relative z-10">Unlock the full potential of Nexus Random.</p>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'OFFER' ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <div className="p-1 bg-green-500/20 rounded-full"><Check className="w-4 h-4 text-green-400" /></div>
                  <span className="text-sm font-medium">Remove all advertisements</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <div className="p-1 bg-green-500/20 rounded-full"><Check className="w-4 h-4 text-green-400" /></div>
                  <span className="text-sm font-medium">Support ongoing development</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <div className="p-1 bg-green-500/20 rounded-full"><Check className="w-4 h-4 text-green-400" /></div>
                  <span className="text-sm font-medium">Exclusive Golden Badge</span>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center justify-between shadow-inner">
                <span className="text-slate-400 text-sm font-medium">One-time payment</span>
                <span className="text-2xl font-bold text-white">$2.00 <span className="text-xs text-slate-500 font-normal">USD</span></span>
              </div>

              <button
                onClick={handlePaymentClick}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                Get Premium Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Processed securely via PayPal
              </p>
            </div>
          ) : (
            <div className="space-y-6 text-center py-2 animate-in fade-in slide-in-from-right-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-400 border border-green-500/20 mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">Complete Payment</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  A PayPal window should have opened. Once you complete the <b>$2.00</b> transaction, click the activate button below.
                </p>
              </div>

              {/* Fallback Link */}
              <div className="bg-amber-900/20 border border-amber-500/20 rounded-lg p-3 text-left flex items-start gap-3">
                 <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                 <div className="text-xs text-amber-200/80">
                   <strong>Window didn't open?</strong> Browsers sometimes block popups. 
                   <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline ml-1 font-bold inline-flex items-center gap-1">
                     Click here to pay manually <ExternalLink className="w-3 h-3" />
                   </a>
                 </div>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={handleVerify}
                  className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 transition-all active:scale-[0.98]"
                >
                  I Have Paid - Activate
                </button>
                <button
                  onClick={() => setStep('OFFER')}
                  className="text-xs text-slate-500 hover:text-slate-300 underline"
                >
                  Back to options
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
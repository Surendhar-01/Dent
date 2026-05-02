import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, Copy, Check } from 'lucide-react';
import { Button } from './Button';

interface ShareQRCodeProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
  title?: string;
}

export function ShareQRCode({ isOpen, onClose, url, title = "Share Alpha Dent" }: ShareQRCodeProps) {
  const [copied, setCopied] = React.useState(false);
  const shareUrl = url || window.location.origin;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-6 right-6 top-1/2 -translate-y-1/2 bg-white rounded-[2.5rem] p-8 z-[101] shadow-2xl border border-blue-50 flex flex-col items-center text-center overflow-hidden"
          >
            {/* Background Decorations */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-50 rounded-full blur-3xl opacity-50" />

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>

            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 ring-8 ring-blue-50/50">
              <Share2 size={32} />
            </div>

            <h3 className="text-2xl font-display font-black text-[#002D5E] tracking-tight mb-2">
              {title}
            </h3>
            <p className="text-slate-500 text-sm font-medium mb-8 max-w-[200px]">
              Scan this QR code to open the app on your mobile device.
            </p>

            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 border-4 border-slate-50 mb-8 relative">
              <QRCodeSVG 
                value={shareUrl} 
                size={200}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/logo.svg", // Fallback to a placeholder if logo doesn't exist
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>

            <div className="w-full space-y-3">
              <Button 
                onClick={handleCopy}
                variant="outline" 
                className="w-full rounded-2xl flex items-center justify-center space-x-2 py-4 border-slate-200 text-[#002D5E]"
              >
                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                <span className="font-bold text-sm uppercase tracking-widest">
                  {copied ? 'Copied Link' : 'Copy Link'}
                </span>
              </Button>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest break-all px-4">
                {shareUrl}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

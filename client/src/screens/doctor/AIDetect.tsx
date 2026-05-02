import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, GlassCard } from '../../components/Card';
import { Button } from '../../components/Button';
import { 
  Camera, 
  Upload, 
  BrainCircuit, 
  Loader2, 
  ShieldCheck, 
  AlertCircle,
  FileSearch,
  ChevronLeft
} from 'lucide-react';
import { analyzeDentalImage } from '../../services/gemini';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function AIDetect() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { addAIAnalysis } = useData();
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    try {
      const aiResult = await analyzeDentalImage(image);
      setResult(aiResult);
      const isHigh = aiResult.toLowerCase().includes('high');
      const isMedium = aiResult.toLowerCase().includes('medium');
      addAIAnalysis({
        patientId: user?.id || 'anonymous',
        imageUrl: image,
        detection: aiResult.split('\n')[0] || 'Analysis complete',
        prevention: aiResult.split('•').slice(1).map(s => s.trim()).filter(Boolean).slice(0, 5),
        severity: isHigh ? 'high' : isMedium ? 'medium' : 'low',
      });
    } catch (error) {
      alert("AI analysis failed. Please ensure your GEMINI_API_KEY is configured.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-brand-dark">
      <div className="p-6 space-y-8 safe-top">
        <header className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center space-x-2">
          <ChevronLeft size={24} />
        </Button>
        <div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">AI Diagnostics</h2>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Image-based Analysis</p>
        </div>
      </header>

      {!image ? (
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-8 space-y-4 cursor-pointer hover:border-brand-orange/30 transition-all group"
          >
            <div className="w-20 h-20 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <div className="text-center space-y-1">
              <p className="text-white font-bold">Upload Dental Image</p>
              <p className="text-slate-500 text-xs">Supports JPG, PNG (Max 5MB)</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*"
              title="Upload dental image"
              aria-label="Upload dental image"
              className="hidden" 
            />
          </div>

          <GlassCard className="flex items-start space-x-3 p-4">
            <ShieldCheck className="text-green-500 shrink-0" size={20} />
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">Privacy Protected</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Images are processed directly via Gemini AI. We prioritize patient confidentiality and data encryption.
              </p>
            </div>
          </GlassCard>
        </div>
      ) : (
        <div className="space-y-6 pb-12">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 group">
            <img src={image} alt="uploaded" className="w-full aspect-square object-cover" />
            {!analyzing && (
              <Button 
                variant="secondary" 
                size="sm" 
                className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border-none text-white hover:bg-black/60"
                onClick={() => setImage(null)}
              >
                Change Photo
              </Button>
            )}
          </div>

          {!result && (
            <Button 
              className="w-full h-14 text-lg space-x-2"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>AI is Analyzing...</span>
                </>
              ) : (
                <>
                  <BrainCircuit />
                  <span>Analyze with Gemini AI</span>
                </>
              )}
            </Button>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-2 text-brand-orange">
                <FileSearch size={20} />
                <h3 className="font-bold uppercase tracking-widest text-xs">Diagnostic Report</h3>
              </div>
              
              <Card className="p-6 bg-brand-orange/5 border-brand-orange/20 relative overflow-hidden">
                <BrainCircuit className="absolute top-[-20px] right-[-20px] text-brand-orange/10 w-32 h-32" />
                <div className="prose prose-invert prose-sm max-w-none relative z-10">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                    {result}
                  </p>
                </div>
              </Card>

              <div className="flex flex-col space-y-3">
                <Button variant="outline" className="w-full" onClick={() => setImage(null)}>New Analysis</Button>
                <div className="flex items-center justify-center space-x-1 py-4 opacity-50">
                  <AlertCircle size={14} />
                  <span className="text-[10px] font-medium uppercase tracking-tighter">AI results are supportive and require human verification</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

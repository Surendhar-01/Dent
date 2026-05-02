import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Camera, 
  Image as ImageIcon, 
  ShieldCheck, 
  Clock, 
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ListChecks
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { analyzeDentalImage } from '../../services/gemini';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function PatientAI() {
  const navigate = useNavigate();
  const { addAIAnalysis } = useData();
  const { user } = useAuth();
  
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    severity: 'High Priority' | 'Needs Review' | 'Routine Care' | 'Monitor';
    description: string;
    suggestions: string[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const performAnalysis = async () => {
    if (!image) return;
    setAnalyzing(true);
    try {
      const aiResponse = await analyzeDentalImage(image);
      
      // Parse Gemini response (simple heuristic, in prod use structured output)
      const severity: any = aiResponse.includes('High Priority') ? 'High Priority' : 
                         aiResponse.includes('Needs Review') ? 'Needs Review' : 
                         aiResponse.includes('Routine Care') ? 'Routine Care' : 'Monitor';
      
      const parsedResult = {
        summary: aiResponse.split('\n')[0].replace('Detected Issue:', '').trim(),
        severity,
        description: aiResponse.split('Description:')[1]?.split('Suggestions:')[0]?.trim() || "Analysis complete.",
        suggestions: aiResponse.split('Suggestions:')[1]?.split('\n').filter(s => s.trim().length > 5).slice(0, 4) || []
      };

      setResult(parsedResult);
      
      if (user) {
        addAIAnalysis({
          patientId: user.id,
          imageUrl: image,
          result: parsedResult.summary,
          severity: parsedResult.severity,
          suggestions: parsedResult.suggestions
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* Header */}
      <header className="px-6 py-6 flex items-center space-x-4 sticky top-0 bg-white/80 backdrop-blur-md z-10 safe-top">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={24} className="text-slate-800" />
        </button>
        <h1 className="text-xl font-black text-slate-800">Infection Detection</h1>
      </header>

      <div className="px-6 py-4 space-y-8">
        {!result ? (
          <>
            {/* Image Placeholder / Preview */}
            <div 
              className={cn(
                "aspect-[4/5] rounded-[44px] border-2 border-dashed flex flex-col items-center justify-center p-8 text-center space-y-6 transition-all overflow-hidden relative",
                image ? "border-teal-500 bg-teal-50/10" : "border-blue-100 bg-white"
              )}
            >
              {image ? (
                <>
                  <img src={image} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                  <Button 
                    variant="ghost" 
                    onClick={() => setImage(null)}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white border-white/30"
                  >Change</Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mx-auto">
                    <Camera size={40} />
                  </div>
                  <p className="text-slate-400 font-bold text-sm max-w-[180px]">Take a clear photo of the affected area</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="h-16 rounded-2xl bg-teal- gradient shadow-lg flex items-center space-x-2"
                style={{ background: 'linear-gradient(135deg, #2BCFC4 0%, #00A3FF 100%)' }}
              >
                <Camera size={20} />
                <span>Take Photo</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-16 rounded-2xl border-teal-100 text-teal-600 bg-teal-50/30 font-black shadow-sm"
              >
                <span>Gallery (Max 2)</span>
              </Button>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />

            {image && !analyzing && (
              <Button 
                onClick={performAnalysis}
                className="w-full h-16 rounded-3xl teal-gradient text-white font-black text-lg shadow-xl"
              >
                Start AI Analysis
              </Button>
            )}

            {analyzing && (
              <div className="text-center space-y-4 py-8">
                <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto" />
                <p className="text-teal-600 font-black uppercase tracking-widest text-xs">AI is screening for infections...</p>
              </div>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-5 bg-slate-50/50 border-slate-100 rounded-3xl space-y-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <ShieldCheck size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[12px] font-black text-slate-800">Privacy Protected</h4>
                  <p className="text-[10px] text-slate-400 font-bold">Your data is encrypted</p>
                </div>
              </Card>
              <Card className="p-5 bg-slate-50/50 border-slate-100 rounded-3xl space-y-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Clock size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[12px] font-black text-slate-800">Instant Result</h4>
                  <p className="text-[10px] text-slate-400 font-bold">Powered by Gemini AI</p>
                </div>
              </Card>
            </div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Result Display */}
            <div className="text-center space-y-4">
              <div className={cn(
                "inline-flex items-center space-x-2 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl",
                result.severity === 'High Priority' ? "bg-red-500 text-white shadow-red-200" :
                result.severity === 'Needs Review' ? "bg-orange-500 text-white shadow-orange-200" :
                "bg-green-500 text-white shadow-green-200"
              )}>
                {result.severity === 'High Priority' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                <span>Urgency: {result.severity}</span>
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">{result.summary}</h2>
              <p className="text-slate-500 font-medium leading-relaxed">{result.description}</p>
            </div>

            <section className="space-y-4">
              <div className="flex items-center space-x-2">
                <ListChecks className="text-teal-500" size={20} />
                <h3 className="font-black text-slate-800">Prevention & Action</h3>
              </div>
              <div className="space-y-3">
                {result.suggestions.map((tip, i) => (
                  <Card key={i} className="p-4 bg-teal-50/30 border-teal-100 rounded-2xl flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{i + 1}</div>
                    <p className="text-sm font-bold text-slate-700 leading-snug">{tip}</p>
                  </Card>
                ))}
              </div>
            </section>

            <Button 
              variant="outline" 
              className="w-full h-16 rounded-3xl border-slate-200 text-slate-500 font-black"
              onClick={() => { setImage(null); setResult(null); }}
            >
              Take Another Scan
            </Button>
            
            <Button 
              onClick={() => navigate('/patient')}
              className="w-full h-16 rounded-3xl bg-slate-900 text-white font-black"
            >
              Back to Home
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

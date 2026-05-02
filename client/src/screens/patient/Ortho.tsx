import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Camera, 
  Sparkles, 
  Microscope,
  Stethoscope,
  Info,
  TrendingUp,
  History,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export default function OrthoMonitor() {
  const navigate = useNavigate();
  const { orthoProgress } = useData();
  const { user } = useAuth();
  
  const progress = orthoProgress.find(p => p.patientId === user?.id);

  if (!progress) return <div>No ortho profile found.</div>;

  return (
    <div className="flex-1 overflow-y-auto bg-[#F1F9FE]">
      {/* Header */}
      <header className="px-6 py-8 flex items-center space-x-4 sticky top-0 bg-white/80 backdrop-blur-md z-30 shadow-sm border-b border-blue-50/50 safe-top">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={24} className="text-[#002D5E]" />
        </button>
        <h1 className="text-xl font-black text-[#002D5E] tracking-tight">Ortho Monitor</h1>
      </header>

      <div className="p-6 space-y-8">
        {/* Compliance Score */}
        <Card className="app-gradient p-8 text-white border-none shadow-2xl shadow-blue-500/30 rounded-[44px] relative overflow-hidden">
          <Activity className="absolute top-8 right-8 text-white/10 w-32 h-32" />
          <div className="space-y-6 relative z-10">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Weekly Compliance Score</p>
              <h2 className="text-5xl font-black tracking-tighter">{progress.complianceScore}%</h2>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.complianceScore}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">Week {progress.stage} of {progress.totalStages}</p>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <Button className="w-full h-20 rounded-[32px] bg-white text-teal-600 font-black text-lg shadow-xl shadow-teal-500/5 flex items-center justify-center space-x-3 border border-teal-50 mt-4 active:scale-95 transition-all">
          <Camera size={28} />
          <span>Capture Weekly Scan</span>
        </Button>

        {/* Pro Tip */}
        <Card className="bg-teal-50/50 border-teal-100/50 p-4 rounded-2xl flex space-x-3 items-start">
           <Info className="text-teal-500 shrink-0 mt-0.5" size={18} />
           <p className="text-[11px] font-bold text-teal-700 leading-relaxed">Pro tip: Use consistent light and don't omit the 'bite' scan to get accurate alignment match results.</p>
        </Card>

        {/* Progress History */}
        <section className="space-y-4 pt-4">
           <div className="flex items-center space-x-2 px-1">
             <History className="text-blue-500" size={20} />
             <h3 className="font-display font-black text-lg text-slate-800">Progress History</h3>
           </div>
           
           <div className="space-y-4">
              {progress.history.map((item, i) => (
                <Card key={i} className="p-4 bg-white border-slate-100 rounded-[32px] flex items-center space-x-5 shadow-sm">
                   <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                      <img src={item.imageUrl} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Week {item.week}</span>
                         <div className="flex items-center space-x-1 text-teal-500 bg-teal-50 px-2 py-0.5 rounded-lg">
                            <Sparkles size={10} />
                            <span className="text-[10px] font-black">{item.match}% Match</span>
                         </div>
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-snug">{item.feedback}</p>
                   </div>
                </Card>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}

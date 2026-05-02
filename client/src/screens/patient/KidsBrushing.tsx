import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Sparkles, 
  Moon, 
  Sun, 
  Trophy,
  History,
  Timer,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useData } from '../../context/DataContext';

export default function KidsBrushing() {
  const navigate = useNavigate();
  const { brushingLogs, addBrushingLog } = useData();
  const [session, setSession] = useState<'morning' | 'night' | null>(null);

  const stats = {
    streak: 5,
    todayScore: 98,
    totalSessions: brushingLogs.length
  };

  const handleFinish = (type: 'morning' | 'night') => {
    addBrushingLog({
      patientId: 'patient-1',
      date: new Date().toISOString().split('T')[0],
      sessions: [{ type, duration: 120, score: 95 }]
    });
    setSession(null);
    alert(`${type.toUpperCase()} brushing recorded! Great job! 🎉`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FFFBEB]">
      {/* Header */}
      <header className="px-6 py-8 flex items-center space-x-4 sticky top-0 bg-white/80 backdrop-blur-md z-30 shadow-sm border-b border-yellow-100 flex items-center justify-between safe-top">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ChevronLeft size={24} className="text-orange-600" />
          </button>
          <h1 className="text-xl font-black text-orange-600 tracking-tight">Kids Brushing Tracker</h1>
        </div>
        <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-yellow-500">
           <Trophy size={24} />
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* Streak Card */}
        <Card className="bg-gradient-to-br from-orange-400 to-yellow-400 p-8 text-white border-none shadow-2xl shadow-orange-500/30 rounded-[44px] overflow-hidden relative">
          <Sparkles className="absolute top-4 right-4 text-white/20 w-32 h-32" />
          <div className="space-y-6 relative z-10 text-center">
            <div className="bg-white/20 w-fit px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mx-auto mb-4">Brushing Legend</div>
            <div className="flex justify-center space-x-8">
               <div className="space-y-1">
                 <p className="text-5xl font-black">{stats.streak}</p>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Day Streak</p>
               </div>
               <div className="w-[1px] bg-white/20 self-stretch" />
               <div className="space-y-1">
                 <p className="text-5xl font-black">{stats.todayScore}</p>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Today's Score</p>
               </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
           <button 
            onClick={() => handleFinish('morning')}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-[40px] shadow-xl shadow-orange-200/20 border-2 border-white hover:border-yellow-400 transition-all space-y-4"
           >
             <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 shadow-inner">
                <Sun size={32} />
             </div>
             <span className="text-sm font-black text-slate-800">Morning Session</span>
           </button>
           <button 
            onClick={() => handleFinish('night')}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-[40px] shadow-xl shadow-blue-200/20 border-2 border-white hover:border-indigo-400 transition-all space-y-4"
           >
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-indigo-500 shadow-inner">
                <Moon size={32} />
             </div>
             <span className="text-sm font-black text-slate-800">Night Session</span>
           </button>
        </div>

        {/* History */}
        <section className="space-y-4 pt-4">
           <div className="flex items-center space-x-2 px-1">
             <History className="text-orange-500" size={20} />
             <h3 className="font-display font-black text-lg text-slate-800">Recent Brushing</h3>
           </div>
           
           <div className="space-y-4">
              {brushingLogs.slice(0, 5).map((log, i) => (
                <Card key={i} className="p-5 bg-white border-slate-100 rounded-[32px] flex items-center justify-between shadow-sm">
                   <div className="flex items-center space-x-4">
                      <div className="bg-yellow-50 p-3 rounded-2xl text-yellow-600">
                         <Timer size={20} />
                      </div>
                      <div>
                         <p className="font-black text-slate-800">{log.date}</p>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.sessions[0].type.toUpperCase()}</p>
                      </div>
                   </div>
                   <div className="flex items-center space-x-3">
                      <div className="text-right">
                         <p className="text-sm font-black text-teal-500">{log.sessions[0].score}%</p>
                      </div>
                      <CheckCircle2 size={24} className="text-teal-500" />
                   </div>
                </Card>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}

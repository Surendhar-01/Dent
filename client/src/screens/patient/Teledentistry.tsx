import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff,
  MessageSquare,
  Users,
  Settings,
  Shield
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

export default function Teledentistry() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="h-full bg-slate-900 flex flex-col text-white">
      {/* Consult Header */}
      <header className="px-6 py-6 flex items-center justify-between bg-black/20 backdrop-blur-md safe-top">
         <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-white/10 rounded-xl">
               <ChevronLeft size={24} />
            </button>
            <div>
               <h1 className="text-lg font-black tracking-tight">Active Consultation</h1>
               <div className="flex items-center space-x-1.5 mt-0.5">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Line • 04:20</span>
               </div>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <div className="p-2.5 bg-white/10 rounded-xl">
               <Shield size={20} className="text-teal-400" />
            </div>
         </div>
      </header>

      {/* Video Area */}
      <div className="flex-1 relative p-6">
         {/* Doctor View */}
         <div className="w-full h-full rounded-[40px] overflow-hidden relative shadow-2xl">
            <img 
               src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=800" 
               className="w-full h-full object-cover" 
               alt="doctor"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
               <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-1">Clinic Host</p>
               <h2 className="text-2xl font-black">Dr. Sarah Wilson</h2>
            </div>
         </div>

         {/* Patient Selfie View */}
         <div className="absolute top-10 right-10 w-32 h-44 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-black/50">
            <img 
               src={user?.avatar} 
               className="w-full h-full object-cover bg-slate-800" 
               alt="me"
            />
            <div className="absolute top-2 right-2 bg-black/40 p-1 rounded-lg">
               <MicOff size={12} className="text-red-400" />
            </div>
         </div>
      </div>

      {/* Control Bar */}
      <footer className="px-6 py-10 bg-slate-800/80 backdrop-blur-2xl rounded-t-[50px] border-t border-white/5 space-y-8">
         <div className="flex items-center justify-center space-x-6">
            <button className="w-16 h-16 bg-white/10 hover:bg-white/20 rounded-3xl flex items-center justify-center transition-all">
               <MicOff size={24} />
            </button>
            <button className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-[30px] flex items-center justify-center shadow-2xl shadow-red-500/40 transition-all transform active:scale-95" onClick={() => navigate(-1)}>
               <PhoneOff size={32} />
            </button>
            <button className="w-16 h-16 bg-white/10 hover:bg-white/20 rounded-3xl flex items-center justify-center transition-all">
               <VideoOff size={24} />
            </button>
         </div>

         <div className="grid grid-cols-3 gap-4 px-4">
            <button className="flex flex-col items-center space-y-2 opacity-60">
               <div className="p-3 bg-white/5 rounded-2xl">
                  <MessageSquare size={20} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Chat</span>
            </button>
            <button className="flex flex-col items-center space-y-2 opacity-60">
               <div className="p-3 bg-white/5 rounded-2xl">
                  <Users size={20} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Share</span>
            </button>
            <button className="flex flex-col items-center space-y-2 opacity-60">
               <div className="p-3 bg-white/5 rounded-2xl">
                  <Settings size={20} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Setup</span>
            </button>
         </div>
      </footer>
    </div>
  );
}

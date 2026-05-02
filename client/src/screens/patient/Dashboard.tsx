import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Bell, 
  Search, 
  ChevronRight, 
  BrainCircuit, 
  MessageCircle, 
  Calendar,
  Microscope,
  Stethoscope,
  Video,
  Star,
  SlidersHorizontal,
  LogOut,
  Clock,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/Logo';
import { cn } from '../../lib/utils';
import { ShareQRCode } from '../../components/ShareQRCode';

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const { doctors, appointments } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All Specialists');
  const [sortBy, setSortBy] = useState<'rating' | 'experience'>('rating');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const navigate = useNavigate();

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doctor.specialization?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All Specialists' || doctor.clinicName === filter;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.experience || 0) - (a.experience || 0);
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#F1F9FE]">
      <header className="px-6 py-6 bg-white/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-blue-50/50 safe-top">
        <Logo size="md" showText={true} className="flex-row gap-2" />
        
        <div className="flex items-center space-x-4">
          <div className="bg-[#E5F4FF] pl-2 pr-5 py-1.5 rounded-full flex items-center space-x-3 shadow-inner">
            <div className="w-10 h-10 bg-[#00A3FF] rounded-full flex items-center justify-center text-white font-black shadow-md overflow-hidden">
              <img src={user?.avatar} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <span className="text-[#002D5E] font-bold text-sm">{user?.name.split(' ')[0]}</span>
          </div>
          <button title="Notifications" aria-label="Notifications" className="relative p-2.5 bg-white rounded-full shadow-md text-slate-400">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button 
            onClick={() => setIsShareOpen(true)}
            title="Share App"
            aria-label="Share App"
            className="p-2.5 bg-white rounded-full shadow-md text-blue-500 hover:bg-blue-50 transition-colors"
          >
            <QrCode size={20} />
          </button>
          <button onClick={logout} title="Logout" aria-label="Logout" className="p-2.5 bg-white rounded-full shadow-md text-slate-400">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* Quick Action AI Cards */}
        <div className="space-y-4">
          <Link to="/patient/ai" className="block transform transition-transform active:scale-[0.98]">
            <Card className="app-gradient p-8 text-white border-none shadow-2xl shadow-blue-600/30 overflow-hidden relative group rounded-[40px]">
              <div className="absolute top-[-20px] right-[-20px] p-10 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <Stethoscope className="absolute top-8 right-8 text-white/20 w-32 h-32 -rotate-12" strokeWidth={1} />
              
              <div className="space-y-4 relative z-10">
                <div className="bg-blue-400/40 w-fit px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">Fast scan</div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">AI Infection Scan</h3>
                  <p className="text-white/80 text-sm font-medium max-w-[240px] leading-relaxed">
                    Upload a photo for instant detection and prevention tips.
                  </p>
                </div>
                <Button className="bg-white text-blue-600 w-full h-14 rounded-2xl flex items-center justify-center space-x-2 font-black shadow-2xl">
                  <Microscope size={20} />
                  <span>Start Scanning</span>
                </Button>
              </div>
            </Card>
          </Link>

          <Link to="/patient/chat" className="block transform transition-transform active:scale-[0.98]">
            <Card className="teal-gradient p-8 text-white border-none shadow-2xl shadow-teal-500/30 overflow-hidden relative group rounded-[40px]">
              <BrainCircuit className="absolute top-8 right-8 text-white/20 w-32 h-32 -rotate-12" strokeWidth={1} />
              
              <div className="space-y-4 relative z-10">
                <div className="bg-teal-400/40 w-fit px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">Always on</div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">AI Dental Assistant</h3>
                  <p className="text-white/80 text-sm font-medium max-w-[240px] leading-relaxed">
                    Chat with our AI for quick dental advice and hygiene tips.
                  </p>
                </div>
                <Button className="bg-white text-[#2BCFC4] w-full h-14 rounded-2xl flex items-center justify-center space-x-2 font-black shadow-2xl">
                  <MessageCircle size={20} />
                  <span>Chat with AI</span>
                </Button>
              </div>
            </Card>
          </Link>
        </div>

        {/* Specialized Features */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 px-1">
            <Star className="text-yellow-500 fill-yellow-500" size={18} />
            <h3 className="font-display font-black text-lg text-slate-800">Specialized Features</h3>
          </div>
          <div className="space-y-3">
            <Link to="/patient/ortho">
              <Card className="p-5 flex items-center justify-between border-slate-100/50 hover:bg-slate-50 active:scale-[0.99] transition-all rounded-[32px]">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-500 shadow-inner">
                    <Microscope size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800">Ortho Monitor</h4>
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">AI Progress Tracking</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-teal-300" />
              </Card>
            </Link>
            <Link to="/patient/teledentistry">
              <Card className="p-5 flex items-center justify-between border-slate-100/50 hover:bg-slate-50 active:scale-[0.99] transition-all rounded-[32px]">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-500 shadow-inner">
                    <Video size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800">Teledentistry Hub</h4>
                    <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Secure Video consultation</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-teal-300" />
              </Card>
            </Link>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="space-y-6">
          <div className="flex space-x-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search name, specialty, or hospital" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-16 bg-white border border-slate-100 rounded-[28px] pl-16 pr-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm"
              />
            </div>
            <button title="Filters" aria-label="Filters" className="w-16 h-16 bg-white border border-slate-100 rounded-[28px] flex items-center justify-center text-slate-500 shadow-sm">
              <SlidersHorizontal size={24} />
            </button>
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
            {['All Specialists', 'Coimbatore Oral Care', 'Elite Clinic', 'Dental Restore Clinic'].map((type) => (
              <button 
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  "px-6 py-4 rounded-[22px] text-sm font-black whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 border border-transparent",
                  filter === type 
                    ? "teal-gradient text-white shadow-xl shadow-teal-500/20" 
                    : "bg-white text-slate-500 hover:bg-slate-50"
                )}
              >
                {type === 'Elite Clinic' && <Stethoscope size={16} />}
                <span>{type}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between px-1">
            <h3 className="font-display font-black text-2xl text-slate-800 tracking-tight">Top Specialists</h3>
            <div className="flex items-center space-x-2">
               <div className="flex items-center bg-slate-100/50 rounded-xl p-1">
                 <button 
                  onClick={() => setSortBy('rating')}
                  className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest", sortBy === 'rating' ? "bg-white shadow-sm text-blue-600" : "text-slate-400")}
                 >Rating</button>
                 <button 
                  onClick={() => setSortBy('experience')}
                  className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest", sortBy === 'experience' ? "bg-white shadow-sm text-blue-600" : "text-slate-400")}
                 >Exp</button>
               </div>
              <button className="text-sm font-black text-teal-500 bg-teal-50 px-4 py-2 rounded-xl">See all</button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredDoctors.map((doc) => (
              <motion.div 
                key={doc.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/patient/doctor/${doc.id}`)}
                className="cursor-pointer"
              >
                <Card className="p-5 flex items-center justify-between border-blue-50/50 bg-white/80 backdrop-blur-sm shadow-xl shadow-blue-500/5 rounded-[32px]">
                  <div className="flex items-center space-x-5">
                    <div className="relative">
                      <img src={doc.avatar} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover bg-slate-100 border-2 border-white shadow-sm" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17L4 12"/></svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-slate-800 leading-tight">{doc.name}</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{doc.specialization}</p>
                      <div className="flex items-center space-x-2 mt-1.5">
                        <Calendar size={12} className="text-blue-500" />
                        <span className="text-[10px] font-black text-blue-500/70 uppercase tracking-widest">{doc.clinicName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-3">
                    <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg shadow-blue-500/20">
                      <Star size={14} className="fill-white" />
                      <span className="text-xs font-black">{doc.rating?.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{doc.experience} YRS</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <ShareQRCode 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        title="Invite Family & Friends"
      />
    </div>
  );
}

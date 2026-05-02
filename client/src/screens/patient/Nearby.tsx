import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  MapPin, 
  Navigation, 
  Star,
  Search,
  Phone,
  MessageCircle,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useData } from '../../context/DataContext';

export default function NearbyDoctors() {
  const navigate = useNavigate();
  const { doctors } = useData();

  const nearbyDoctors = doctors.slice(0, 5);

  return (
    <div className="flex-1 overflow-hidden bg-[#F1F9FE] flex flex-col">
      {/* Search Header */}
      <header className="px-6 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm border-b border-blue-50/50 safe-top">
        <div className="flex items-center space-x-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ChevronLeft size={24} className="text-[#002D5E]" />
          </button>
          <h1 className="text-xl font-black text-[#002D5E] tracking-tight">Nearby Doctors</h1>
        </div>
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search location or doctor..." 
            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-[24px] pl-16 pr-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-inner"
          />
        </div>
      </header>

      {/* Map Area (Simulated) */}
      <div className="flex-1 relative overflow-hidden bg-slate-200">
         <img 
            src="https://media.wired.com/photos/59269770af951525445b35d5/master/w_2560%2Cc_limit/GoogleMap-600x400.jpg" 
            className="w-full h-full object-cover opacity-50 grayscale-[0.5]" 
         />
         
         {/* Custom Markers */}
         <div className="absolute top-1/4 left-1/3 w-10 h-10 bg-blue-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white animate-bounce">
            <MapPin size={24} />
         </div>
         <div className="absolute top-1/2 left-2/3 w-10 h-10 bg-teal-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white animate-bounce" style={{ animationDelay: '0.5s' }}>
            <MapPin size={24} />
         </div>

         {/* Bottom List Toggle */}
         <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
            <div className="flex justify-center">
               <div className="w-12 h-1.5 bg-slate-400/50 rounded-full mb-4" />
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
               {nearbyDoctors.map((doc) => (
                 <motion.div 
                  key={doc.id}
                  whileHover={{ y: -5 }}
                  className="min-w-[280px]"
                 >
                   <Card className="p-5 bg-white rounded-[32px] shadow-2xl border-none">
                      <div className="flex items-center space-x-4 mb-4">
                         <img src={doc.avatar} className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm" />
                         <div>
                            <h4 className="font-black text-[#002D5E] text-base leading-tight">{doc.name}</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{doc.clinicName}</p>
                            <div className="flex items-center space-x-1 mt-1 text-teal-500">
                               <Star size={12} fill="currentColor" />
                               <span className="text-xs font-black">{doc.rating?.toFixed(1)}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex space-x-2">
                         <Button className="flex-1 h-12 rounded-xl bg-teal-50 text-teal-600 border-none font-black text-xs space-x-2">
                            <Navigation size={14} />
                            <span>Navigate</span>
                         </Button>
                         <Button className="flex-1 h-12 rounded-xl bg-blue-50 text-blue-600 border-none font-black text-xs space-x-2" onClick={() => navigate(`/patient/doctor/${doc.id}`)}>
                            <Calendar size={14} />
                            <span>Book</span>
                         </Button>
                      </div>
                   </Card>
                 </motion.div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

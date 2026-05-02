import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Star, 
  MessageCircle, 
  Calendar, 
  Heart,
  ShieldCheck,
  Award,
  Stethoscope,
  Briefcase,
  MapPin,
  Clock,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useData } from '../../context/DataContext';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctors } = useData();
  
  const doctor = doctors.find(d => d.id === id) || doctors[0];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F1F9FE]">
      {/* Hero Banner */}
      <div className="h-72 app-gradient relative safe-top">
         <div className="absolute inset-0 bg-black/10" />
         <button 
           onClick={() => navigate(-1)}
           className="absolute top-12 left-6 p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30"
         >
           <ChevronLeft size={24} />
         </button>
         <button className="absolute top-12 right-6 p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30">
           <Heart size={24} />
         </button>

         {/* Doctor Avatar Card */}
         <div className="absolute -bottom-16 left-6 right-6">
            <Card className="p-6 bg-white rounded-[40px] shadow-2xl border-none flex flex-col items-center text-center space-y-4">
               <div className="w-32 h-32 rounded-[36px] bg-slate-50 border-4 border-white shadow-xl overflow-hidden -mt-20">
                  <img src={doctor.avatar} className="w-full h-full object-cover" />
               </div>
               <div className="space-y-1">
                  <h2 className="text-2xl font-black text-[#002D5E] tracking-tight">{doctor.name}</h2>
                  <p className="text-sm font-bold text-teal-500 uppercase tracking-widest">{doctor.specialization}</p>
               </div>
               <div className="flex items-center space-x-12 pt-2">
                  <div className="text-center">
                     <p className="text-xl font-black text-[#002D5E]">{doctor.experience}Y</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                  </div>
                  <div className="w-[1px] h-10 bg-slate-100" />
                  <div className="text-center">
                     <div className="flex items-center justify-center space-x-1 text-orange-400">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xl font-black">{doctor.rating?.toFixed(1)}</span>
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doctor.reviewsCount}+ Reviews</p>
                  </div>
               </div>
            </Card>
         </div>
      </div>

      <div className="pt-24 p-6 space-y-8">
        {/* Hospital Affiliation */}
        <section className="space-y-4">
           <div className="flex items-center space-x-2 px-1">
             <MapPin className="text-blue-500" size={18} />
             <h3 className="font-display font-black text-lg text-slate-800">Clinic Name</h3>
           </div>
           <Card className="p-6 bg-white border-blue-50 rounded-[32px] flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                    <Stethoscope size={24} />
                 </div>
                 <div>
                    <h4 className="font-black text-slate-800">{doctor.clinicName}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coimbatore, TN, India</p>
                 </div>
              </div>
              <ChevronRight className="text-slate-200" />
           </Card>
        </section>

        {/* Bio */}
        <section className="space-y-4">
           <h3 className="font-display font-black text-lg text-slate-800 px-1">Biography</h3>
           <p className="text-sm font-bold text-slate-500 leading-relaxed px-1">
              {doctor.bio || "Senior dental professional with over a decade of experience in providing comprehensive oral healthcare. Specializing in minimally invasive procedures and patient-centered treatment planning."}
           </p>
        </section>

        {/* Availability */}
        <section className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <h3 className="font-display font-black text-lg text-slate-800">Available Slots</h3>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest tracking-[0.2em]">Next: Today</span>
           </div>
           <div className="grid grid-cols-3 gap-3">
              {doctor.availableSlots?.map(slot => (
                <div key={slot} className="bg-white border border-blue-50 p-3 rounded-2xl text-center shadow-sm">
                   <Clock className="mx-auto mb-1 text-slate-300" size={14} />
                   <span className="text-[10px] font-black text-[#002D5E]">{slot}</span>
                </div>
              ))}
           </div>
        </section>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
           <Button 
            onClick={() => navigate(`/patient/chat?doctorId=${doctor.id}`)}
            className="h-16 rounded-[28px] bg-white text-teal-600 border border-teal-100 shadow-xl shadow-teal-500/5 font-black flex items-center justify-center space-x-2"
           >
              <MessageCircle size={20} />
              <span>Chat</span>
           </Button>
           <Button 
            onClick={() => navigate(`/patient/book?doctorId=${doctor.id}`)}
            className="h-16 rounded-[28px] teal-gradient text-white shadow-xl shadow-teal-500/20 font-black flex items-center justify-center space-x-2"
           >
              <Calendar size={20} />
              <span>Book Now</span>
           </Button>
        </div>
      </div>
    </div>
  );
}

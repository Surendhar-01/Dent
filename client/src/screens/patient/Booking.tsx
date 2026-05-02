import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Upload, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Stethoscope,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { AppointmentType } from '../../types';

export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId') || 'doctor-1';
  
  const { doctors, addAppointment } = useData();
  const { user } = useAuth();
  const doctor = doctors.find(d => d.id === doctorId) || doctors[0];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || 25,
    gender: 'Male',
    mobile: '9876543210',
    type: 'Consultation' as AppointmentType,
    date: '2026-05-15',
    slot: '',
    toothpaste: 'Colgate Active',
    brushType: 'Medium',
    notes: '',
    image: null as string | null
  });

  const slots = doctor.availableSlots || [];
  const nextDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      full: d.toISOString().split('T')[0]
    };
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleFinish = () => {
    if (!user) return;
    addAppointment({
      patientId: user.id,
      doctorId: doctor.id,
      date: formData.date,
      timeSlot: formData.slot,
      status: 'pending',
      type: formData.type,
      patientDetails: {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        mobile: formData.mobile
      },
      oralDetails: {
        toothpaste: formData.toothpaste,
        brushType: formData.brushType
      },
      notes: formData.notes,
      referralImage: formData.image || undefined
    });
    setStep(5); // Success step
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F1F9FE]">
      {/* Header */}
      <header className="px-6 py-8 bg-white/50 backdrop-blur-md flex items-center space-x-4 border-b border-blue-50/50 safe-top">
        <button onClick={() => step > 1 && step < 5 ? handleBack() : navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={24} className="text-[#002D5E]" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-black text-[#002D5E] tracking-tight">
            {step === 5 ? 'Booking Confirmed' : 'Book Appointment'}
          </h1>
          {step < 5 && (
            <div className="flex space-x-1 mt-1.5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={cn("h-1 rounded-full transition-all duration-300", i <= step ? "w-6 bg-teal-500" : "w-3 bg-slate-200")} />
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-black text-slate-800">Appointment Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Consultation', 'Checkup', 'Cleaning', 'Root Canal Review'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setFormData(prev => ({ ...prev, type: t as any }))}
                    className={cn(
                      "p-4 rounded-2xl border text-sm font-black transition-all",
                      formData.type === t ? "bg-teal-500 text-white border-teal-500 shadow-lg shadow-teal-500/20" : "bg-white border-slate-100 text-slate-600"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <h3 className="text-lg font-black text-slate-800 mt-8">Patient Details</h3>
              <div className="space-y-4">
                 <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 font-bold text-slate-700 focus:ring-2 focus:ring-teal-500/20 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Age</label>
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={e => setFormData(p => ({ ...p, age: parseInt(e.target.value) }))}
                      className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-4 font-bold text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                    <select 
                      value={formData.gender}
                      onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))}
                      className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-4 font-bold text-slate-700 outline-none"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="tel" 
                      value={formData.mobile}
                      onChange={e => setFormData(p => ({ ...p, mobile: e.target.value }))}
                      className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 font-bold text-slate-700"
                    />
                  </div>
                </div>
              </div>
              <Button onClick={handleNext} className="w-full h-16 rounded-3xl app-gradient text-white font-black text-lg shadow-xl">
                Continue to Dates
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h3 className="text-lg font-black text-slate-800">Select Date</h3>
              <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
                {nextDates.map((d) => (
                  <button 
                    key={d.full}
                    onClick={() => setFormData(p => ({ ...p, date: d.full }))}
                    className={cn(
                      "min-w-[70px] h-24 rounded-3xl flex flex-col items-center justify-center space-y-1 shadow-sm transition-all border",
                      formData.date === d.full ? "teal-gradient text-white border-transparent" : "bg-white text-slate-500 border-slate-100"
                    )}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{d.day}</span>
                    <span className="text-xl font-black">{d.date}</span>
                  </button>
                ))}
              </div>

              <h3 className="text-lg font-black text-slate-800">Available Slots</h3>
              <div className="grid grid-cols-3 gap-3">
                {slots.map((s) => (
                  <button 
                    key={s}
                    onClick={() => setFormData(p => ({ ...p, slot: s }))}
                    className={cn(
                      "h-14 rounded-2xl border font-black text-xs transition-all",
                      formData.slot === s ? "bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/10" : "bg-white border-slate-100 text-slate-600"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="pt-8 space-y-4">
                 <Card className="p-4 bg-blue-50/50 border-blue-100/50 flex space-x-3 items-start rounded-2xl">
                    <Info className="text-blue-500 shrink-0" size={18} />
                    <p className="text-[11px] font-bold text-blue-600 leading-relaxed">Sundars and Holidays are disabled for bookings. Please select an alternate date if needed.</p>
                 </Card>
                 <Button disabled={!formData.slot} onClick={handleNext} className="w-full h-16 rounded-3xl app-gradient text-white font-black text-lg shadow-xl flex items-center justify-center space-x-2">
                  <span>Oral Care Details</span>
                  <ArrowRight size={20} />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h3 className="text-lg font-black text-slate-800">Oral Care Habits</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Toothpaste Used</label>
                  <input 
                    type="text" 
                    value={formData.toothpaste}
                    onChange={e => setFormData(p => ({ ...p, toothpaste: e.target.value }))}
                    className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-4 font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Brush Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Soft', 'Medium', 'Hard', 'Electric'].map((b) => (
                      <button 
                        key={b}
                        onClick={() => setFormData(p => ({ ...p, brushType: b }))}
                        className={cn(
                          "h-14 rounded-2xl border font-black text-xs transition-all",
                          formData.brushType === b ? "bg-teal-500 text-white border-teal-500" : "bg-white border-slate-100 text-slate-600"
                        )}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Problem Description (Optional)</label>
                  <textarea 
                    value={formData.notes}
                    onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                    className="w-full h-32 bg-white border border-slate-100 rounded-2xl p-4 font-bold text-slate-700 resize-none outline-none"
                    placeholder="Describe your pain or dental issue..."
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-800">Referral Photo (Optional)</h4>
                  <div className="h-40 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center space-y-2 text-slate-400 hover:bg-white hover:border-teal-500 transition-all cursor-pointer overflow-hidden p-2 relative">
                    {formData.image ? (
                        <>
                          <img src={formData.image} className="w-full h-full object-cover rounded-2xl" />
                          <button onClick={() => setFormData(p => ({...p, image: null}))} className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white"><ChevronLeft size={16}/></button>
                        </>
                    ) : (
                      <>
                        <Upload size={32} />
                        <span className="text-xs font-bold">Upload image for reference</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Button onClick={handleNext} className="w-full h-16 rounded-3xl app-gradient text-white font-black text-lg shadow-xl">
                Review Booking
              </Button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h3 className="text-lg font-black text-slate-800 text-center">Confirm Detail</h3>
              <Card className="p-6 bg-white border-slate-100 rounded-[32px] space-y-6">
                <div className="flex items-center space-x-4 border-b border-slate-50 pb-6">
                  <img src={doctor.avatar} className="w-16 h-16 rounded-2xl object-cover bg-slate-50 shadow-sm" />
                  <div>
                    <h4 className="font-black text-slate-800">{doctor.name}</h4>
                    <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">{doctor.specialization}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <CalendarIcon size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Date</span>
                    </div>
                    <span className="text-sm font-black text-slate-800">{formData.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Clock size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Time Slot</span>
                    </div>
                    <span className="text-sm font-black text-slate-800">{formData.slot}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Stethoscope size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Service</span>
                    </div>
                    <span className="text-sm font-black text-teal-600">{formData.type}</span>
                  </div>
                </div>

                <div className="pt-2">
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex space-x-3">
                         <AlertCircle className="text-orange-500 shrink-0" size={18} />
                         <p className="text-[10px] text-orange-700 font-bold leading-relaxed">By finalizing, you agree to our 24-hour cancellation policy. Changes must be made a day before visit.</p>
                    </div>
                </div>
              </Card>

              <div className="pt-8">
                <Button onClick={handleFinish} className="w-full h-16 rounded-3xl app-gradient text-white font-black text-lg shadow-xl flex items-center justify-center space-x-2">
                  <Sparkles size={20} />
                  <span>Finalize Booking</span>
                </Button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center h-[60vh] space-y-8 text-center"
            >
              <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center text-green-500 relative shadow-inner">
                <CheckCircle2 size={64} />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg"
                >
                  <Sparkles className="text-teal-500" size={24} />
                </motion.div>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-[#002D5E] tracking-tighter">Awesome!</h2>
                <p className="text-slate-500 font-bold max-w-[280px]">Your appointment request has been sent successfully to {doctor.name}.</p>
              </div>
              <Button onClick={() => navigate('/patient')} className="px-10 h-14 rounded-2xl bg-slate-900 text-white font-black">
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const AlertCircle = ({ className, size }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

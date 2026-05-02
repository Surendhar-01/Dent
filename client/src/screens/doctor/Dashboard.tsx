import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Bell, 
  ChevronDown, 
  LogOut, 
  Users, 
  ClipboardCheck, 
  Calendar, 
  IndianRupee,
  ChevronRight,
  Clock,
  Heart,
  FileSpreadsheet,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/Logo';
import { ShareQRCode } from '../../components/ShareQRCode';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const { doctors, appointments, scans, exportToExcel } = useData();
  const [selectedDoctorId, setSelectedDoctorId] = useState(user?.id || doctors[0].id);
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const currentDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];
  const doctorAppointments = appointments.filter(a => a.doctorId === selectedDoctorId);
  const pendingScans = scans.filter(s => s.severity === 'high');

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setIsDropdownOpen(false);
  };

  const handleExportToday = () => {
    const today = new Date().toISOString().split('T')[0];
    const data = doctorAppointments.filter(a => a.date === today).map(app => ({
      Time: app.timeSlot,
      PatientID: app.patientId,
      Type: app.type,
      Status: app.status,
      Notes: app.notes || ''
    }));
    exportToExcel(data, `Doctor_Schedule_${today}`);
  };

  const stats = [
    { label: 'Patients', value: '42', trend: '+12% vs last month', icon: Users, color: 'bg-[#6366f1]', gradient: 'from-[#6366f1] to-[#a855f7]' },
    { label: 'Review Queue', value: pendingScans.length.toString(), trend: pendingScans.length > 0 ? 'Urgent scans' : 'All clear', icon: ClipboardCheck, color: 'bg-[#f43f5e]', gradient: 'from-[#f43f5e] to-[#fb7185]' },
    { label: 'Appointments', value: doctorAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length.toString(), trend: 'Today', icon: Calendar, color: 'bg-[#0ea5e9]', gradient: 'from-[#0ea5e9] to-[#38bdf8]' },
    { label: 'Revenue', value: '₹14,500', trend: 'Est. Earnings', icon: IndianRupee, color: 'bg-[#10b981]', gradient: 'from-[#10b981] to-[#34d399]' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F1F9FE]">
      {/* Header with Switcher */}
      <header className="px-6 py-6 bg-white/50 backdrop-blur-md sticky top-0 z-30 shadow-sm border-b border-blue-50/50 flex items-center justify-between safe-top">
        <div className="flex items-center gap-3 relative">
          <Logo size="md" showText={false} />
          <div className="flex flex-col">
            <div 
              className="flex items-center space-x-2 group cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <h1 className="text-xl font-display font-black text-[#002D5E] tracking-tighter">{currentDoctor.name}</h1>
              <ChevronDown 
                size={18} 
                className={cn("text-[#00A3FF] transition-transform duration-300", isDropdownOpen && "rotate-180")} 
              />
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Dashboard Overview</p>
          </div>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-blue-50 p-2 z-[100] max-h-96 overflow-y-auto border-4 border-white"
              >
                {doctors.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleDoctorSelect(doc.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-2xl flex items-center space-x-3 transition-all",
                      selectedDoctorId === doc.id ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50 text-slate-600"
                    )}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs truncate">{doc.name}</p>
                      <p className="text-[10px] opacity-60 truncate">{doc.specialization}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsShareOpen(true)}
            title="Share App"
            aria-label="Share App"
            className="p-2.5 bg-white rounded-full shadow-md text-blue-500 hover:bg-blue-50 transition-colors"
          >
            <QrCode size={20} />
          </button>
          <div className="w-12 h-12 bg-white rounded-2xl shadow-lg border-2 border-white overflow-hidden">
            <img src={currentDoctor.avatar} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <button onClick={logout} title="Logout" aria-label="Logout" className="p-2.5 bg-white rounded-full shadow-md text-slate-400">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className={cn(
              "p-6 text-white border-none shadow-xl relative overflow-hidden h-44 flex flex-col justify-between rounded-[32px] bg-gradient-to-br",
              stat.gradient
            )}>
              <stat.icon className="absolute top-4 right-4 text-white/20 w-16 h-16 -rotate-12" strokeWidth={1.5} />
              <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{stat.label}</p>
                <p className="text-4xl font-black tracking-tighter">{stat.label === 'Revenue' ? stat.value : stat.value}</p>
              </div>
              <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest relative z-10">
                {stat.trend}
              </div>
            </Card>
          ))}
        </div>

        {/* Clinical Priority Queue */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display font-black text-lg text-[#002D5E]">Clinical Priority Queue</h3>
            <div className="bg-blue-50 text-blue-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {pendingScans.length} Pending
            </div>
          </div>
          
          <Card className="p-10 border-slate-100/50 bg-white/80 backdrop-blur-sm rounded-[40px] flex flex-col items-center justify-center text-center space-y-4">
            {pendingScans.length > 0 ? (
              <div className="w-full space-y-4">
                {pendingScans.map(scan => (
                  <div key={scan.id} className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white animate-pulse">
                        <Heart size={18} fill="currentColor" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-slate-800">Critical Infection</p>
                        <p className="text-[10px] font-bold text-red-400 uppercase">Patient ID: {scan.patientId.slice(-5)}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-red-300" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center text-teal-500 shadow-inner">
                  <ClipboardCheck size={36} />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-slate-800">All scans have been reviewed</p>
                  <p className="text-sm text-slate-400 font-medium">No urgent clinical priorities</p>
                </div>
              </>
            )}
          </Card>
        </section>

        {/* Today's Schedule */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display font-black text-lg text-[#002D5E]">Today's Schedule</h3>
            {doctorAppointments.length > 0 && (
              <button 
                onClick={handleExportToday}
                className="flex items-center space-x-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full"
              >
                <FileSpreadsheet size={14} />
                <span>Export XLSX</span>
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {doctorAppointments.length > 0 ? (
              doctorAppointments.map(app => (
                <Card key={app.id} className="p-5 flex items-center justify-between border-blue-50/50 bg-white/80 backdrop-blur-sm rounded-[32px]">
                   <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-blue-500 shadow-inner">
                      <Clock size={20} />
                      <span className="text-[10px] font-black uppercase mt-0.5">{app.timeSlot.split(' ')[0]}</span>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800">Patient #{app.patientId.slice(-4)}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                          app.status === 'approved' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                        )}>{app.status}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{app.type}</span>
                      </div>
                    </div>
                   </div>
                   <ChevronRight size={20} className="text-slate-300" />
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-white/40 border-2 border-dashed border-white rounded-[40px] text-slate-400 font-bold text-sm">
                No appointments for today
              </div>
            )}
          </div>
        </section>
      </div>

      <ShareQRCode 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        title="Patient Mobile Hub"
      />
    </div>
  );
}

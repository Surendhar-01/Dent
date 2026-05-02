import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle,
  Filter,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { cn } from '../../lib/utils';
import { AppointmentStatus } from '../../types';

export default function DoctorVisits() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appointments, updateAppointmentStatus, patients } = useData();
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const doctorAppointments = appointments.filter(a => a.doctorId === user?.id);
  
  const filteredAppointments = doctorAppointments.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const patient = patients.find(p => p.id === app.patientId);
    const matchesSearch = !searchTerm || (patient?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || 'Unknown Patient';

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 space-y-6 safe-top">
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-2">
                <ChevronLeft size={24} />
             </Button>
             <h2 className="text-2xl font-display font-bold text-[#002D5E] tracking-tight">Visit Schedule</h2>
          </div>
        </header>

        <div className="flex flex-col space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patients..."
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {(['all', 'pending', 'approved', 'completed', 'cancelled'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all",
                  filter === s 
                    ? "bg-[#002D5E] text-white shadow-lg shadow-blue-900/20" 
                    : "bg-white text-slate-500 border border-slate-200"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((app) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="p-4 border-l-4 border-l-teal-500">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <User size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#002D5E]">{getPatientName(app.patientId)}</h4>
                          <p className="text-xs text-slate-500 font-medium">{app.type}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        app.status === 'approved' ? "bg-emerald-100 text-emerald-700" :
                        app.status === 'pending' ? "bg-amber-100 text-amber-700" :
                        "bg-slate-100 text-slate-700"
                      )}>
                        {app.status}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-4 text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <CalendarIcon size={14} />
                        <span className="text-xs font-bold">{app.date}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Clock size={14} />
                        <span className="text-xs font-bold">{app.timeSlot}</span>
                      </div>
                    </div>

                    {app.status === 'pending' && (
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center space-x-2">
                        <Button 
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-2 space-x-2"
                          onClick={() => updateAppointmentStatus(app.id, 'approved')}
                        >
                          <CheckCircle2 size={16} />
                          <span className="text-xs font-bold uppercase tracking-widest">Approve</span>
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 text-rose-500 border-rose-100 hover:bg-rose-50 rounded-xl py-2 space-x-2"
                          onClick={() => updateAppointmentStatus(app.id, 'cancelled')}
                        >
                          <XCircle size={16} />
                          <span className="text-xs font-bold uppercase tracking-widest">Reject</span>
                        </Button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
                  <CalendarIcon size={32} className="text-slate-400" />
                </div>
                <p className="text-slate-400 font-bold tracking-tight">No visits found</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

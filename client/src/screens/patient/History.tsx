import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Download, 
  FileSpreadsheet,
  ClipboardList, 
  Calendar, 
  Microscope,
  Clock,
  ChevronRight,
  Stethoscope,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

type Tab = 'Medical' | 'Visits' | 'Timeline';

export default function HistoryScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appointments, scans, doctors, exportToExcel } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('Medical');

  const patientAppointments = appointments.filter(a => a.patientId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const patientScans = scans.filter(s => s.patientId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const timelineItems = [
    ...patientAppointments.map(a => ({ type: 'appointment', date: a.date, data: a })),
    ...patientScans.map(s => ({ type: 'scan', date: s.date, data: s }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDownloadReport = () => {
    alert("Preparing your full medical report (PDF). This may take a moment...");
  };

  const handleExportExcel = () => {
    const historyData = timelineItems.map(item => ({
      Date: item.date,
      Type: item.type === 'appointment' ? 'Appointment' : 'AI Scan',
      Description: item.type === 'appointment' 
        ? `Visit with Dr. ${(doctors.find(d => d.id === (item.data as any).doctorId)?.name || 'Unknown Doctor')}` 
        : (item.data as any).result,
      Status: item.type === 'appointment' ? (item.data as any).status : (item.data as any).severity
    }));
    exportToExcel(historyData, `Dental_History_${user?.name.replace(/ /g, '_')}`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F1F9FE]">
      {/* Header */}
      <header className="px-6 py-8 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm border-b border-blue-50/50 safe-top">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2">
              <ChevronLeft size={24} className="text-[#002D5E]" />
            </button>
            <h1 className="text-2xl font-display font-black text-[#002D5E] tracking-tight">Medical History</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleExportExcel}
              className="p-3 bg-white rounded-2xl shadow-md text-emerald-500 hover:bg-emerald-50 transition-colors"
              title="Export to Excel"
            >
              <FileSpreadsheet size={20} />
            </button>
            <button 
              onClick={handleDownloadReport}
              className="p-3 bg-white rounded-2xl shadow-md text-teal-500 hover:bg-teal-50 transition-colors"
              title="Download PDF report"
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100/50 p-1 rounded-2xl">
          {(['Medical', 'Visits', 'Timeline'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'Medical' && (
            <motion.div 
              key="medical"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {patientScans.length > 0 ? (
                patientScans.map((scan) => (
                  <Card key={scan.id} className="p-5 space-y-4 border-blue-50/50 bg-white/80 backdrop-blur-sm rounded-[32px] shadow-xl shadow-blue-500/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                          <Microscope size={20} />
                        </div>
                        <h4 className="font-black text-slate-800">Infection Scan</h4>
                      </div>
                      <span className="text-[10px] font-black text-slate-400">{scan.date}</span>
                    </div>
                    <div className="relative h-40 rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                      <img src={scan.imageUrl} className="w-full h-full object-cover" />
                      <div className={cn(
                        "absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black text-white shadow-xl backdrop-blur-md",
                        scan.severity === 'High Priority' ? "bg-red-500" : "bg-teal-500"
                      )}>
                        {scan.severity}
                      </div>
                    </div>
                    <div className="space-y-2">
                       <p className="font-black text-sm text-slate-800">{scan.result}</p>
                       <div className="flex flex-wrap gap-2">
                          {scan.suggestions.map((s, i) => (
                             <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-500 px-2 py-1 rounded-lg">{s}</span>
                          ))}
                       </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20 bg-white/40 border-2 border-dashed border-white rounded-[40px] text-slate-400 font-bold">No scan history recorded</div>
              )}
            </motion.div>
          )}

          {activeTab === 'Visits' && (
            <motion.div 
              key="visits"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {patientAppointments.map((app) => {
                const doctor = doctors.find(d => d.id === app.doctorId);
                return (
                  <Card key={app.id} className="p-5 flex items-center justify-between border-slate-100/50 bg-white/80 backdrop-blur-sm rounded-[32px]">
                    <div className="flex items-center space-x-4 text-left">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl overflow-hidden border border-white shadow-sm shrink-0">
                        <img src={doctor?.avatar} alt="doc" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-sm leading-tight">{doctor?.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar size={12} className="text-blue-500" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.date}</span>
                        </div>
                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mt-0.5">{app.type}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                       <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                        app.status === 'approved' ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                       )}>{app.status}</span>
                       <ChevronRight size={18} className="text-slate-200" />
                    </div>
                  </Card>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'Timeline' && (
            <motion.div 
              key="timeline"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 relative pl-6"
            >
               <div className="absolute left-6 top-4 bottom-4 w-1 bg-blue-100 rounded-full" />
               {timelineItems.map((item, i) => (
                 <div key={i} className="relative pl-10 pb-8 last:pb-2">
                    <div className="absolute left-[-5px] top-1 w-4 h-4 bg-white border-4 border-blue-500 rounded-full shadow-sm z-10" />
                    <div className="space-y-3">
                       <span className="text-[11px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{item.date}</span>
                       <Card className="p-4 bg-white border-blue-50 rounded-2xl shadow-sm">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                                {item.type === 'appointment' ? <Clock size={16} className="text-blue-500" /> : <Microscope size={16} className="text-teal-500" />}
                                <h5 className="font-black text-slate-800 text-sm">
                                   {item.type === 'appointment' ? `Visit with ${(item.data as any).doctorId}` : `Infection Scan Result`}
                                </h5>
                             </div>
                             <ChevronRight size={16} className="text-slate-200" />
                          </div>
                       </Card>
                    </div>
                 </div>
               ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

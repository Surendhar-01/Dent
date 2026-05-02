import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, GlassCard } from '../../components/Card';
import { Button } from '../../components/Button';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  Phone, 
  MessageSquare,
  MoreVertical,
  Activity,
  FileSpreadsheet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';

export default function Patients() {
  const [search, setSearch] = useState('');
  const { patients, orthoProgress, appointments, exportToExcel } = useData();
  const navigate = useNavigate();

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportPatients = () => {
    const data = filteredPatients.map(p => ({
      ID: p.id,
      Name: p.name,
      Age: p.age,
      BloodGroup: p.bloodGroup,
      Email: p.email,
      NextAppointment: appointments.find(a => a.patientId === p.id && a.status === 'approved')?.date || 'None'
    }));
    exportToExcel(data, `Patient_Directory_${new Date().toISOString().split('T')[0]}`);
  };

  const getProgress = (id: string) => orthoProgress.find(p => p.patientId === id);
  const getNextAppointment = (id: string) => appointments.find(a => a.patientId === id && a.status === 'approved');

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 space-y-8 safe-top">
        <header className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-[#002D5E] tracking-tight">Patient Directory</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center space-x-2 bg-emerald-50 text-emerald-600 border-emerald-100"
            onClick={handleExportPatients}
          >
            <FileSpreadsheet size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Export</span>
          </Button>
          <Button variant="outline" size="icon"><Filter size={18} /></Button>
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <Input 
          placeholder="Search patient name, ID..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-14 rounded-2xl"
        />
      </div>

      <div className="space-y-4">
        {filteredPatients.map((p) => {
          const progress = getProgress(p.id);
          const next = getNextAppointment(p.id);

          return (
            <div key={p.id}>
              <Card className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={p.avatar} alt="avatar" className="w-14 h-14 rounded-2xl object-cover" />
                    <div>
                      <h3 className="font-bold text-white">{p.name}</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{p.id} • {p.age} Yrs • {p.bloodGroup}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon"><MoreVertical size={18} className="text-slate-600" /></Button>
                </div>

                {progress && (
                  <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity size={14} className="text-brand-orange" />
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Ortho Progress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-orange" style={{ width: `${(progress.stage / progress.totalStages) * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-brand-orange uppercase">Stage {progress.stage}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" className="w-full flex space-x-2" onClick={() => navigate('/doctor/chat')}>
                    <MessageSquare size={16} />
                    <span className="text-xs">Chat</span>
                  </Button>
                  <Button variant="outline" className="w-full flex space-x-2">
                    <Phone size={16} />
                    <span className="text-xs">Call</span>
                  </Button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

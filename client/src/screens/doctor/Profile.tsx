import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { 
  User as UserIcon, 
  Settings, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-8 safe-top">
        <header className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">Account</h2>
        <Button variant="ghost" size="icon"><Settings size={20} /></Button>
      </header>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <img src={user.avatar} className="w-32 h-32 rounded-[40px] object-cover border-4 border-brand-orange/20 p-1" />
          <div className="absolute -bottom-2 -right-2 bg-brand-orange p-2 rounded-2xl shadow-xl">
            <Sparkles size={20} className="text-white" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-bold text-white tracking-tight">{user.name}</h3>
          <p className="text-slate-500 font-medium text-sm">{user.role === 'doctor' ? user.specialization : `Patient ID: ${user.id}`}</p>
        </div>
      </div>

      <div className="space-y-3">
        <Card className="p-1 border-none bg-white/5">
          <div className="divide-y divide-white/5">
            <button className="w-full p-4 flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-brand-orange">
                  <UserIcon size={20} />
                </div>
                <span className="font-bold text-slate-200">Personal Info</span>
              </div>
              <ChevronRight size={18} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
            </button>
            <button className="w-full p-4 flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Shield size={20} />
                </div>
                <span className="font-bold text-slate-200">Privacy & Security</span>
              </div>
              <ChevronRight size={18} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
            </button>
            <button className="w-full p-4 flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                  <HelpCircle size={20} />
                </div>
                <span className="font-bold text-slate-200">Support Center</span>
              </div>
              <ChevronRight size={18} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
            </button>
          </div>
        </Card>

        <Button 
          variant="danger" 
          className="w-full h-14 justify-start space-x-3 px-6 rounded-2xl bg-red-500/10 hover:bg-red-500/20"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span className="font-bold">Sign Out</span>
        </Button>
      </div>

      <div className="text-center opacity-30 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Alpha Dent Mobile • v1.0.0 (BETA)</p>
      </div>
      </div>
    </div>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  History, 
  MapPin, 
  Users, 
  Calendar, 
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const BottomTabs = () => {
  const { user } = useAuth();
  if (!user) return null;

  const doctorTabs = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor' },
    { icon: Users, label: 'Patients', path: '/doctor/patients' },
    { icon: MessageSquare, label: 'Messages', path: '/doctor/messages' },
    { icon: Calendar, label: 'Visits', path: '/doctor/visits' },
  ];

  const patientTabs = [
    { icon: LayoutDashboard, label: 'Home', path: '/patient' },
    { icon: Sparkles, label: 'Scan', path: '/patient/ai' },
    { icon: MessageSquare, label: 'Chat', path: '/patient/chat' },
    { icon: History, label: 'History', path: '/patient/history' },
    { icon: MapPin, label: 'Nearby', path: '/patient/nearby' },
  ];

  const tabs = user.role === 'doctor' ? doctorTabs : patientTabs;

  return (
    <nav className="h-20 bg-white/95 backdrop-blur-md border-t border-blue-50/50 px-6 safe-bottom shadow-[0_-8px_30px_rgb(0,0,0,0.04)] shrink-0">
      <div className="flex items-center justify-between h-full max-w-lg mx-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/doctor' || tab.path === '/patient'}
            className={({ isActive }) => cn(
              'flex flex-col items-center justify-center space-y-1 transition-all min-w-[60px]',
              isActive ? 'text-teal-500' : 'text-slate-400'
            )}
          >
            {({ isActive }) => (
              <>
                <motion.div 
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'p-1.5 rounded-xl transition-all',
                    isActive && 'bg-teal-50'
                  )}
                >
                  <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

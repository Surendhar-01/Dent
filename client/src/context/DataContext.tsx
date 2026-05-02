import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  User, 
  Appointment, 
  Message, 
  InfectionScan, 
  OrthoProgress, 
  Notification,
  KidsBrushingLog,
  AppointmentStatus 
} from '../types';

interface DataContextType {
  doctors: User[];
  patients: User[];
  appointments: Appointment[];
  messages: Message[];
  scans: InfectionScan[];
  orthoProgress: OrthoProgress[];
  notifications: Notification[];
  brushingLogs: KidsBrushingLog[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus, cancellationReason?: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'status'>) => void;
  addAIAnalysis: (scan: Omit<InfectionScan, 'id' | 'date'>) => void;
  markNotificationsRead: (userId: string) => void;
  addBrushingLog: (log: Omit<KidsBrushingLog, 'id'>) => void;
  exportToExcel: (data: any[], fileName: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DOCTOR_SPECIALIZATIONS = [
  'Orthodontist', 'Implantologist', 'Periodontist', 'Cosmetic Dentist', 
  'Pediatric Dentist', 'Endodontist', 'Prosthodontist', 'Oral Surgeon', 
  'General Dentist'
];

const CLINICS = [
  'RootLine Dental', 'Dental Restore Clinic', 'Coimbatore Oral Care', 
  'Elite Clinic', 'Apex Dental Hub', 'Smile Bright Center'
];

// Generate 20 real-feeling doctors
const mockDoctors: User[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `doctor-${i + 1}`,
  email: `doctor${i + 1}@alphadent.demo`,
  name: i === 0 ? 'Dr. Sarah Wilson' : `Dr. ${['Revathi Menon', 'Anitha Lakshmi', 'Karthik Raja', 'Suresh Kumar', 'Meera Nair', 'Arjun Das', 'Priya Mani', 'Vivek G', 'Sneha E', 'Rahul K'][i % 10]} ${i > 9 ? 'II' : ''}`,
  role: 'doctor',
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=doctor-${i}`,
  specialization: DOCTOR_SPECIALIZATIONS[i % DOCTOR_SPECIALIZATIONS.length],
  clinicName: CLINICS[i % CLINICS.length],
  experience: 5 + (i % 15),
  rating: 4.5 + (Math.random() * 0.5),
  reviewsCount: 40 + (i * 12),
  bio: 'Specialist in painless dental procedures and advanced restorative care.',
  availableSlots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM']
}));

// Mock Patients
const mockPatients: User[] = [
  { id: 'patient-1', email: 'patient@alphadent.demo', name: 'John Doe', role: 'patient', age: 28, bloodGroup: 'O+', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
  { id: 'patient-2', email: 'jane@example.com', name: 'Jane Smith', role: 'patient', age: 34, bloodGroup: 'A-', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
  { id: 'patient-3', email: 'mike@example.com', name: 'Mike Johnson', role: 'patient', age: 45, bloodGroup: 'B+', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [doctors] = useState<User[]>(mockDoctors);
  const [patients] = useState<User[]>(mockPatients);
  
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('alpha_appointments');
    let data: Appointment[] = saved ? JSON.parse(saved) : [
      {
        id: 'app-1',
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '10:30 AM',
        status: 'pending',
        type: 'Consultation',
        createdAt: new Date().toISOString()
      },
      {
        id: 'app-2',
        patientId: 'patient-2',
        doctorId: 'doctor-1',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '02:00 PM',
        status: 'approved',
        type: 'Dental Cleaning',
        createdAt: new Date().toISOString()
      },
      {
        id: 'app-3',
        patientId: 'patient-3',
        doctorId: 'doctor-1',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '04:30 PM',
        status: 'pending',
        type: 'Root Canal',
        createdAt: new Date().toISOString()
      },
      {
        id: 'app-4',
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        date: '2026-05-10',
        timeSlot: '11:00 AM',
        status: 'approved',
        type: 'Checkup',
        createdAt: new Date().toISOString()
      }
    ];

    // Simple ID migration for legacy demo data
    return data.map(app => ({
      ...app,
      doctorId: app.doctorId === 'd1' ? 'doctor-1' : app.doctorId,
      patientId: app.patientId === 'p1' ? 'patient-1' : app.patientId
    }));
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('alpha_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [scans, setScans] = useState<InfectionScan[]>(() => {
    const saved = localStorage.getItem('alpha_scans');
    return saved ? JSON.parse(saved) : [];
  });

  const [orthoProgress] = useState<OrthoProgress[]>([
    {
      id: 'ortho-1',
      patientId: 'patient-1',
      stage: 12,
      totalStages: 24,
      lastAdjustment: '2024-04-15',
      nextAdjustment: '2024-05-15',
      complianceScore: 94,
      history: [
        { week: 11, imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=200', match: 92, feedback: 'Great progress. Keep wearing your aligners 22h/day.' },
        { week: 10, imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=200', match: 88, feedback: 'Slight delay in movement. Ensure aligners are seated properly.' }
      ]
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('alpha_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'not-1',
        userId: 'patient-1',
        title: 'Appointment Approved',
        message: 'Your visit with Dr. Sarah Wilson has been confirmed for tomorrow.',
        timestamp: new Date().toISOString(),
        isRead: false,
        category: 'appointment',
        type: 'approved'
      }
    ];
  });

  const [brushingLogs, setBrushingLogs] = useState<KidsBrushingLog[]>(() => {
    const saved = localStorage.getItem('alpha_brushing');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('alpha_appointments', JSON.stringify(appointments));
    localStorage.setItem('alpha_messages', JSON.stringify(messages));
    localStorage.setItem('alpha_scans', JSON.stringify(scans));
    localStorage.setItem('alpha_notifications', JSON.stringify(notifications));
    localStorage.setItem('alpha_brushing', JSON.stringify(brushingLogs));
  }, [appointments, messages, scans, notifications, brushingLogs]);

  const addAppointment = (data: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newApp: Appointment = {
      ...data,
      id: `app-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newApp, ...prev]);
    
    // Auto-notify patient
    const notification: Notification = {
      id: `not-${Date.now()}`,
      userId: data.patientId,
      title: 'Appointment Requested',
      message: `Your booking for ${data.date} is pending approval.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      category: 'appointment',
      type: 'general'
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus, cancellationReason?: string) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status, cancellationReason } : app
    ));
    
    const app = appointments.find(a => a.id === id);
    if (app) {
      const notification: Notification = {
        id: `not-${Date.now()}`,
        userId: app.patientId,
        title: status === 'approved' ? 'Appointment Approved' : 'Appointment Update',
        message: status === 'approved' 
          ? `Your visit for ${app.date} is confirmed.` 
          : `Your appointment status has changed to ${status}.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        category: 'appointment',
        type: status === 'approved' ? 'approved' : status === 'rejected' ? 'cancelled' : 'general'
      };
      setNotifications(prev => [notification, ...prev]);
    }
  };

  const addMessage = (data: Omit<Message, 'id' | 'timestamp' | 'status'>) => {
    const newMessage: Message = {
      ...data,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addAIAnalysis = (data: Omit<InfectionScan, 'id' | 'date'>) => {
    const newScan: InfectionScan = {
      ...data,
      id: `scan-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setScans(prev => [newScan, ...prev]);
  };

  const markNotificationsRead = (userId: string) => {
    setNotifications(prev => prev.map(n => 
      n.userId === userId ? { ...n, isRead: true } : n
    ));
  };

  const addBrushingLog = (data: Omit<KidsBrushingLog, 'id'>) => {
    const newLog: KidsBrushingLog = {
      ...data,
      id: `brush-${Date.now()}`
    };
    setBrushingLogs(prev => [newLog, ...prev]);
  };

  const exportToExcel = (data: any[], fileName: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DataContext.Provider value={{ 
      doctors, 
      patients,
      appointments, 
      messages, 
      scans, 
      orthoProgress,
      notifications,
      brushingLogs,
      addAppointment,
      updateAppointmentStatus,
      addMessage,
      addAIAnalysis,
      markNotificationsRead,
      addBrushingLog,
      exportToExcel
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

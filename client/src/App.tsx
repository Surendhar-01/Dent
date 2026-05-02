import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { BottomTabs } from './components/BottomTabs';
import { AnimatePresence, motion } from 'motion/react';

// Screens
import Login from './screens/auth/Login';
import DoctorDashboard from './screens/doctor/Dashboard';
import DoctorPatients from './screens/doctor/Patients';
import DoctorChat from './screens/doctor/Chat';
import DoctorVisits from './screens/doctor/Visits';
import DoctorAIDetect from './screens/doctor/AIDetect';
import DoctorAccount from './screens/doctor/Profile';

import PatientDashboard from './screens/patient/Dashboard';
import PatientBook from './screens/patient/Booking';
import PatientAI from './screens/patient/AI';
import PatientAIChat from './screens/patient/AIChat';
import PatientChat from './screens/patient/Chat';
import PatientHistory from './screens/patient/History';
import PatientOrtho from './screens/patient/Ortho';
import PatientTeledentistry from './screens/patient/Teledentistry';
import PatientNearby from './screens/patient/Nearby';
import PatientKids from './screens/patient/KidsBrushing';
import DoctorProfile from './screens/patient/DoctorProfile';

const PageTransition = ({ children, locationKey }: { children: React.ReactNode, locationKey: string }) => (
  <motion.div
    key={locationKey}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
    className="flex-1 flex flex-col min-h-0"
  >
    {children}
  </motion.div>
);

const ProtectedLayout = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="h-screen flex items-center justify-center text-blue-500 font-bold bg-[#F1F9FE]">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="h-[100dvh] flex flex-col bg-[#F1F9FE] overflow-hidden">
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition locationKey={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <BottomTabs />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedLayout />}>
              {/* Doctor Routes */}
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/doctor/patients" element={<DoctorPatients />} />
              <Route path="/doctor/messages" element={<DoctorChat />} />
              <Route path="/doctor/visits" element={<DoctorVisits />} />
              <Route path="/doctor/ai" element={<DoctorAIDetect />} />
              <Route path="/doctor/profile" element={<DoctorAccount />} />

              {/* Patient Routes */}
              <Route path="/patient" element={<PatientDashboard />} />
              <Route path="/patient/doctor/:id" element={<DoctorProfile />} />
              <Route path="/patient/book" element={<PatientBook />} />
              <Route path="/patient/ai" element={<PatientAI />} />
              <Route path="/patient/ai-chat" element={<PatientAIChat />} />
              <Route path="/patient/chat" element={<PatientChat />} />
              <Route path="/patient/history" element={<PatientHistory />} />
              <Route path="/patient/ortho" element={<PatientOrtho />} />
              <Route path="/patient/teledentistry" element={<PatientTeledentistry />} />
              <Route path="/patient/nearby" element={<PatientNearby />} />
              <Route path="/patient/kids" element={<PatientKids />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

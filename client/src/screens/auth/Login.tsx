import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { 
  Stethoscope, 
  User as UserIcon, 
  Lock, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft,
  Mail,
  Microscope,
  Pill,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../../components/Logo';
import { cn } from '../../lib/utils';
import { ShareQRCode } from '../../components/ShareQRCode';

type LoginStep = 'role' | 'form';
type AuthMode = 'signin' | 'signup';

export default function Login() {
  const [step, setStep] = useState<LoginStep>('role');
  const [mode, setMode] = useState<AuthMode>('signin');
  const [selectedRole, setSelectedRole] = useState<'doctor' | 'patient'>('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'doctor' | 'patient') => {
    setSelectedRole(role);
    // Reset form and autofill demo if signing in
    if (mode === 'signin') {
      if (role === 'doctor') {
        setEmail('doctor@alphadent.demo');
        setPassword('doctor123');
      } else {
        setEmail('patient@alphadent.demo');
        setPassword('patient123');
      }
    }
    setStep('form');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (mode === 'signin') {
        const success = await login(email, password);
        if (success) {
          navigate(`/${selectedRole}`);
        } else {
          setError('Invalid credentials. Try again.');
        }
      } else {
        if (!name) {
          setError('Please enter your full name.');
          return;
        }
        await register(name, email, password, selectedRole);
        navigate(`/${selectedRole}`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen app-gradient flex flex-col items-center justify-start py-12 p-6 relative overflow-y-auto safe-top safe-bottom">
      {/* Decorative Floating Icons */}
      <motion.div 
        animate={{ y: [0, -10, 0] }} 
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-10 left-10 p-4 bg-white/20 rounded-full backdrop-blur-md"
      >
        <Microscope size={24} className="text-white/60" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-20 right-10 p-5 bg-[#F8C661]/40 rounded-3xl backdrop-blur-md rotate-12"
      >
        <Pill size={32} className="text-orange-900/40" />
      </motion.div>

      {/* Brand */}
      <div className="mb-10 z-10">
        <Logo light size="xl" />
      </div>

      {/* Main Container */}
      <motion.div 
        layout
        className="w-full max-w-md bg-white rounded-[48px] p-8 shadow-2xl shadow-blue-900/20 z-10"
      >
        <AnimatePresence mode="wait">
          {step === 'role' ? (
            <motion.div
              key="role-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">Welcome back!</h2>
                <p className="text-slate-500 font-medium">Please select your role</p>
              </div>

              <div className="space-y-4">
                <div 
                  onClick={() => handleRoleSelect('patient')}
                  className={cn(
                    "flex items-center p-6 bg-white border-2 rounded-[32px] cursor-pointer transition-all hover:shadow-lg",
                    selectedRole === 'patient' ? "border-[#2BCFC4] bg-[#2BCFC4]/5" : "border-slate-100"
                  )}
                >
                  <div className="w-16 h-16 role-card-patient rounded-3xl flex items-center justify-center text-white shadow-lg shrink-0">
                    <UserIcon size={32} />
                  </div>
                  <div className="ml-5 flex-1">
                    <h3 className="font-bold text-slate-800 text-lg">I am a Patient</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">View your dental history, chat with AI, and book appointments.</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shadow-sm shrink-0 ml-2">
                    <ChevronRight size={18} />
                  </div>
                </div>

                <div 
                  onClick={() => handleRoleSelect('doctor')}
                  className={cn(
                    "flex items-center p-6 bg-white border-2 rounded-[32px] cursor-pointer transition-all hover:shadow-lg",
                    selectedRole === 'doctor' ? "border-[#6366f1] bg-[#6366f1]/5" : "border-slate-100"
                  )}
                >
                  <div className="w-16 h-16 role-card-doctor rounded-3xl flex items-center justify-center text-white shadow-lg shrink-0">
                    <Stethoscope size={32} />
                  </div>
                  <div className="ml-5 flex-1">
                    <h3 className="font-bold text-slate-800 text-lg">I am a Doctor</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">Manage your patients, view scans, and track appointments.</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shadow-sm shrink-0 ml-2">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="login-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <button 
                onClick={() => setStep('role')}
                className="flex items-center text-slate-400 font-bold text-sm tracking-wide hover:text-slate-600 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" /> Back
              </button>

              <div className="space-x-1 bg-slate-100 p-1 rounded-[20px] flex">
                <button 
                  onClick={() => setMode('signin')}
                  className={cn(
                    "flex-1 py-3 transition-all rounded-[18px] text-sm font-bold",
                    mode === 'signin' ? "bg-white shadow-sm text-slate-800" : "text-slate-400"
                  )}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setMode('signup')}
                  className={cn(
                    "flex-1 py-3 transition-all rounded-[18px] text-sm font-bold",
                    mode === 'signup' ? "bg-white shadow-sm text-slate-800" : "text-slate-400"
                  )}
                >
                  Sign Up
                </button>
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-800">
                  {mode === 'signin' ? 'Sign in' : 'Create Account'}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  {mode === 'signin' 
                    ? 'Enter your account details to sign in' 
                    : 'Fill in your details to get started'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
                {mode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input 
                        placeholder="John Doe" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-14"
                        required 
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-14"
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-14"
                      required 
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                <Button type="submit" className="w-full h-16 text-lg flex items-center justify-center space-x-2">
                  <span>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</span>
                  <ChevronRight size={20} />
                </Button>
              </form>

              <div className="text-center space-y-4">
                <p className="text-sm text-slate-500 font-medium">
                  {mode === 'signin' ? (
                    <>Don't have an account? <button onClick={() => setMode('signup')} className="text-blue-500 font-bold">Sign up now</button></>
                  ) : (
                    <>Already have an account? <button onClick={() => setMode('signin')} className="text-blue-500 font-bold">Sign in</button></>
                  )}
                </p>
                {mode === 'signin' && (
                  <button 
                    onClick={() => handleRoleSelect(selectedRole)}
                    className="text-xs font-bold text-blue-400/80 underline tracking-wide"
                  >
                    Use demo {selectedRole} credentials
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Share / Mobile Switcher */}
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsShareOpen(true)}
        className="mt-8 flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white/80 transition-all z-10"
      >
        <QrCode size={18} />
        <span className="text-xs font-bold uppercase tracking-widest">Open on Mobile</span>
      </motion.button>

      <ShareQRCode 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
      />
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  Mic,
  Image as ImageIcon,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export default function DirectChat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId') || 'doctor-1';
  
  const { doctors, messages, addMessage } = useData();
  const { user } = useAuth();
  const doctor = doctors.find(d => d.id === doctorId) || doctors[0];

  const chatMessages = messages.filter(m => 
    (m.senderId === user?.id && m.receiverId === doctorId) || 
    (m.senderId === doctorId && m.receiverId === user?.id)
  );

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim() || !user) return;
    
    addMessage({
      senderId: user.id,
      receiverId: doctorId,
      text: input
    });
    
    const sentText = input.toLowerCase();
    setInput('');

    // Doctor Auto-Reply Simulation
    setTimeout(() => {
        let reply = "";
        if (sentText.includes('pain')) reply = "I'm sorry to hear that. On a scale of 1-10, how severe is the pain?";
        else if (sentText.includes('bleed')) reply = "Apply gentle pressure with clean gauze. Are you on any blood thinners?";
        else if (sentText.includes('appointment')) reply = "Please use the 'Book Now' button on my profile to see available slots.";
        else if (sentText.includes('medicine') || sentText.includes('pill')) reply = "Continue your prescribed dosage. If side effects occur, stop and call me.";
        else if (sentText.includes('thank')) reply = "You're very welcome! Let me know if you need anything else.";
        
        if (reply) {
            addMessage({
                senderId: doctorId,
                receiverId: user.id,
                text: reply
            });
        }
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#F1F9FE]">
       {/* Chat Header */}
       <header className="px-6 py-5 bg-white/80 backdrop-blur-md flex items-center justify-between border-b border-blue-50/50 sticky top-0 z-20 safe-top">
          <div className="flex items-center space-x-4">
             <button onClick={() => navigate(-1)} className="p-1">
                <ChevronLeft size={24} className="text-[#002D5E]" />
             </button>
             <div className="flex items-center space-x-3">
                <div className="relative">
                   <img src={doctor.avatar} className="w-12 h-12 rounded-2xl object-cover bg-slate-50 border-2 border-white shadow-sm" />
                   <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                   <h2 className="text-base font-black text-[#002D5E] tracking-tight leading-none mb-1">{doctor.name}</h2>
                   <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Online</span>
                </div>
             </div>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
             <button className="p-2 bg-blue-50 rounded-xl text-blue-500"><Phone size={18} /></button>
             <button className="p-2 bg-blue-50 rounded-xl text-blue-500" onClick={() => navigate('/patient/teledentistry')}><Video size={18} /></button>
          </div>
       </header>

       {/* Messages */}
       <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {chatMessages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full opacity-30 text-center space-y-4">
                <MessageCircle size={64} className="text-blue-500" />
                <p className="text-sm font-black text-[#002D5E] uppercase tracking-widest">Start a conversation</p>
             </div>
          )}
          {chatMessages.map((msg, i) => (
             <motion.div 
               key={msg.id}
               initial={{ opacity: 0, y: 10, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               className={cn(
                  "flex flex-col",
                  msg.senderId === user?.id ? "items-end" : "items-start"
               )}
             >
                <div className={cn(
                   "max-w-[80%] p-4 rounded-3xl text-[13.5px] font-bold leading-relaxed shadow-sm",
                   msg.senderId === user?.id 
                    ? "bg-[#002D5E] text-white rounded-br-none" 
                    : "bg-white text-slate-700 border border-blue-50 rounded-tl-none"
                )}>
                   {msg.text}
                </div>
                <div className="flex items-center space-x-2 mt-2 px-1">
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                   {msg.senderId === user?.id && (
                      <div className="text-teal-500">
                        {msg.status === 'read' ? <CheckCheck size={14} /> : <Check size={14} />}
                      </div>
                   )}
                </div>
             </motion.div>
          ))}
       </div>

       {/* Input Area */}
       <div className="p-6 bg-white border-t border-blue-50/50">
          <div className="flex items-center space-x-3">
             <button className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                <ImageIcon size={20} />
             </button>
             <div className="flex-1 relative">
                <input 
                   type="text" 
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyPress={e => e.key === 'Enter' && handleSend()}
                   placeholder="Type message here..."
                   className="w-full h-14 bg-slate-50 rounded-2xl px-6 py-2 text-sm font-bold text-slate-800 placeholder:text-slate-300 border border-transparent focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500">
                  <Mic size={18} />
                </button>
             </div>
             <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className={cn(
                   "p-4 rounded-2xl shadow-xl transition-all",
                   input.trim() ? "bg-teal-500 text-white shadow-teal-500/30 scale-100" : "bg-slate-100 text-slate-300 cursor-not-allowed scale-95"
                )}
             >
                <Send size={20} />
             </button>
          </div>
       </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/Button';
import { 
  Send, 
  ChevronLeft, 
  Phone, 
  Video, 
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function Chat() {
  const [inputText, setInputText] = useState('');
  const { user } = useAuth();
  const { messages, addMessage, patients } = useData();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUser = user?.role === 'doctor'
    ? patients[0]
    : { id: 'doctor-1', name: 'Dr. Sarah Wilson', avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200' };

  const filteredMessages = messages.filter(m =>
    (m.senderId === user?.id && m.receiverId === otherUser?.id) ||
    (m.senderId === otherUser?.id && m.receiverId === user?.id)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !otherUser) return;
    addMessage({
      senderId: user.id,
      receiverId: otherUser.id,
      text: inputText
    });
    setInputText('');
  };

  return (
    <div className="h-full flex flex-col bg-[#F1F9FE] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-blue-50 shadow-sm shrink-0 safe-top">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            title="Go back"
            aria-label="Go back"
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="relative">
            <img src={otherUser?.avatar} alt="avatar" className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 leading-none mb-0.5">{otherUser?.name}</h3>
            <p className="text-[10px] text-green-500 font-bold tracking-widest uppercase">Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button title="Video call" aria-label="Video call" className="p-2.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors">
            <Video size={20} />
          </button>
          <button title="Phone call" aria-label="Phone call" className="p-2.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors">
            <Phone size={20} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="flex justify-center mb-2">
          <span className="px-4 py-1 bg-slate-100 rounded-full text-[10px] text-slate-400 font-black uppercase tracking-widest">Today</span>
        </div>

        <AnimatePresence initial={false}>
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => {
              const isMe = msg.senderId === user?.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.9, x: isMe ? 20 : -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn('flex w-full', isMe ? 'justify-end' : 'justify-start')}
                >
                  <div className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3 text-sm font-medium shadow-sm',
                    isMe
                      ? 'bg-gradient-to-br from-[#00A3FF] to-[#0047FF] text-white rounded-tr-sm'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm shadow-md'
                  )}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <p className={cn(
                      'text-[10px] mt-1 text-right font-bold',
                      isMe ? 'text-white/60' : 'text-slate-400'
                    )}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center px-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-400">
                <MessageSquare size={36} />
              </div>
              <div className="space-y-1">
                <p className="font-black text-slate-700">No messages yet</p>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  Start a secure consultation with {otherUser?.name?.split(' ')[0]}
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-blue-50 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] shrink-0 safe-bottom">
        <form onSubmit={handleSend} className="flex items-center space-x-3 max-w-lg mx-auto">
          <button
            type="button"
            title="AI Assistant"
            aria-label="AI Assistant"
            className="p-3 rounded-full text-blue-400 bg-blue-50 hover:bg-blue-100 transition-colors shrink-0"
          >
            <BrainCircuit size={22} />
          </button>
          <input
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            title="Message input"
            aria-label="Message input"
            className="flex-1 h-12 px-5 bg-slate-50 border-2 border-slate-100 rounded-full text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:border-blue-200 transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            title="Send message"
            aria-label="Send message"
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00A3FF] to-[#0047FF] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 disabled:opacity-40 shrink-0 transition-opacity"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

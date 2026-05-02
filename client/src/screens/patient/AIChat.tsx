import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Send, 
  User, 
  Sparkles, 
  Loader2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/Button';
import { chatWithDentalAI } from '../../services/gemini';
import { cn } from '../../lib/utils';

const SUGGESTIONS = [
  'Tooth Pain', 'Bleeding Gums', 'Braces Care', 'After Extraction'
];

export default function AIChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { 
      role: 'model', 
      text: "Hello! I'm your Alpha Dent AI Assistant. How can I help you with your dental health today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const userMsg = { role: 'user' as const, text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithDentalAI(text, messages);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having tech issues. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FBFE]">
      {/* Header Chips */}
      <div className="bg-white border-b border-blue-50 px-4 py-4 flex space-x-3 overflow-x-auto scrollbar-hide z-20 safe-top">
        {SUGGESTIONS.map((chip) => (
          <button 
            key={chip}
            onClick={() => handleSend(chip)}
            className="px-5 py-2.5 rounded-full border border-blue-100 text-teal-600 bg-teal-50/30 text-sm font-black whitespace-nowrap active:bg-teal-100 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Navbar */}
      <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-blue-50">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft size={24} className="text-slate-400" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=ai-bot" alt="ai" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight">Dental AI Assistant</h2>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Always Online</span>
              </div>
            </div>
          </div>
        </div>
        <button className="p-2 text-slate-400">
          <Info size={20} />
        </button>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={cn(
              "flex flex-col",
              msg.role === 'user' ? "items-end" : "items-start"
            )}
          >
            <div className={cn(
              "max-w-[85%] p-4 rounded-3xl text-sm font-bold leading-relaxed",
              msg.role === 'user' 
                ? "bg-teal-500 text-white rounded-br-none shadow-lg shadow-teal-500/20" 
                : "bg-white text-slate-700 border border-blue-50 rounded-tl-none shadow-sm"
            )}>
              {msg.text}
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mt-2 px-1">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-teal-500 bg-teal-50 w-fit px-4 py-2 rounded-2xl animate-pulse">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs font-black uppercase tracking-widest">AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-blue-50">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="relative flex items-center bg-slate-50 border border-slate-100 rounded-full px-6 py-1 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all shadow-inner"
        >
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 h-14 bg-transparent focus:outline-none text-sm font-bold text-slate-800"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-3 rounded-full transition-all",
              input.trim() ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30" : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

import React from 'react';
import { cn } from '../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => (
  <div className="w-full space-y-1.5">
    {label && <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>}
    <input
      className={cn(
        'w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-[20px] text-slate-800 font-medium placeholder:text-slate-300',
        'focus:outline-none focus:border-blue-300 focus:bg-white transition-all',
        error && 'border-red-300 focus:border-red-400',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
  </div>
);

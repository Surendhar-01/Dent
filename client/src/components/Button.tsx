import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-bold rounded-[20px] transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-[#00A3FF] to-[#0047FF] text-white shadow-lg shadow-blue-500/30 hover:brightness-110',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    danger: 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/30 hover:brightness-110',
    outline: 'border-2 border-slate-200 text-slate-700 bg-white hover:border-blue-200 hover:text-blue-600',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs h-9',
    md: 'px-6 py-3 text-sm h-12',
    lg: 'px-8 py-4 text-base h-16',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

import React from 'react';
import { cn } from '../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div
    className={cn('bg-white rounded-[32px] border border-slate-100 shadow-sm', className)}
    {...props}
  >
    {children}
  </div>
);

export const GlassCard: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div
    className={cn('bg-white/10 backdrop-blur-md rounded-[24px] border border-white/20 shadow-lg', className)}
    {...props}
  >
    {children}
  </div>
);


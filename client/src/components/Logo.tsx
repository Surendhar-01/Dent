import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  light?: boolean;
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { box: 'w-8 h-8 rounded-xl', svg: 'w-5 h-5', title: 'text-sm', sub: 'text-[8px]' },
  md: { box: 'w-10 h-10 rounded-2xl', svg: 'w-6 h-6', title: 'text-base', sub: 'text-[9px]' },
  lg: { box: 'w-12 h-12 rounded-2xl', svg: 'w-7 h-7', title: 'text-xl', sub: 'text-[10px]' },
  xl: { box: 'w-20 h-20 rounded-3xl', svg: 'w-11 h-11', title: 'text-3xl', sub: 'text-xs' },
};

export const Logo: React.FC<LogoProps> = ({ size = 'lg', light = false, showText = true, className }) => {
  const s = sizeMap[size];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex items-center justify-center bg-gradient-to-br from-[#00A3FF] to-[#0047FF] shadow-lg shadow-blue-500/30 shrink-0', s.box)}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={s.svg}
        >
          <path d="M12 2C8 2 5 5 5 8c0 2 .5 3.5 1 5l1 7c.2 1 .8 2 2 2 .8 0 1.5-.5 2-1.5L12 19l1 1.5c.5 1 1.2 1.5 2 1.5 1.2 0 1.8-1 2-2l1-7c.5-1.5 1-3 1-5 0-3-3-6-7-6z" />
        </svg>
      </div>
      {showText && (
        <div>
          <p className={cn('font-black tracking-tighter leading-none', s.title, light ? 'text-white' : 'text-[#002D5E]')}>
            Alpha Dent
          </p>
          <p className={cn('font-bold uppercase tracking-widest leading-none', s.sub, light ? 'text-white/60' : 'text-slate-400')}>
            Smart Dental Care
          </p>
        </div>
      )}
    </div>
  );
};

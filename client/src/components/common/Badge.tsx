import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'slate' | 'emerald' | 'amber' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    blue: 'bg-[#DDE8EC] text-[#3E657A] border-[#C8D9E0]',
    slate: 'bg-[#E5ECEE] text-[#425056] border-[#D3DFE2]',
    emerald: 'bg-[#E2F0EA] text-[#2D6650] border-[#CBE2D7]',
    amber: 'bg-[#F9EFE4] text-[#8C5D29] border-[#EED7BF]',
    neutral: 'bg-[#ECEEED] text-[#556368] border-[#D9DFE0]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

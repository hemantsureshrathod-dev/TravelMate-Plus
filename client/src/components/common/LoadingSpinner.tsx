import React from 'react';

export interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading...',
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
      <div
        className={`${sizeStyles[size]} rounded-full border-[#DCE3E5] border-t-[#5E8CA6] animate-spin`}
        role="status"
        aria-label={label}
      />
      {label && <p className="text-xs font-medium text-[#6C7A80] tracking-wide">{label}</p>}
    </div>
  );
};

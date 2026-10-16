import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl border border-[#DCE3E5] bg-white p-6 shadow-[0_2px_8px_rgba(38,51,58,0.04)] transition-all duration-200 ${
        hoverable ? 'hover:border-[#5E8CA6]/50 hover:shadow-[0_8px_24px_rgba(94,140,166,0.1)]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

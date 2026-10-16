import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  className = '',
}) => {
  const config = {
    info: {
      container: 'bg-[#DDE8EC]/60 border-[#C5D7DF] text-[#26333A]',
      icon: <Info className="w-5 h-5 text-[#5E8CA6] shrink-0" />,
    },
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    },
    error: {
      container: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    },
  };

  const { container, icon } = config[type];

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed ${container} ${className}`}
      role="alert"
    >
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        {title && <h4 className="font-semibold text-xs tracking-wider uppercase mb-1">{title}</h4>}
        <div className="text-xs sm:text-sm">{children}</div>
      </div>
    </div>
  );
};

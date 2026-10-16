import React from 'react';
import { Compass } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCE3E5] bg-white/60 p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDE8EC] text-[#5E8CA6] mb-4">
        {icon || <Compass className="h-7 w-7" />}
      </div>
      <h3 className="text-base font-semibold text-[#26333A] mb-1">{title}</h3>
      <p className="max-w-sm text-xs sm:text-sm text-[#6C7A80] mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

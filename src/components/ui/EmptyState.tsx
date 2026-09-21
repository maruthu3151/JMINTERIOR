import React, { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-stone-300 bg-stone-50/50 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-wood-100/80 text-wood-700 flex items-center justify-center mb-4">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-stone-500 max-w-md mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

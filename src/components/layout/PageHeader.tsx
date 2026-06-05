import React from 'react';
import { cn } from '../../lib/cn';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showBack?: boolean;
}

export function PageHeader({ title, subtitle, actions, showBack }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-10">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg hover:bg-surface2-light dark:hover:bg-surface2-dark transition-colors"
            >
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>
          )}
          <h2 className="text-3xl font-black tracking-tight">{title}</h2>
        </div>
        {subtitle && <p className="text-muted-light dark:text-muted-dark text-sm font-medium">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

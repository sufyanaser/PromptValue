import React from 'react';
import { cn } from '../../lib/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'surface' | 'glass';
}

export function Card({ children, className, variant = 'default' }: CardProps) {
  const variants = {
    default: "bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark",
    surface: "bg-surface2-light dark:bg-surface2-dark border-transparent",
    glass: "bg-surface-light/40 dark:bg-surface-dark/40 backdrop-blur-md border-border-light/40 dark:border-border-dark/40"
  };

  return (
    <div className={cn(
      "rounded-2xl border transition-all duration-300",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon: Icon, className, actions }: { title: string, subtitle?: string, icon?: any, className?: string, actions?: React.ReactNode }) {
  return (
    <div className={cn("p-6 pb-4 flex items-center justify-between gap-4", className)}>
      <div className="flex-1 flex flex-col gap-0.5">
        <h3 className="text-base font-bold tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-muted-light dark:text-muted-dark font-medium">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent" />
        </div>
      )}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}

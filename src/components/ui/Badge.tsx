import React from 'react';
import { cn } from '../../lib/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'danger' | 'info' | 'outline';
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ children, variant = 'default', className, style }: BadgeProps) {
  const variants = {
    default: "bg-surface2-light dark:bg-surface2-dark text-muted-light dark:text-muted-dark opacity-60",
    accent: "bg-accent/10 text-accent font-black",
    success: "bg-success/10 text-success font-black",
    danger: "bg-danger/10 text-danger font-black",
    info: "bg-info/10 text-info font-black",
    outline: "border border-border/50 text-muted-light dark:text-muted-dark"
  };

  return (
    <span 
      className={cn(
        "px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider font-bold",
        variants[variant],
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}

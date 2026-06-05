import React from 'react';
import { cn } from '../../lib/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'info' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-accent text-white shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-surface2-light dark:bg-surface2-dark border border-border/40 hover:bg-surface2-light/80 dark:hover:bg-surface2-dark/80",
    ghost: "bg-transparent hover:bg-surface2-light dark:hover:bg-surface2-dark text-muted-light dark:text-muted-dark",
    danger: "bg-danger text-white hover:bg-danger/90",
    info: "bg-info text-white hover:bg-info/90",
    success: "bg-success text-white hover:bg-success/90",
  };

  const sizes = {
    sm: "px-3 h-8 text-[11px] font-bold rounded-lg",
    md: "px-5 h-11 text-sm font-bold rounded-xl",
    lg: "px-8 h-14 text-base font-black rounded-2xl",
    icon: "w-10 h-10 flex items-center justify-center rounded-xl",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : children}
    </button>
  );
}

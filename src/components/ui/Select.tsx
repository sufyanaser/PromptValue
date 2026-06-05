import React from 'react';
import { cn } from '../../lib/cn';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full relative">
      {label && <label className="text-xs font-bold opacity-70 pr-1">{label}</label>}
      <div className="relative">
        <select
          className={cn(
            "h-11 w-full flex items-center justify-between px-4 rounded-xl border border-border/40 bg-surface2-light dark:bg-surface2-dark text-sm font-medium outline-none appearance-none focus:border-accent transition-all",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 pointer-events-none" />
      </div>
    </div>
  );
}

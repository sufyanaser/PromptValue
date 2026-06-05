import React from 'react';
import { cn } from '../../lib/cn';
import { useApp } from '../../app/app-provider';

export function StatusBar() {
  const { theme } = useApp();

  return (
    <footer className={cn(
      "h-[36px] flex items-center justify-between px-6 border-t text-[11px] font-medium transition-colors duration-200",
      theme === 'dark' ? "bg-shell-dark border-border-dark text-muted-dark" : "bg-shell-light border-border-light text-muted-light"
    )}>
      <div className="flex items-center gap-4">
        <span>PromptVault v1.0.0</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
        <span>جميع الأنظمة تعمل بشكل طبيعي</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="opacity-60">Local-first · Cloud-ready architecture</span>
      </div>
    </footer>
  );
}

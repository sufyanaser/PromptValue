import React from 'react';
import { cn } from '../../lib/cn';
import { useApp } from '../../app/app-provider';
import { RefreshCw } from 'lucide-react';

export function StatusBar() {
  const { theme } = useApp();

  return (
    <footer className={cn(
      "h-[36px] flex items-center justify-between px-6 border-t text-[11px] font-bold transition-colors duration-200 select-none",
      theme === 'dark' ? "bg-shell-dark border-border-dark text-muted-dark" : "bg-shell-light border-border-light text-muted-light"
    )}>
      <div className="flex items-center gap-4">
        <span>PromptVault v1.2.0</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        <span>جميع الأنظمة تعمل بشكل طبيعي</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3 opacity-60" />
          <span>المزامنة: اليوم، 02:30 م</span>
        </div>
        <div className="flex items-center gap-2">
          <span>المساحة المستخدمة: 256.8 MB من 5 GB (5%)</span>
          <div className="w-16 h-1.5 bg-border/40 rounded-full overflow-hidden hidden sm:block">
            <div className="w-[5%] h-full bg-accent rounded-full" />
          </div>
        </div>
      </div>
    </footer>
  );
}

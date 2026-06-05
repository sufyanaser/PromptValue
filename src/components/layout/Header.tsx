import React from 'react';
import { Search, Plus, Sun, Moon, Database, LayoutDashboard, Notebook } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useApp } from '../../app/app-provider';
import { Link } from 'react-router-dom';

export function Header() {
  const { theme, setTheme, viewMode, setViewMode, t } = useApp();

  return (
    <header className={cn(
      "h-[80px] flex items-center justify-between px-6 border-b transition-colors duration-200 glass z-50 sticky top-0",
      theme === 'dark' ? "bg-shell-dark/80 border-border-dark" : "bg-shell-light/80 border-border-light"
    )}>
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
            <Database className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight leading-none">PromptVault</h1>
            <span className="text-[10px] uppercase font-bold text-accent tracking-[2px]">{t('common.appSub')}</span>
          </div>
        </div>

        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-light/60 group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder={t('common.searchPlaceholder')}
            className={cn(
              "w-full h-11 pe-11 ps-12 rounded-xl text-sm transition-all border outline-none",
              theme === 'dark'
                ? "bg-surface2-dark border-border-dark focus:border-accent text-text-dark"
                : "bg-surface2-light border-border-light focus:border-accent text-text-light"
            )}
          />
          <div className="absolute start-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-border/50 text-[10px] font-mono opacity-50">
            {t('common.ctrlK')}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* View Mode Toggle Buttons */}
        <div className="flex p-1 bg-surface2-light dark:bg-surface2-dark rounded-xl border border-border/40 gap-1 ms-4 select-none">
          <button
            onClick={() => setViewMode('detailed')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1.5 cursor-pointer",
              viewMode === 'detailed'
                ? "bg-white dark:bg-surface-dark shadow text-accent"
                : "opacity-45 hover:opacity-100"
            )}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{t('header.proMode')}</span>
          </button>
          <button
            onClick={() => setViewMode('notepad')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1.5 cursor-pointer",
              viewMode === 'notepad'
                ? "bg-white dark:bg-surface-dark shadow text-accent"
                : "opacity-45 hover:opacity-100"
            )}
          >
            <Notebook className="w-3.5 h-3.5" />
            <span>{t('header.notepadMode')}</span>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-border mx-2" />

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-xl bg-surface2-light dark:bg-surface2-dark transition-colors border border-border/40 cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-accent" />}
        </button>

        <Link
          to="/editor"
          className="flex items-center gap-2 px-5 h-11 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>{t('common.newPrompt')}</span>
        </Link>
      </div>
    </header>
  );
}

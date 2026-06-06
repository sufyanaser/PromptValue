import React, { useEffect } from 'react';
import { Search, Plus, Sun, Moon, Database, LayoutDashboard, Notebook } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useApp } from '../../app/app-provider';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const { theme, setTheme, viewMode, setViewMode, t } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchClick = () => {
    const hasLocalSearch = location.pathname === '/prompts' || location.pathname === '/search';
    if (hasLocalSearch) {
      const pageInput = document.querySelector('main input[type="text"]') as HTMLInputElement;
      pageInput?.focus();
    } else {
      navigate('/search');
      setTimeout(() => {
        const pageInput = document.querySelector('main input[type="text"]') as HTMLInputElement;
        pageInput?.focus();
      }, 150);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Listen for Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleSearchClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname, navigate]);

  return (
    <header className={cn(
      "h-[80px] flex items-center justify-between px-6 border-b transition-colors duration-200 glass z-50 sticky top-0",
      theme === 'dark' ? "bg-shell-dark/80 border-border-dark" : "bg-shell-light/80 border-border-light"
    )}>
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
            <Database className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col hidden sm:flex">
            <h1 className="text-lg font-black tracking-tight leading-none">PromptVault</h1>
            <span className="text-[10px] uppercase font-bold text-accent tracking-[2px]">{t('common.appSub')}</span>
          </div>
        </div>

        {/* Command Search Button (Styled like input) */}
        <button
          onClick={handleSearchClick}
          className="relative flex-1 max-w-xl group text-start outline-none cursor-pointer hidden sm:block select-none"
        >
          <div className={cn(
            "w-full h-11 ps-11 pe-16 rounded-xl text-sm transition-all border flex items-center justify-between text-muted-light/60 dark:text-muted-dark/60 group-hover:border-accent/40 group-focus:border-accent/40",
            theme === 'dark'
              ? "bg-surface2-dark/60 border-border-dark"
              : "bg-surface2-light/60 border-border-light"
          )}>
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-light/60 group-hover:text-accent transition-colors" />
            <span className="truncate px-4">{t('common.searchPlaceholder')}</span>
            <div className="absolute end-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-border/50 text-[10px] font-mono opacity-50 bg-surface/50">
              {t('common.ctrlK')}
            </div>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Compact Search Button for extra small screens */}
        <button
          onClick={handleSearchClick}
          className="p-2.5 rounded-xl bg-surface2-light dark:bg-surface2-dark transition-colors border border-border/40 cursor-pointer sm:hidden text-muted-light dark:text-muted-dark hover:text-accent dark:hover:text-accent"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* View Mode Toggle Buttons */}
        <div className="flex p-1 bg-surface2-light dark:bg-surface2-dark rounded-xl border border-border/40 gap-1 ms-2 sm:ms-4 select-none">
          <button
            onClick={() => setViewMode('detailed')}
            className={cn(
              "px-3 py-1.5 sm:px-3.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1.5 cursor-pointer",
              viewMode === 'detailed'
                ? "bg-white dark:bg-surface-dark shadow text-accent"
                : "opacity-45 hover:opacity-100"
            )}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t('header.proMode')}</span>
          </button>
          <button
            onClick={() => setViewMode('notepad')}
            className={cn(
              "px-3 py-1.5 sm:px-3.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1.5 cursor-pointer",
              viewMode === 'notepad'
                ? "bg-white dark:bg-surface-dark shadow text-accent"
                : "opacity-45 hover:opacity-100"
            )}
          >
            <Notebook className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t('header.notepadMode')}</span>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-border mx-1 sm:mx-2" />

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-xl bg-surface2-light dark:bg-surface2-dark transition-colors border border-border/40 cursor-pointer text-accent"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-accent" />}
        </button>

        <Link
          to="/editor"
          className="flex items-center gap-2 px-3 md:px-5 h-11 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden md:inline">{t('common.newPrompt')}</span>
        </Link>
      </div>
    </header>
  );
}

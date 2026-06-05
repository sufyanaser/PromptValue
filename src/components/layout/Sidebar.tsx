import React from 'react';
import { Search, Plus, Palette, Settings, MoreHorizontal, LayoutDashboard, Database, Star, Hash, Filter, Import, Download, History, Shield } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useApp } from '../../app/app-provider';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const { data, theme, t } = useApp();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard, path: '/' },
    { id: 'prompts', label: t('sidebar.prompts'), icon: Database, path: '/prompts' },
    { id: 'favorites', label: t('sidebar.favorites'), icon: Star, path: '/favorites' },
    { id: 'categories', label: t('sidebar.categories'), icon: Palette, path: '/categories' },
    { id: 'tags', label: t('sidebar.tags'), icon: Hash, path: '/tags' },
    { id: 'search', label: t('sidebar.search'), icon: Filter, path: '/search' },
    { id: 'import-export', label: t('sidebar.importExport'), icon: Import, path: '/import-export' },
    { id: 'backups', label: t('sidebar.backups'), icon: History, path: '/backups' },
    { id: 'settings', label: t('sidebar.settings'), icon: Settings, path: '/settings' },
  ];

  return (
    <div className={cn(
      "w-[260px] h-full flex flex-col border-e transition-colors duration-200",
      theme === 'dark' ? "bg-shell-dark border-border-dark" : "bg-shell-light border-border-light"
    )}>
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? (theme === 'dark' ? "bg-accent-soft-dark text-accent" : "bg-accent-soft-light text-accent")
                  : (theme === 'dark' ? "text-muted-dark hover:bg-surface2-dark hover:text-text-dark" : "text-muted-light hover:bg-surface2-light hover:text-text-light")
              )}
            >
              <item.icon className={cn("w-4.5 h-4.5", isActive ? "text-accent" : "text-current")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="px-3 pb-6 pt-4 border-t border-border/50">
        <div className={cn(
          "p-4 rounded-xl space-y-3",
          theme === 'dark' ? "bg-surface2-dark" : "bg-surface2-light"
        )}>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-bold opacity-80 uppercase tracking-wider">{t('sidebar.dbStatus')}</h3>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="opacity-60 font-medium">{t('sidebar.status')}</span>
              <span className="text-success font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                {t('sidebar.connected')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60 font-medium">{t('sidebar.promptsCount')}</span>
              <span className="font-bold">{data.prompts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60 font-medium">{t('sidebar.storage')}</span>
              <span className="font-bold">{t('sidebar.storageLocal')}</span>
            </div>
          </div>
          <Link
            to="/backups"
            className="w-full flex items-center justify-center gap-2 py-2 text-[11px] font-bold bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            {t('sidebar.manageBackups')}
          </Link>
        </div>
      </div>
    </div>
  );
}

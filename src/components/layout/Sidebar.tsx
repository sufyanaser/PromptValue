import React from 'react';
import { Palette, Settings, LayoutDashboard, Database, Star, Hash, Filter, Import, History, Shield, ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useApp } from '../../app/app-provider';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const { data, theme, t, lang } = useApp();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    return localStorage.getItem('promptvault_sidebar_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('promptvault_sidebar_collapsed', String(next));
      return next;
    });
  };

  const groups = [
    {
      title: t('sidebar.groupLibrary'),
      items: [
        { id: 'dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard, path: '/' },
        { id: 'prompts', label: t('sidebar.prompts'), icon: Database, path: '/prompts' },
        { id: 'favorites', label: t('sidebar.favorites'), icon: Star, path: '/favorites' },
      ]
    },
    {
      title: t('sidebar.groupOrganization'),
      items: [
        { id: 'categories', label: t('sidebar.categories'), icon: Palette, path: '/categories' },
        { id: 'tags', label: t('sidebar.tags'), icon: Hash, path: '/tags' },
        { id: 'search', label: t('sidebar.search'), icon: Filter, path: '/search' },
      ]
    },
    {
      title: t('sidebar.groupSystem'),
      items: [
        { id: 'import-export', label: t('sidebar.importExport'), icon: Import, path: '/import-export' },
        { id: 'backups', label: t('sidebar.backups'), icon: History, path: '/backups' },
        { id: 'settings', label: t('sidebar.settings'), icon: Settings, path: '/settings' },
      ]
    }
  ];

  return (
    <div className={cn(
      "h-full flex flex-col border-e transition-all duration-300 ease-in-out select-none shrink-0",
      isCollapsed ? "w-[68px]" : "w-[260px]",
      theme === 'dark' ? "bg-shell-dark border-border-dark" : "bg-shell-light border-border-light"
    )}>
      {/* Collapse Toggle Button Header */}
      <div className={cn(
        "flex items-center px-4 pt-4 pb-2 border-b border-border/20",
        isCollapsed ? "justify-center" : "justify-end"
      )}>
        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg hover:bg-surface2-light dark:hover:bg-surface2-dark transition-all cursor-pointer text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark"
          title={t('sidebar.toggleCollapse')}
          aria-label={t('sidebar.toggleCollapse')}
        >
          <ChevronLeft className={cn(
            "w-4 h-4 transition-transform duration-300",
            isCollapsed ? (lang === 'ar' ? "" : "rotate-180") : (lang === 'ar' ? "rotate-180" : "")
          )} />
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
        {groups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!isCollapsed ? (
              <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-light/60 dark:text-muted-dark/50 px-3 pt-3 pb-1 select-none text-start">
                {group.title}
              </h4>
            ) : (
              groupIdx > 0 && <div className="h-[1px] bg-border/40 my-3 mx-2" />
            )}

            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  title={isCollapsed ? item.label : undefined}
                  aria-label={item.label}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-all group",
                    isCollapsed ? "justify-center p-2.5 mx-auto w-10 h-10" : "gap-3 px-3 py-2.5",
                    isActive
                      ? (theme === 'dark' ? "bg-accent-soft-dark text-accent" : "bg-accent-soft-light text-accent")
                      : (theme === 'dark' ? "text-muted-dark hover:bg-surface2-dark hover:text-text-dark" : "text-muted-light hover:bg-surface2-light hover:text-text-light")
                  )}
                >
                  <item.icon className={cn("w-4.5 h-4.5 shrink-0", isActive ? "text-accent" : "text-current")} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Database Status Panel */}
      <div className={cn(
        "border-t border-border/50 transition-all duration-300",
        isCollapsed ? "p-2" : "px-3 pb-6 pt-4"
      )}>
        {isCollapsed ? (
          <Link
            to="/backups"
            title={`${t('sidebar.dbStatus')}: ${t('sidebar.connected')} (${data.prompts.length} ${t('sidebar.promptsCount')})`}
            aria-label={t('sidebar.dbStatus')}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-xl hover:bg-surface2-light dark:hover:bg-surface2-dark transition-all relative group cursor-pointer",
              theme === 'dark' ? "text-muted-dark hover:text-text-dark" : "text-muted-light hover:text-text-light"
            )}
          >
            <Shield className="w-5 h-5 text-accent" />
            <span className="absolute top-2.5 end-2.5 w-2 h-2 bg-success rounded-full animate-pulse" />
          </Link>
        ) : (
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
        )}
      </div>
    </div>
  );
}

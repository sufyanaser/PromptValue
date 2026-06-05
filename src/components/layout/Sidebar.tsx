import React from 'react';
import { Search, Plus, Palette, Settings, MoreHorizontal, LayoutDashboard, Database, Star, Hash, Filter, Import, Download, History, Shield } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useApp } from '../../app/app-provider';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const { data, theme } = useApp();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard, path: '/' },
    { id: 'prompts', label: 'البرومبتات', icon: Database, path: '/prompts' },
    { id: 'favorites', label: 'المفضلة', icon: Star, path: '/favorites' },
    { id: 'categories', label: 'التصنيفات', icon: Palette, path: '/categories' },
    { id: 'tags', label: 'الوسوم', icon: Hash, path: '/tags' },
    { id: 'search', label: 'البحث المتقدم', icon: Filter, path: '/search' },
    { id: 'import-export', label: 'استيراد / تصدير', icon: Import, path: '/import-export' },
    { id: 'backups', label: 'النسخ الاحتياطي', icon: History, path: '/backups' },
    { id: 'settings', label: 'الإعدادات', icon: Settings, path: '/settings' },
  ];

  return (
    <div className={cn(
      "w-[260px] h-full flex flex-col border-l transition-colors duration-200",
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
                  ? (theme === 'dark' ? "bg-white text-accent shadow-lg shadow-white/5" : "bg-accent-soft-light text-accent shadow-sm")
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
          "p-5 rounded-[2rem] space-y-4 border border-border/40",
          theme === 'dark' ? "bg-surface2-dark/40" : "bg-surface2-light/40"
        )}>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-accent/10">
              <Shield className="w-4 h-4 text-accent" />
            </div>
            <h3 className="text-[10px] font-black opacity-80 uppercase tracking-widest">حالة قاعدة البيانات</h3>
          </div>
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="opacity-50 font-bold">الحالة:</span>
              <span className="text-success font-black flex items-center gap-1.5 bg-success/10 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-success rounded-full" />
                متصل
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-50 font-bold">البرومبتات:</span>
              <span className="font-black">{data.prompts.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-50 font-bold">تخزين:</span>
              <span className="font-black">محلي (Local)</span>
            </div>
          </div>
          <Link
            to="/backups"
            className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-black bg-accent text-white rounded-2xl hover:bg-accent/90 transition-all shadow-md shadow-accent/20 active:scale-95"
          >
            إدارة النسخ الاحتياطي
          </Link>
        </div>
      </div>
    </div>
  );
}

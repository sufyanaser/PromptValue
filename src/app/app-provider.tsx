import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Prompt, Category, Tag, Settings, Backup } from '../types';
import { localStore } from '../storage/local-store';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '../lib/cn';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

interface AppContextType {
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  toggleFavorite: (id: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'promptCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addTag: (tag: Omit<Tag, 'id' | 'usageCount'>) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  createBackup: (type: 'manual' | 'auto') => void;
  restoreBackup: (id: string) => void;
  deleteBackup: (id: string) => void;
  duplicatePrompt: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'danger') => void;
  viewMode: 'detailed' | 'notepad';
  setViewMode: (mode: 'detailed' | 'notepad') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(localStore.load());
  const [theme, setThemeState] = useState<'light' | 'dark'>(data.settings.theme === 'dark' ? 'dark' : 'light');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [viewMode, setViewModeState] = useState<'detailed' | 'notepad'>(
    data.settings.defaultView === 'notepad' ? 'notepad' : 'detailed'
  );

  const setViewMode = (mode: 'detailed' | 'notepad') => {
    setViewModeState(mode);
    updateData({ settings: { ...data.settings, defaultView: mode } });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'danger' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  useEffect(() => {
    localStore.save(data);
    // Apply theme classes to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Sync with Electron native theme
    const pv = (window as any).PromptVault;
    if (pv && pv.theme) {
      pv.theme.setTheme(theme);
    }
  }, [data, theme]);

  const updateData = (newData: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    updateData({ settings: { ...data.settings, theme: t } });
  };

  const addPrompt = (p: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    const newPrompt: Prompt = {
      ...p,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    setData(prev => ({
      ...prev,
      prompts: [newPrompt, ...prev.prompts],
      activities: [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'create',
        label: `تم إنشاء برومبت جديد: ${newPrompt.title}`,
        promptId: newPrompt.id,
        createdAt: new Date().toISOString()
      }, ...prev.activities]
    }));
  };

  const updatePrompt = (id: string, updates: Partial<Prompt>) => {
    setData(prev => ({
      ...prev,
      prompts: prev.prompts.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
    }));
  };

  const deletePrompt = (id: string) => {
    setData(prev => ({
      ...prev,
      prompts: prev.prompts.filter(p => p.id !== id)
    }));
  };

  const toggleFavorite = (id: string) => {
    setData(prev => ({
      ...prev,
      prompts: prev.prompts.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)
    }));
  };

  const addCategory = (c: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'promptCount'>) => {
    const newCategory: Category = {
      ...c,
      id: Math.random().toString(36).substr(2, 9),
      promptCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)
    }));
  };

  const deleteCategory = (id: string) => {
    setData(prev => {
      const updatedPrompts = prev.prompts.map(p => p.categoryId === id ? { ...p, categoryId: '' } : p);
      return {
        ...prev,
        categories: prev.categories.filter(c => c.id !== id),
        prompts: updatedPrompts
      };
    });
  };

  const addTag = (t: Omit<Tag, 'id' | 'usageCount'>) => {
    const newTag: Tag = {
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      usageCount: 0
    };
    setData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag]
    }));
  };

  const updateTag = (id: string, updates: Partial<Tag>) => {
    setData(prev => {
      const oldTag = prev.tags.find(t => t.id === id);
      const updatedPrompts = oldTag && updates.name ? prev.prompts.map(p => ({
        ...p,
        tags: p.tags.map(t => t === oldTag.name ? updates.name! : t)
      })) : prev.prompts;

      return {
        ...prev,
        tags: prev.tags.map(t => t.id === id ? { ...t, ...updates } : t),
        prompts: updatedPrompts
      };
    });
  };

  const deleteTag = (id: string) => {
    setData(prev => {
      const oldTag = prev.tags.find(t => t.id === id);
      const updatedPrompts = oldTag ? prev.prompts.map(p => ({
        ...p,
        tags: p.tags.filter(t => t !== oldTag.name)
      })) : prev.prompts;

      return {
        ...prev,
        tags: prev.tags.filter(t => t.id !== id),
        prompts: updatedPrompts
      };
    });
  };

  const createBackup = (type: 'manual' | 'auto') => {
    const backupDataString = JSON.stringify({
      prompts: data.prompts,
      categories: data.categories,
      tags: data.tags
    });
    // calculate size in MB
    const sizeMB = (encodeURI(backupDataString).split(/%..|./).length - 1) / (1024 * 1024);
    const newBackup: Backup = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      size: `${sizeMB.toFixed(2)} MB`,
      status: 'success',
      createdAt: new Date().toISOString(),
      path: backupDataString
    };
    setData(prev => ({
      ...prev,
      backups: [newBackup, ...prev.backups]
    }));
  };

  const restoreBackup = (backupId: string) => {
    const backup = data.backups.find(b => b.id === backupId);
    if (!backup) return;
    try {
      const restored = JSON.parse(backup.path);
      setData(prev => ({
        ...prev,
        prompts: restored.prompts || prev.prompts,
        categories: restored.categories || prev.categories,
        tags: restored.tags || prev.tags
      }));
    } catch (e) {
      console.error("Failed to restore backup", e);
    }
  };

  const deleteBackup = (backupId: string) => {
    setData(prev => ({
      ...prev,
      backups: prev.backups.filter(b => b.id !== backupId)
    }));
  };

  const duplicatePrompt = (id: string) => {
    const original = data.prompts.find(p => p.id === id);
    if (!original) return;
    const duplicated: Prompt = {
      ...original,
      id: Math.random().toString(36).substr(2, 9),
      title: `${original.title} - نسخة`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      version: 1
    };
    setData(prev => ({
      ...prev,
      prompts: [duplicated, ...prev.prompts],
      activities: [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'create',
        label: `تم تكرار برومبت: "${original.title}"`,
        promptId: duplicated.id,
        createdAt: new Date().toISOString()
      }, ...prev.activities]
    }));
  };

  return (
    <AppContext.Provider value={{
      data,
      updateData,
      addPrompt,
      updatePrompt,
      deletePrompt,
      toggleFavorite,
      theme,
      setTheme,
      addCategory,
      updateCategory,
      deleteCategory,
      addTag,
      updateTag,
      deleteTag,
      createBackup,
      restoreBackup,
      deleteBackup,
      duplicatePrompt,
      showToast,
      viewMode,
      setViewMode
    }}>
      {children}
      
      {/* Toast Notifications Container */}
      <div className="fixed top-6 left-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none select-none">
        <AnimatePresence>
          {toasts.map(t => {
            const toastIcons = {
              success: CheckCircle2,
              info: Info,
              warning: AlertTriangle,
              danger: XCircle
            };
            const Icon = toastIcons[t.type];
            
            const toastColors = {
              success: 'border-success/30 bg-white/95 dark:bg-surface-dark/95 text-success shadow-success/5',
              info: 'border-info/30 bg-white/95 dark:bg-surface-dark/95 text-info shadow-info/5',
              warning: 'border-accent/30 bg-white/95 dark:bg-surface-dark/95 text-accent shadow-accent/5',
              danger: 'border-danger/30 bg-white/95 dark:bg-surface-dark/95 text-danger shadow-danger/5'
            };
            
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className={cn(
                  "p-4 rounded-2xl border glass flex items-start gap-3 pointer-events-auto shadow-2xl transition-colors duration-200",
                  toastColors[t.type]
                )}
              >
                <div className="mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-xs font-black leading-relaxed text-slate-800 dark:text-slate-100 pr-1">
                  {t.message}
                </div>
                <button
                  onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
                  className="opacity-40 hover:opacity-100 transition-opacity mr-2"
                >
                  <X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

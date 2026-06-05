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

export interface ConfirmOptions {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
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
  confirm: (options: ConfirmOptions) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(localStore.load());
  const [theme, setThemeState] = useState<'light' | 'dark'>(data.settings.theme === 'dark' ? 'dark' : 'light');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [viewMode, setViewModeState] = useState<'detailed' | 'notepad'>(
    data.settings.defaultView === 'notepad' ? 'notepad' : 'detailed'
  );
  const [confirmState, setConfirmState] = useState<ConfirmOptions & { isOpen: boolean }>({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });

  const confirm = (options: ConfirmOptions) => {
    setConfirmState({
      ...options,
      isOpen: true,
    });
  };

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

  // Load initial data from Electron if available
  useEffect(() => {
    const pv = (window as any).PromptVault;
    if (pv && pv.storage) {
      pv.storage.load().then((loadedData: any) => {
        if (loadedData) {
          setData(loadedData);
          if (loadedData.settings) {
            if (loadedData.settings.theme) {
              setThemeState(loadedData.settings.theme === 'dark' ? 'dark' : 'light');
            }
            if (loadedData.settings.defaultView) {
              setViewModeState(loadedData.settings.defaultView === 'notepad' ? 'notepad' : 'detailed');
            }
          }
        } else {
          // If no local file database exists on first load, save current initial data
          pv.storage.save(data);
        }
      }).catch((err: any) => {
        console.error("Failed to load database from Electron:", err);
      });
    }
  }, []);

  useEffect(() => {
    localStore.save(data);
    
    // Sync with Electron file storage
    const pv = (window as any).PromptVault;
    if (pv && pv.storage) {
      pv.storage.save(data);
    }

    // Apply theme classes to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Sync with Electron native theme
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
      setViewMode,
      confirm
    }}>
      {children}
      
      {/* Custom Confirm Modal */}
      <AnimatePresence>
        {confirmState.isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (confirmState.onCancel) confirmState.onCancel();
                setConfirmState(prev => ({ ...prev, isOpen: false }));
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className={cn(
                "relative w-full max-w-md p-6 rounded-3xl border glass shadow-2xl z-10 transition-colors duration-200 text-right pointer-events-auto",
                theme === 'dark'
                  ? "bg-surface-dark/95 border-border-dark text-text-dark"
                  : "bg-white/95 border-border-light text-text-light"
              )}
            >
              {/* Header Icon & Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                  "p-3 rounded-2xl shrink-0",
                  confirmState.type === 'danger'
                    ? "bg-danger/10 text-danger"
                    : confirmState.type === 'warning'
                    ? "bg-accent/10 text-accent"
                    : "bg-info/10 text-info"
                )}>
                  {confirmState.type === 'danger' ? (
                    <XCircle className="w-6 h-6" />
                  ) : confirmState.type === 'warning' ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <Info className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-black leading-snug">
                    {confirmState.title || "تأكيد الإجراء"}
                  </h3>
                  <p className="text-xs font-bold leading-relaxed opacity-60 mt-1">
                    {confirmState.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    if (confirmState.onCancel) confirmState.onCancel();
                    setConfirmState(prev => ({ ...prev, isOpen: false }));
                  }}
                  className={cn(
                    "flex-1 py-3 rounded-2xl text-xs font-black transition-all border outline-none hover:scale-[1.01] active:scale-[0.99] cursor-pointer",
                    theme === 'dark'
                      ? "bg-surface2-dark border-border-dark hover:bg-border-dark text-muted-dark hover:text-text-dark"
                      : "bg-surface2-light border-border-light hover:bg-border-light text-muted-light hover:text-text-light"
                  )}
                >
                  {confirmState.cancelText || "إلغاء"}
                </button>
                <button
                  onClick={() => {
                    confirmState.onConfirm();
                    setConfirmState(prev => ({ ...prev, isOpen: false }));
                  }}
                  className={cn(
                    "flex-1 py-3 rounded-2xl text-xs font-black text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer",
                    confirmState.type === 'danger'
                      ? "bg-danger shadow-danger/25 hover:bg-danger/90"
                      : confirmState.type === 'warning'
                      ? "bg-accent shadow-accent/25 hover:bg-accent/90"
                      : "bg-info shadow-info/25 hover:bg-info/90"
                  )}
                >
                  {confirmState.confirmText || "موافق"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notifications Container */}
      <div className="fixed bottom-14 left-6 z-[9999] flex flex-col-reverse gap-3 max-w-md w-full pointer-events-none select-none">
        <AnimatePresence>
          {toasts.map(t => {
            const toastIcons = {
              success: CheckCircle2,
              info: Info,
              warning: AlertTriangle,
              danger: XCircle
            };
            const Icon = toastIcons[t.type];
            
            const toastStyles = {
              success: {
                card: 'border-success/20 bg-white/90 dark:bg-surface-dark/95 shadow-[0_12px_40px_-12px_rgba(34,197,94,0.18)] dark:shadow-[0_12px_40px_-12px_rgba(34,197,94,0.25)]',
                iconBox: 'bg-success/10 text-success border border-success/20',
                progress: 'bg-success'
              },
              info: {
                card: 'border-info/20 bg-white/90 dark:bg-surface-dark/95 shadow-[0_12px_40px_-12px_rgba(59,130,246,0.18)] dark:shadow-[0_12px_40px_-12px_rgba(59,130,246,0.25)]',
                iconBox: 'bg-info/10 text-info border border-info/20',
                progress: 'bg-info'
              },
              warning: {
                card: 'border-accent/20 bg-white/90 dark:bg-surface-dark/95 shadow-[0_12px_40px_-12px_rgba(245,158,11,0.18)] dark:shadow-[0_12px_40px_-12px_rgba(245,158,11,0.25)]',
                iconBox: 'bg-accent/10 text-accent border border-accent/20',
                progress: 'bg-accent'
              },
              danger: {
                card: 'border-danger/20 bg-white/90 dark:bg-surface-dark/95 shadow-[0_12px_40px_-12px_rgba(239,68,68,0.18)] dark:shadow-[0_12px_40px_-12px_rgba(239,68,68,0.25)]',
                iconBox: 'bg-danger/10 text-danger border border-danger/20',
                progress: 'bg-danger'
              }
            };
            
            const style = toastStyles[t.type];
            
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: -40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{
                  opacity: { duration: 0.2 },
                  x: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
                  scale: { duration: 0.2 },
                  layout: { type: "spring", stiffness: 350, damping: 35 }
                }}
                className={cn(
                  "relative overflow-hidden p-4 rounded-2xl border glass flex items-center gap-3.5 pointer-events-auto transition-all duration-300",
                  style.card
                )}
              >
                <div className={cn("p-2.5 rounded-xl shrink-0 flex items-center justify-center", style.iconBox)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-xs font-black leading-relaxed text-slate-800 dark:text-slate-100 pr-1 select-text text-right">
                  {t.message}
                </div>
                <button
                  onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                
                {/* Visual Countdown Progress Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden rounded-b-2xl bg-slate-100/20 dark:bg-slate-800/10">
                  <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: 3.5, ease: 'linear' }}
                    style={{ originX: 1 }}
                    className={cn("h-full w-full", style.progress)}
                  />
                </div>
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

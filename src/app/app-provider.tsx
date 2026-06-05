import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Prompt, Category, Tag, Settings } from '../types';
import { localStore } from '../storage/local-store';

interface AppContextType {
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  toggleFavorite: (id: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(localStore.load());
  const [theme, setThemeState] = useState<'light' | 'dark'>(data.settings.theme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    localStore.save(data);
    // Apply theme classes to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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

  return (
    <AppContext.Provider value={{ data, updateData, addPrompt, updatePrompt, deletePrompt, toggleFavorite, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

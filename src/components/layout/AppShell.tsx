import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import { useApp } from '../../app/app-provider';
import { cn } from '../../lib/cn';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { NotepadView } from './NotepadView';

export function AppShell({ children }: { children: ReactNode }) {
  const { theme, viewMode } = useApp();
  const location = useLocation();

  return (
    <div className={cn(
      "flex flex-col h-screen overflow-hidden",
      theme === 'dark' ? "bg-background-dark text-text-dark" : "bg-background-light text-text-light"
    )}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {viewMode === 'notepad' ? (
          <NotepadView />
        ) : (
          <>
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative bg-transparent scroll-smooth custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} // Quicker yet smoother
                  className="p-6 md:p-10 lg:p-12 w-full max-w-7xl mx-auto"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </main>
          </>
        )}
      </div>
      <StatusBar />
    </div>
  );
}


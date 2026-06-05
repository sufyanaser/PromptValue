import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './app/app-provider';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { PromptsPage } from './features/prompts/PromptsPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { FavoritesPage } from './features/favorites/FavoritesPage';
import { CategoriesPage } from './features/categories/CategoriesPage';
import { TagsPage } from './features/tags/TagsPage';
import { AdvancedSearchPage } from './features/search/AdvancedSearchPage';
import { ImportExportPage } from './features/import-export/ImportExportPage';
import { BackupsPage } from './features/backups/BackupsPage';
import { EditorPage } from './features/prompts/EditorPage';
import { PromptDetailsPage } from './features/prompts/PromptDetailsPage';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/prompts" element={<PromptsPage />} />
            <Route path="/prompts/:id" element={<PromptDetailsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/tags" element={<TagsPage />} />
            <Route path="/search" element={<AdvancedSearchPage />} />
            <Route path="/import-export" element={<ImportExportPage />} />
            <Route path="/backups" element={<BackupsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/editor/:id" element={<EditorPage />} />
          </Routes>
        </AppShell>
      </HashRouter>
    </AppProvider>
  );
}

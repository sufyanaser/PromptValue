import React, { useState } from 'react';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Search, Filter, LayoutGrid, List, MoreVertical, Copy, Edit, Star, Trash2, ExternalLink, Check, CopyPlus, Calendar, Shield, Activity, User, ArrowUpDown, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Link } from 'react-router-dom';

export function PromptsPage() {
  const { data, toggleFavorite, deletePrompt, duplicatePrompt, showToast, t, lang } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'usageCount' | 'title'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selected Prompt State for Preview Sidebar
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(
    data.prompts.length > 0 ? data.prompts[0].id : null
  );

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getTagStyle = (tagName: string) => {
    const found = data.tags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
    if (found) {
      return {
        backgroundColor: `${found.color}15`,
        color: found.color,
        borderColor: `${found.color}30`,
        borderWidth: '1px',
        borderStyle: 'solid' as const,
      };
    }
    return {};
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
    showToast(t('prompts.copiedToast'), 'success');
  };

  // Helper: Format relative dates
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return lang === 'ar' ? `اليوم، ${diffMins} د` : `Today, ${diffMins}m ago`;
    
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) return lang === 'ar' ? `اليوم، ${date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}` : `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return lang === 'ar' ? `أمس، ${date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}` : `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    
    return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US');
  };

  // 1. Filter Prompts
  let filteredPrompts = data.prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesTag = selectedTag === 'all' || p.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  // 2. Sort Prompts
  filteredPrompts.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'usageCount') {
      comparison = b.usageCount - a.usageCount;
    } else {
      comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return sortOrder === 'desc' ? comparison : -comparison;
  });

  const selectedPrompt = data.prompts.find(p => p.id === selectedPromptId) || filteredPrompts[0];

  const handleDuplicate = (id: string) => {
    duplicatePrompt(id);
    showToast(t('prompts.duplicateToast'), 'success');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('prompts.title')}
        subtitle={t('prompts.subtitle')}
      />

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white dark:bg-surface-dark rounded-2xl border border-border/40">
        <div>
          <label className="text-[10px] font-bold opacity-50 block mb-1">{t('prompts.filterCategory')}</label>
          <select 
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full h-10 px-3 bg-surface2-light dark:bg-surface2-dark border border-border/20 rounded-xl text-xs outline-none focus:border-accent cursor-pointer"
          >
            <option value="all">{t('prompts.allCategories')}</option>
            {data.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold opacity-50 block mb-1">{t('prompts.filterTag')}</label>
          <select 
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
            className="w-full h-10 px-3 bg-surface2-light dark:bg-surface2-dark border border-border/20 rounded-xl text-xs outline-none focus:border-accent cursor-pointer"
          >
            <option value="all">{t('prompts.allTags')}</option>
            {data.tags.map(t => <option key={t.id} value={t.name}>#{t.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="text-[10px] font-bold opacity-50 block mb-1">{t('prompts.sortBy')}</label>
            <select 
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full h-10 px-3 bg-surface2-light dark:bg-surface2-dark border border-border/20 rounded-xl text-xs outline-none focus:border-accent cursor-pointer"
            >
              <option value="updatedAt">{t('prompts.sortLastUpdated')}</option>
              <option value="usageCount">{t('prompts.sortMostUsed')}</option>
              <option value="title">{t('prompts.sortTitle')}</option>
            </select>
          </div>
          <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="h-10 w-10 bg-surface2-light dark:bg-surface2-dark border border-border/20 rounded-xl flex items-center justify-center hover:bg-border/20 transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-4 h-4 text-accent" />
          </button>
        </div>
        <div>
          <label className="text-[10px] font-bold opacity-50 block mb-1">{t('prompts.searchLabel')}</label>
          <div className="relative">
            <input
              type="text"
              placeholder={t('prompts.searchPlaceholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 ps-3 pe-9 bg-surface2-light dark:bg-surface2-dark border border-border/20 rounded-xl text-xs outline-none focus:border-accent"
            />
            <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          </div>
        </div>
      </div>

      {/* Main Content Layout with Preview Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Preview Sidebar */}
        {selectedPrompt && (
          <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-[96px] space-y-6">
            <Card className="border-accent/30 bg-white dark:bg-surface-dark overflow-hidden">
              <CardHeader 
                title={t('prompts.previewTitle')}
                subtitle={data.categories.find(c => c.id === selectedPrompt.categoryId)?.name || t('prompts.unclassified')}
                icon={() => (
                  <button onClick={() => toggleFavorite(selectedPrompt.id)} className="cursor-pointer">
                    <Star className={cn("w-5 h-5", selectedPrompt.isFavorite ? "text-accent fill-accent" : "text-border")} />
                  </button>
                )}
              />
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mb-2">{selectedPrompt.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {selectedPrompt.tags.map(t => {
                      const style = getTagStyle(t);
                      const hasColor = !!style.color;
                      return (
                        <span 
                          key={t} 
                          className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold", !hasColor && "bg-border/25")}
                          style={style}
                        >
                          #{t}
                        </span>
                      );
                    })}
                  </div>
                  <div className="p-4 bg-surface2-light dark:bg-surface2-dark rounded-xl border border-border/20 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-[160px] overflow-y-auto">
                    {selectedPrompt.content}
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-border/40 text-[11px] font-bold">
                  <div className="flex justify-between">
                    <span className="opacity-50 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t('prompts.lastUpdated')}</span>
                    <span>{formatTime(selectedPrompt.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-50 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {t('prompts.dateCreated')}</span>
                    <span>{new Date(selectedPrompt.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-50 flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> {t('prompts.usages')}</span>
                    <span>{t('dashboard.timesCount').replace('{count}', selectedPrompt.usageCount.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-50 flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> {t('prompts.statusLabel')}</span>
                    <span className="text-success font-black">{t('prompts.statusActive')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-50 flex items-center gap-1"><User className="w-3.5 h-3.5" /> {t('prompts.ownerLabel')}</span>
                    <span>{selectedPrompt.author || t('prompts.ownerMe')}</span>
                  </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/40">
                  <Link 
                    to={`/editor/${selectedPrompt.id}`}
                    className="flex flex-col items-center justify-center py-2 px-1 bg-surface2-light dark:bg-surface2-dark hover:bg-info/10 hover:text-info rounded-xl border border-transparent transition-all text-[10px] font-bold"
                  >
                    <Edit className="w-4 h-4 mb-1" />
                    {t('prompts.actionEdit')}
                  </Link>
                  <button 
                    onClick={() => handleCopy(selectedPrompt.id, selectedPrompt.content)}
                    className="flex flex-col items-center justify-center py-2 px-1 bg-surface2-light dark:bg-surface2-dark hover:bg-accent/10 hover:text-accent rounded-xl border border-transparent transition-all text-[10px] font-bold cursor-pointer"
                  >
                    {copiedId === selectedPrompt.id ? <Check className="w-4 h-4 text-success mb-1" /> : <Copy className="w-4 h-4 mb-1" />}
                    {t('prompts.actionCopy')}
                  </button>
                  <button 
                    onClick={() => handleDuplicate(selectedPrompt.id)}
                    className="flex flex-col items-center justify-center py-2 px-1 bg-surface2-light dark:bg-surface2-dark hover:bg-success/10 hover:text-success rounded-xl border border-transparent transition-all text-[10px] font-bold cursor-pointer"
                  >
                    <CopyPlus className="w-4 h-4 mb-1" />
                    {t('prompts.actionDuplicate')}
                  </button>
                </div>

                <Link 
                  to={`/prompts/${selectedPrompt.id}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl text-xs font-black shadow-md shadow-accent/10 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t('prompts.actionFullVersion')}
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Right Panel: Prompts List/Grid */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black opacity-60 font-mono">
              {t('prompts.promptsCount').replace('{count}', filteredPrompts.length.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'))}
            </span>
            <div className="flex items-center gap-1 p-1 bg-surface2-light dark:bg-surface2-dark rounded-xl">
              <button
                onClick={() => setViewMode('list')}
                className={cn("p-1.5 rounded-lg transition-all cursor-pointer", viewMode === 'list' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-40")}
              >
                <List className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn("p-1.5 rounded-lg transition-all cursor-pointer", viewMode === 'grid' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-40")}
              >
                <LayoutGrid className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <Card className="overflow-hidden bg-white dark:bg-surface-dark border-border/40">
              <div className="overflow-x-auto">
                <table className="w-full text-start border-collapse">
                  <thead>
                    <tr className="bg-surface2-light dark:bg-surface2-dark text-[11px] font-black uppercase tracking-wider text-muted-light dark:text-muted-dark border-b border-border/40">
                      <th className="px-6 py-4">{t('sidebar.prompts')}</th>
                      <th className="px-6 py-4">{t('prompts.filterCategory')}</th>
                      <th className="px-6 py-4">{t('prompts.filterTag')}</th>
                      <th className="px-6 py-4">{t('prompts.sortLastUpdated')}</th>
                      <th className="px-6 py-4">{t('prompts.usages')}</th>
                      <th className="px-6 py-4 text-center">{t('sidebar.favorites')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredPrompts.map(prompt => {
                      const isSelected = prompt.id === selectedPrompt?.id;
                      return (
                        <tr 
                          key={prompt.id} 
                          onClick={() => setSelectedPromptId(prompt.id)}
                          className={cn(
                            "hover:bg-surface2-light/30 dark:hover:bg-surface2-dark/30 transition-colors cursor-pointer group border-s-2",
                            isSelected ? "border-s-accent bg-accent/[0.02]" : "border-s-transparent"
                          )}
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold leading-none mb-1 text-slate-800 dark:text-slate-100">{prompt.title}</span>
                              <span className="text-[10px] opacity-40 font-bold truncate max-w-[200px]">{prompt.content}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-accent/10 text-accent">
                              {data.categories.find(c => c.id === prompt.categoryId)?.name || t('prompts.unclassified')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1">
                              {prompt.tags.slice(0, 2).map(tag => {
                                const style = getTagStyle(tag);
                                const hasColor = !!style.color;
                                return (
                                  <span 
                                    key={tag} 
                                    className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold", !hasColor && "bg-border/20")}
                                    style={style}
                                  >
                                    #{tag}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[10px] font-bold opacity-60">
                            {formatTime(prompt.updatedAt)}
                          </td>
                          <td className="px-6 py-4 text-[10px] font-bold opacity-60 flex items-center gap-1.5 py-6">
                            <Activity className="w-3.5 h-3.5 text-accent opacity-50" />
                            {prompt.usageCount}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleFavorite(prompt.id); }}
                              className={cn("transition-colors cursor-pointer", prompt.isFavorite ? "text-accent" : "text-border opacity-30 hover:opacity-100")}
                            >
                              <Star className={cn("w-4.5 h-4.5", prompt.isFavorite && "fill-accent")} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredPrompts.length === 0 && (
                  <div className="py-20 text-center opacity-40 italic font-medium">{t('prompts.noResults')}</div>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPrompts.map(prompt => {
                const isSelected = prompt.id === selectedPrompt?.id;
                return (
                  <div 
                    key={prompt.id} 
                    onClick={() => setSelectedPromptId(prompt.id)}
                    className="w-full"
                  >
                    <Card 
                      className={cn(
                        "group hover:shadow-xl transition-all cursor-pointer border",
                        isSelected ? "border-accent ring-1 ring-accent" : "border-border/40"
                      )}
                    >
                      <CardHeader
                        title={prompt.title}
                        subtitle={data.categories.find(c => c.id === prompt.categoryId)?.name || t('prompts.unclassified')}
                        icon={() => (
                          <button onClick={(e) => { e.stopPropagation(); toggleFavorite(prompt.id); }} className="cursor-pointer">
                            <Star className={cn("w-5 h-5", prompt.isFavorite ? "text-accent fill-accent" : "text-border")} />
                          </button>
                        )}
                      />
                      <CardContent>
                        <p className="text-xs text-muted-light dark:text-muted-dark line-clamp-3 mb-6 font-medium leading-relaxed">
                          {prompt.content}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-border/40">
                          <div className="flex gap-1">
                            {prompt.tags.map(tag => {
                              const style = getTagStyle(tag);
                              const hasColor = !!style.color;
                              return (
                                <span 
                                  key={tag} 
                                  className={cn("px-2 py-0.5 rounded-md text-[9px] font-bold", !hasColor && "bg-surface2-light dark:bg-surface2-dark")}
                                  style={style}
                                >
                                  #{tag}
                                </span>
                              );
                            })}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleCopy(prompt.id, prompt.content); }}
                              className="p-2 bg-surface2-light dark:bg-surface2-dark rounded-xl hover:text-accent transition-colors cursor-pointer"
                            >
                              {copiedId === prompt.id ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination UI matching Image 2 */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark border border-border/40 rounded-2xl text-xs font-bold">
            <span className="opacity-50">
              {t('prompts.showing')
                .replace('{count}', String(filteredPrompts.length))
                .replace('{total}', String(filteredPrompts.length))
              }
            </span>
            <div className="flex items-center gap-1.5">
              <button className="p-1 rounded-lg border border-border/40 opacity-40 cursor-pointer">
                <ChevronRight className={cn("w-4 h-4", lang === 'en' && "rotate-180")} />
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-accent text-white shadow-sm cursor-pointer">1</button>
              <button className="p-1 rounded-lg border border-border/40 opacity-40 cursor-pointer">
                <ChevronLeft className={cn("w-4 h-4", lang === 'en' && "rotate-180")} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Search, Filter, RefreshCw, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/ui/EmptyState';

export function AdvancedSearchPage() {
  const { data, t, lang } = useApp();
  const [filters, setFilters] = useState({
    query: '',
    categoryId: 'all',
    status: 'all',
    onlyFavorites: false
  });

  const results = data.prompts.filter(p => {
    const matchesQuery = p.title.toLowerCase().includes(filters.query.toLowerCase()) || 
                         p.content.toLowerCase().includes(filters.query.toLowerCase());
    const matchesCategory = filters.categoryId === 'all' || p.categoryId === filters.categoryId;
    const matchesStatus = filters.status === 'all' || p.status === filters.status;
    const matchesFavorites = !filters.onlyFavorites || p.isFavorite;
    return matchesQuery && matchesCategory && matchesStatus && matchesFavorites;
  });

  return (
    <div className="space-y-10" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('search.title')}
        subtitle={t('search.subtitle')}
      />

      <Card variant="surface">
        <CardContent className="pt-8">
           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-5">
                <Input
                  label={t('search.keywordLabel')}
                  placeholder={t('search.keywordPlaceholder')}
                  value={filters.query}
                  onChange={e => setFilters({ ...filters, query: e.target.value })}
                />
              </div>
              <div className="md:col-span-3">
                <Select
                  label={t('search.categoryLabel')}
                  value={filters.categoryId}
                  onChange={e => setFilters({ ...filters, categoryId: e.target.value })}
                  options={[
                    { value: 'all', label: t('common.all') },
                    ...data.categories.map(c => ({ value: c.id, label: c.name }))
                  ]}
                />
              </div>
              <div className="md:col-span-2">
                 <Select
                    label={t('search.statusLabel')}
                    value={filters.status}
                    onChange={e => setFilters({ ...filters, status: e.target.value })}
                    options={[
                      { value: 'all', label: t('common.all') },
                      { value: 'active', label: t('search.statusActive') },
                      { value: 'archived', label: t('search.statusArchived') },
                    ]}
                 />
              </div>
              <div className="md:col-span-2 flex items-center justify-between pb-3 pe-2">
                  <span className="text-[10px] font-black opacity-60">{t('search.onlyFavorites')}</span>
                  <button
                    onClick={() => setFilters({ ...filters, onlyFavorites: !filters.onlyFavorites })}
                    className={`w-4 h-4 rounded border transition-colors ${filters.onlyFavorites ? 'bg-accent border-accent text-white' : 'border-border/40'}`}
                  >
                    {filters.onlyFavorites && <span className="text-[10px]">✓</span>}
                  </button>
              </div>
           </div>
           
           <div className="flex justify-end mt-8 gap-4">
              <Button variant="ghost" size="sm" onClick={() => setFilters({ query: '', categoryId: 'all', status: 'all', onlyFavorites: false })}>
                 <RefreshCw className="w-3 h-3 me-2" />
                 {t('search.resetBtn')}
              </Button>
              <Button size="sm">
                 <Search className="w-4 h-4 me-2" />
                 {t('search.searchBtn')}
              </Button>
           </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-black opacity-40 ps-2">{t('search.resultsTitle')} ({results.length})</h3>
        <Card>
           {results.length === 0 ? (
             <EmptyState
               icon={Search}
               title={t('emptyStates.noSearchResultsTitle')}
               description={t('emptyStates.noSearchResultsDesc')}
               actionLabel={t('search.resetBtn')}
               onAction={() => setFilters({ query: '', categoryId: 'all', status: 'all', onlyFavorites: false })}
             />
           ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-start border-collapse">
                   <thead>
                     <tr className="bg-surface2-light dark:bg-surface2-dark text-[11px] font-black border-b border-border/40 uppercase">
                       <th className="px-6 py-4 text-start">{t('search.promptCol')}</th>
                       <th className="px-6 py-4 text-start">{t('search.categoryCol')}</th>
                       <th className="px-6 py-4 text-center">{t('search.actionsCol')}</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border/20">
                     {results.map(p => (
                       <tr key={p.id} className="hover:bg-surface2-light/30">
                          <td className="px-6 py-4 text-start">
                            <div className="flex items-center gap-3">
                              {p.isFavorite && <Star className="w-3 h-3 text-accent fill-accent" />}
                              <span className="text-sm font-bold">{p.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-start text-xs font-bold opacity-60">
                            {data.categories.find(c => c.id === p.categoryId)?.name || t('prompts.unclassified')}
                          </td>
                          <td className="px-6 py-4 text-center">
                             <Link to={`/prompts/${p.id}`}>
                               <button className="text-accent underline text-xs font-black">{t('search.openDetails')}</button>
                             </Link>
                          </td>
                       </tr>
                     ))}
                   </tbody>
                </table>
             </div>
           )}
        </Card>
      </div>
    </div>
  );
}

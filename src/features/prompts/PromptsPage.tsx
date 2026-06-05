import React, { useState } from 'react';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Search, Filter, LayoutGrid, List, MoreVertical, Copy, Edit, Star, Trash2, Archive, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Link } from 'react-router-dom';

export function PromptsPage() {
  const { data, toggleFavorite, deletePrompt } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrompts = data.prompts.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="البرومبتات"
        subtitle="إدارة واستعراض جميع البرومبتات المحفوظة في مكتبتك."
      />

      <div className="flex items-center justify-between p-2 bg-surface2-light dark:bg-surface2-dark rounded-2xl shadow-inner-sm">
        <div className="flex items-center gap-2 flex-1 px-4">
          <Search className="w-5 h-5 text-muted-light dark:text-muted-dark" />
          <input
            type="text"
            placeholder="ابحث في البرومبتات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm py-2"
          />
        </div>
        <div className="flex items-center gap-1 p-1">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "p-2 rounded-xl transition-all",
              viewMode === 'list' ? "bg-white dark:bg-surface-dark shadow-sm text-accent" : "text-muted-light dark:text-muted-dark hover:bg-white/50 dark:hover:bg-white/5"
            )}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              "p-2 rounded-xl transition-all",
              viewMode === 'grid' ? "bg-white dark:bg-surface-dark shadow-sm text-accent" : "text-muted-light dark:text-muted-dark hover:bg-white/50 dark:hover:bg-white/5"
            )}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-surface2-light dark:bg-surface2-dark text-[11px] font-black uppercase tracking-wider text-muted-light dark:text-muted-dark border-b border-border/40">
                  <th className="px-6 py-4">البرومبت</th>
                  <th className="px-6 py-4">التصنيف</th>
                  <th className="px-6 py-4">الوسوم</th>
                  <th className="px-6 py-4">آخر تعديل</th>
                  <th className="px-6 py-4">الاستخدام</th>
                  <th className="px-6 py-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredPrompts.map(prompt => (
                  <tr key={prompt.id} className="hover:bg-surface2-light/30 dark:hover:bg-surface2-dark/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleFavorite(prompt.id)}
                          className={cn("transition-colors", prompt.isFavorite ? "text-accent" : "text-border group-hover:text-muted-light dark:group-hover:text-muted-dark")}
                        >
                          <Star className={cn("w-4 h-4", prompt.isFavorite && "fill-accent")} />
                        </button>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold leading-none mb-1">{prompt.title}</span>
                          <span className="text-[10px] opacity-40 font-bold truncate max-w-[200px]">{prompt.content}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-accent/10 text-accent">
                        {data.categories.find(c => c.id === prompt.categoryId)?.name || 'غير مصنف'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {prompt.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-border/20 text-[9px] font-bold">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold opacity-60">
                      {new Date(prompt.updatedAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold opacity-60">
                      {prompt.usageCount}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors"><Copy className="w-4 h-4" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-info/10 hover:text-info transition-colors"><Edit className="w-4 h-4" /></button>
                        <button
                          onClick={() => deletePrompt(prompt.id)}
                          className="p-1.5 rounded-lg hover:bg-danger/10 hover:text-danger transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPrompts.length === 0 && (
              <div className="py-20 text-center opacity-40 italic font-medium">لا توجد نتائج مطابقة لبحثك...</div>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPrompts.map(prompt => (
            <Card key={prompt.id} className="group hover:shadow-xl transition-all">
              <CardHeader
                title={prompt.title}
                subtitle={data.categories.find(c => c.id === prompt.categoryId)?.name}
                icon={() => (
                  <button onClick={() => toggleFavorite(prompt.id)}>
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
                    {prompt.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-surface2-light dark:bg-surface2-dark text-[9px] font-bold">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-surface2-light dark:bg-surface2-dark rounded-xl hover:text-accent transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-accent text-white rounded-xl shadow-md shadow-accent/20">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

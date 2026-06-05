import React from 'react';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Star, Copy, ExternalLink, Trash2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Link } from 'react-router-dom';

export function FavoritesPage() {
  const { data, toggleFavorite, deletePrompt, t } = useApp();
  
  const favoritePrompts = data.prompts.filter(p => p.isFavorite);

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('favorites.title')}
        subtitle={t('favorites.subtitle')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoritePrompts.map(prompt => (
          <Card key={prompt.id} className="group hover:shadow-xl transition-all border-accent/20">
            <CardHeader
              title={prompt.title}
              subtitle={data.categories.find(c => c.id === prompt.categoryId)?.name}
              icon={() => (
                <button onClick={() => toggleFavorite(prompt.id)} className="cursor-pointer">
                   <Star className="w-5 h-5 text-accent fill-accent" />
                </button>
              )}
            />
            <CardContent>
              <p className="text-xs text-muted-light dark:text-muted-dark line-clamp-3 mb-6 font-medium leading-relaxed">
                {prompt.content}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div className="flex gap-1">
                  {prompt.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-surface2-light dark:bg-surface2-dark text-[9px] font-bold">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                   <Link to={`/prompts/${prompt.id}`}>
                    <button className="p-2 bg-accent text-white rounded-xl shadow-md shadow-accent/20 cursor-pointer">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {favoritePrompts.length === 0 && (
          <div className="col-span-full py-32 text-center flex flex-col items-center gap-4">
             <Star className="w-16 h-16 opacity-10" />
             <p className="text-muted-light font-bold">{t('favorites.noFavorites')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

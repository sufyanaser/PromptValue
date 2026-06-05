import React from 'react';
import { cn } from '../../lib/cn';
import { LayoutDashboard, Star, Palette, Hash, Clock, FileText, TrendingUp, History, Sparkles, ChevronLeft, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { data, t, lang } = useApp();

  const stats = [
    { label: t('dashboard.totalPrompts'), value: data.prompts.length.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'), subLabel: t('dashboard.promptsSaved'), icon: FileText, color: 'text-info' },
    { label: t('dashboard.favorites'), value: data.prompts.filter(p => p.isFavorite).length.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'), subLabel: t('dashboard.promptsFavorited'), icon: Star, color: 'text-accent' },
    { label: t('dashboard.categories'), value: data.categories.length.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'), subLabel: t('dashboard.categoriesActive'), icon: Palette, color: 'text-success' },
    { label: t('dashboard.tags'), value: data.tags.length.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'), subLabel: t('dashboard.tagsUsed'), icon: Hash, color: 'text-danger' },
  ];

  // Most used: sorted by usageCount desc
  const mostUsed = [...data.prompts].sort((a, b) => b.usageCount - a.usageCount).slice(0, 5);

  // Recent prompts: sorted by createdAt desc
  const recentCreated = [...data.prompts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  // Recent edits: sorted by updatedAt desc
  const recentEdits = [...data.prompts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  // Format date relative or exact for Arabic/English
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return lang === 'ar' ? `اليوم، منذ ${diffMins} د` : `Today, ${diffMins}m ago`;
    
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return lang === 'ar' 
        ? `اليوم، ${date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}` 
        : `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    if (isYesterday) {
      return lang === 'ar' 
        ? `أمس، ${date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}` 
        : `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US');
  };

  return (
    <div className="space-y-10">
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden bg-white dark:bg-surface-dark border-border/40">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-start">
                  <p className="text-xs font-bold opacity-60 mb-1">{stat.label}</p>
                  <div className={cn("text-3xl font-black", stat.color)}>{stat.value}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-surface2-light dark:bg-surface2-dark flex items-center justify-center">
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
              </div>
              <p className="text-[10px] opacity-40 font-bold">{stat.subLabel}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Most Used Panel */}
        <Card className="bg-white dark:bg-surface-dark border-border/40">
          <CardHeader 
            title={t('dashboard.mostUsed')} 
            subtitle={t('dashboard.mostUsedSub')}
            icon={TrendingUp}
          />
          <CardContent>
            <div className="space-y-4">
              {mostUsed.map((prompt) => (
                <Link 
                  key={prompt.id} 
                  to={`/prompts/${prompt.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface2-light dark:hover:bg-surface2-dark transition-colors cursor-pointer group"
                >
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-accent transition-colors">{prompt.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black opacity-60">
                      {t('dashboard.timesCount').replace('{count}', prompt.usageCount.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'))}
                    </span>
                    <ChevronLeft className={cn("w-4 h-4 opacity-0 group-hover:opacity-40 transition-all", lang === 'en' && "rotate-180")} />
                  </div>
                </Link>
              ))}
              <div className="pt-2 border-t border-border/30 text-center">
                <Link to="/prompts" className="inline-flex items-center gap-1 text-xs font-black text-accent hover:underline">
                  {t('dashboard.viewAllMostUsed')}
                  <ChevronLeft className={cn("w-4 h-4", lang === 'en' && "rotate-180")} />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Prompts Panel */}
        <Card className="bg-white dark:bg-surface-dark border-border/40">
          <CardHeader 
            title={t('dashboard.recentPrompts')} 
            subtitle={t('dashboard.recentPromptsSub')}
            icon={FileText}
          />
          <CardContent>
            <div className="space-y-4">
              {recentCreated.map((prompt) => (
                <Link 
                  key={prompt.id} 
                  to={`/prompts/${prompt.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface2-light dark:hover:bg-surface2-dark transition-colors cursor-pointer group"
                >
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-accent transition-colors">{prompt.title}</span>
                  <span className="text-[10px] opacity-40 font-bold font-mono">{new Date(prompt.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                </Link>
              ))}
              <div className="pt-2 border-t border-border/30 text-center">
                <Link to="/prompts" className="inline-flex items-center gap-1 text-xs font-black text-accent hover:underline">
                  {t('dashboard.viewAllPrompts')}
                  <ChevronLeft className={cn("w-4 h-4", lang === 'en' && "rotate-180")} />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Edits Panel */}
        <Card className="bg-white dark:bg-surface-dark border-border/40">
          <CardHeader 
            title={t('dashboard.recentEdits')} 
            subtitle={t('dashboard.recentEditsSub')}
            icon={Clock}
          />
          <CardContent>
            <div className="space-y-4">
              {recentEdits.map((prompt) => (
                <Link 
                  key={prompt.id} 
                  to={`/prompts/${prompt.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface2-light dark:hover:bg-surface2-dark transition-colors cursor-pointer group"
                >
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-accent transition-colors">{prompt.title}</span>
                  <span className="text-[10px] opacity-40 font-bold font-mono">{formatTime(prompt.updatedAt)}</span>
                </Link>
              ))}
              <div className="pt-2 border-t border-border/30 text-center">
                <Link to="/prompts" className="inline-flex items-center gap-1 text-xs font-black text-accent hover:underline">
                  {t('dashboard.viewAllPrompts')}
                  <ChevronLeft className={cn("w-4 h-4", lang === 'en' && "rotate-180")} />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Panel */}
        <Card className="bg-white dark:bg-surface-dark border-border/40">
          <CardHeader 
            title={t('dashboard.recentActivity')} 
            subtitle={t('dashboard.recentActivitySub')}
            icon={History}
          />
          <CardContent>
            <div className="space-y-4">
              {data.activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex gap-4 items-start border-s-2 border-accent/20 ps-4 py-1">
                  <div className="flex-1">
                    <p className="text-xs font-bold leading-relaxed text-slate-700 dark:text-slate-200">{activity.label}</p>
                    <span className="text-[9px] opacity-40 font-bold font-mono">{formatTime(activity.createdAt)}</span>
                  </div>
                </div>
              ))}
              {data.activities.length === 0 && (
                <div className="py-12 text-center text-muted-light dark:text-muted-dark opacity-50 font-medium">
                  {t('dashboard.noActivity')}
                </div>
              )}
              <div className="pt-2 border-t border-border/30 text-center">
                <span className="inline-flex items-center gap-1 text-xs font-black text-accent cursor-pointer hover:underline">
                  {t('dashboard.viewAllActivity')}
                  <ChevronLeft className={cn("w-4 h-4", lang === 'en' && "rotate-180")} />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

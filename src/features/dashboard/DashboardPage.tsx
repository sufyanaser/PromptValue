import React from 'react';
import { cn } from '../../lib/cn';
import { LayoutDashboard, Star, Palette, Hash, Clock, FileText, TrendingUp, History, Sparkles, ChevronLeft, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { data } = useApp();

  const stats = [
    { label: 'إجمالي البرومبتات', value: data.prompts.length.toLocaleString('ar-EG'), subLabel: 'برومبت محفوظ', icon: FileText, color: 'text-info' },
    { label: 'المفضلة', value: data.prompts.filter(p => p.isFavorite).length.toLocaleString('ar-EG'), subLabel: 'برومبت مفضل', icon: Star, color: 'text-accent' },
    { label: 'التصنيفات', value: data.categories.length.toLocaleString('ar-EG'), subLabel: 'تصنيف نشط', icon: Palette, color: 'text-success' },
    { label: 'الوسوم', value: data.tags.length.toLocaleString('ar-EG'), subLabel: 'وسم مستخدم', icon: Hash, color: 'text-danger' },
  ];

  // Most used: sorted by usageCount desc
  const mostUsed = [...data.prompts].sort((a, b) => b.usageCount - a.usageCount).slice(0, 5);

  // Recent prompts: sorted by createdAt desc
  const recentCreated = [...data.prompts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  // Recent edits: sorted by updatedAt desc
  const recentEdits = [...data.prompts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  // Format date relative or exact for Arabic
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `اليوم، منذ ${diffMins} د`;
    
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return `اليوم، ${date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    if (isYesterday) {
      return `أمس، ${date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString('ar-EG');
  };

  return (
    <div className="space-y-10">
      <PageHeader
        title="لوحة التحكم"
        subtitle="نظرة تشغيلية سريعة على حالة مكتبة البرومبتات المحلية."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden bg-white dark:bg-surface-dark border-border/40">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-right">
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
            title="الأكثر استخداماً" 
            subtitle="البرومبتات الأكثر طلباً واستدعاءً في عملياتك."
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
                    <span className="text-xs font-mono font-black opacity-60">{prompt.usageCount} مرة</span>
                    <ChevronLeft className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity" />
                  </div>
                </Link>
              ))}
              <div className="pt-2 border-t border-border/30 text-center">
                <Link to="/prompts" className="inline-flex items-center gap-1 text-xs font-black text-accent hover:underline">
                  عرض جميع البرومبتات الأكثر استخداماً
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Prompts Panel */}
        <Card className="bg-white dark:bg-surface-dark border-border/40">
          <CardHeader 
            title="آخر البرومبتات" 
            subtitle="آخر الإضافات التي تمت إلى مكتبتك المحلية."
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
                  <span className="text-[10px] opacity-40 font-bold font-mono">{new Date(prompt.createdAt).toLocaleDateString('ar-EG')}</span>
                </Link>
              ))}
              <div className="pt-2 border-t border-border/30 text-center">
                <Link to="/prompts" className="inline-flex items-center gap-1 text-xs font-black text-accent hover:underline">
                  عرض جميع البرومبتات
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Edits Panel */}
        <Card className="bg-white dark:bg-surface-dark border-border/40">
          <CardHeader 
            title="آخر تعديل" 
            subtitle="آخر البرومبتات التي تم تحديثها مؤخراً."
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
                  عرض جميع البرومبتات
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Panel */}
        <Card className="bg-white dark:bg-surface-dark border-border/40">
          <CardHeader 
            title="النشاط الأخير" 
            subtitle="سجل العمليات والنشاطات الأخيرة على النظام."
            icon={History}
          />
          <CardContent>
            <div className="space-y-4">
              {data.activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex gap-4 items-start border-r-2 border-accent/20 pr-4 py-1">
                  <div className="flex-1">
                    <p className="text-xs font-bold leading-relaxed text-slate-700 dark:text-slate-200">{activity.label}</p>
                    <span className="text-[9px] opacity-40 font-bold font-mono">{formatTime(activity.createdAt)}</span>
                  </div>
                </div>
              ))}
              {data.activities.length === 0 && (
                <div className="py-12 text-center text-muted-light dark:text-muted-dark opacity-50 font-medium">
                  لا توجد نشاطات مسجلة حالياً.
                </div>
              )}
              <div className="pt-2 border-t border-border/30 text-center">
                <span className="inline-flex items-center gap-1 text-xs font-black text-accent cursor-pointer hover:underline">
                  عرض كل النشاطات
                  <ChevronLeft className="w-4 h-4" />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

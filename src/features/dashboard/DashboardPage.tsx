import React, { useState } from 'react';
import { cn } from '../../lib/cn';
import { LayoutDashboard, Star, Palette, Hash, Plus } from 'lucide-react';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { PromptEditorModal } from '../../components/prompts/PromptEditorModal';

export function DashboardPage() {
  const { data } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { label: 'إجمالي البرومبتات', value: data.prompts.length, icon: LayoutDashboard, color: 'text-info' },
    { label: 'المفضلة', value: data.prompts.filter(p => p.isFavorite).length, icon: Star, color: 'text-accent' },
    { label: 'التصنيفات', value: data.categories.length, icon: Palette, color: 'text-success' },
    { label: 'الوسوم', value: data.tags.length, icon: Hash, color: 'text-danger' },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title="لوحة التحكم"
        subtitle="نظرة تشغيلية سريعة على حالة مكتبة البرومبتات المحلية."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إضافة برومبت جديد" maxWidth="7xl">
         <PromptEditorModal onClose={() => setIsModalOpen(false)} />
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1 items-end order-2">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40 text-right">{stat.label}</span>
                  <div className={cn("text-5xl font-black", stat.color)}>{stat.value}</div>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 order-1",
                  stat.color.replace('text-', 'bg-') + '/10',
                  stat.color
                )}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader title="آخر البرومبتات" subtitle="آخر الإضافات التي تمت إلى مكتبتك." />
          <CardContent>
            <div className="space-y-4">
              {data.prompts.slice(0, 5).map(prompt => (
                <div key={prompt.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface2-light dark:hover:bg-surface2-dark transition-colors cursor-pointer group">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold truncate max-w-[200px]">{prompt.title}</span>
                    <span className="text-[10px] opacity-40 font-bold uppercase">{new Date(prompt.updatedAt).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {prompt.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-border/20 text-[10px] font-bold">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
              {data.prompts.length === 0 && (
                <div className="py-12 text-center text-muted-light dark:text-muted-dark opacity-50 font-medium">
                  لا توجد برومبتات مضافة حالياً.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="النشاط الأخير" subtitle="سجل العمليات التي تمت على المنصة." />
          <CardContent>
            <div className="space-y-6">
              {data.activities.length > 0 ? data.activities.map(activity => (
                <div key={activity.id} className="flex gap-4 items-start border-r-2 border-accent/20 pr-4">
                  <div className="flex-1">
                    <p className="text-xs font-bold leading-relaxed">{activity.label}</p>
                    <span className="text-[10px] opacity-40 font-bold uppercase">{new Date(activity.createdAt).toLocaleTimeString('ar-EG')}</span>
                  </div>
                </div>
              )) : (
                 <div className="py-12 text-center text-muted-light dark:text-muted-dark opacity-50 font-medium">
                  لا توجد نشاطات مسجلة.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

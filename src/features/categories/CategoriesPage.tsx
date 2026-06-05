import React from 'react';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Palette, Plus, Search, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../../components/ui/Button';

export function CategoriesPage() {
  const { data } = useApp();

  return (
    <div className="space-y-10">
      <PageHeader
        title="التصنيفات"
        subtitle="إدارة وتصنيف البرومبتات لتنظيم المحتوى بسهولة والوصول للمجالات المطلوبة."
        actions={
          <Button>
            <Plus className="w-4 h-4 ml-2" />
            تصنيف جديد
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {data.categories.map(cat => (
           <Card key={cat.id} className="hover:scale-[1.02] transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                   <div className="w-10 h-10 rounded-xl flex items-center justify-center opacity-20" style={{ backgroundColor: cat.color }}>
                      <Palette className="w-5 h-5" style={{ color: cat.color }} />
                   </div>
                   <button className="p-1.5 opacity-40 hover:opacity-100 transition-opacity"><MoreVertical className="w-4 h-4" /></button>
                </div>
                <h3 className="text-lg font-black mb-1">{cat.name}</h3>
                <p className="text-xs text-muted-light font-medium mb-4 line-clamp-2 h-8">{cat.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                   <span className="text-[10px] font-black uppercase text-accent">{cat.promptCount} برومبت</span>
                   <span className="text-[10px] opacity-40 font-bold">{new Date(cat.updatedAt).toLocaleDateString('ar-EG')}</span>
                </div>
              </CardContent>
           </Card>
         ))}
      </div>

      <Card>
        <CardHeader title="إدارة التصنيفات" />
        <div className="overflow-x-auto">
           <table className="w-full text-right">
              <thead>
                <tr className="bg-surface2-light dark:bg-surface2-dark text-[11px] font-black tracking-widest text-muted-light border-b border-border/40 uppercase">
                  <th className="px-6 py-4">الاسم</th>
                  <th className="px-6 py-4">الوصف</th>
                  <th className="px-6 py-4">عدد البرومبتات</th>
                  <th className="px-6 py-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {data.categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-surface2-light/30">
                    <td className="px-6 py-4 flex items-center gap-3">
                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                       <span className="text-sm font-bold">{cat.name}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium opacity-60">
                      {cat.description}
                    </td>
                    <td className="px-6 py-4 text-xs font-black">
                      {cat.promptCount}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                         <button className="p-1.5 rounded-lg hover:bg-info/10 text-info transition-all"><Edit className="w-4 h-4" /></button>
                         <button className="p-1.5 rounded-lg hover:bg-danger/10 text-danger transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </Card>
    </div>
  );
}

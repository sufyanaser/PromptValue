import React from 'react';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Hash, Plus, Tag, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function TagsPage() {
  const { data } = useApp();

  return (
    <div className="space-y-8">
      <PageHeader
        title="الوسوم"
        subtitle="إدارة الوسوم وتتبع مدى استخدامها لتنظيم البرومبتات بشكل أفضل."
        actions={
          <Button>
            <Plus className="w-4 h-4 ml-2" />
            وسام جديد
          </Button>
        }
      />

      <div className="flex flex-wrap gap-4">
         {data.tags.map(tag => (
           <Card key={tag.id} className="min-w-[160px] hover:border-accent group">
             <CardContent className="pt-6 text-center">
               <div className="w-12 h-12 rounded-2xl bg-surface2-light mx-auto mb-4 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                  <Hash className="w-6 h-6 text-accent" />
               </div>
               <h4 className="font-black text-sm mb-1">{tag.name}</h4>
               <span className="text-[10px] font-black opacity-50 uppercase">{tag.usageCount} استخدام</span>
             </CardContent>
           </Card>
         ))}
      </div>

       <Card>
        <CardHeader title="كل الوسوم" />
        <div className="overflow-x-auto">
           <table className="w-full text-right">
              <thead>
                <tr className="bg-surface2-light dark:bg-surface2-dark text-[11px] font-black tracking-widest text-muted-light border-b border-border/40 uppercase">
                  <th className="px-6 py-4">الوسام</th>
                  <th className="px-6 py-4">اللون</th>
                  <th className="px-6 py-4">عدد الاستخدامات</th>
                  <th className="px-6 py-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {data.tags.map(tag => (
                  <tr key={tag.id} className="hover:bg-surface2-light/30">
                    <td className="px-6 py-4 text-sm font-bold">#{tag.name}</td>
                    <td className="px-6 py-4">
                       <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: tag.color }} />
                    </td>
                    <td className="px-6 py-4 text-xs font-black">{tag.usageCount}</td>
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

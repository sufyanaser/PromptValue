import React from 'react';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Import, Download, FileJson, FileText, CheckCircle2, History } from 'lucide-react';

export function ImportExportPage() {
  const { data } = useApp();

  return (
    <div className="space-y-10">
      <PageHeader
        title="استيراد وتصدير"
        subtitle="تحكم في بياناتك بسهولة، انقل مكتبتك من وإلى أي مكان آخر."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader title="استيراد البيانات" icon={Import} />
          <CardContent className="space-y-6">
            <div className="p-12 border-2 border-dashed border-border/40 rounded-3xl flex flex-col items-center justify-center gap-4 text-center bg-surface2-light dark:bg-surface2-dark/20 hover:border-accent/40 transition-colors">
                <FileJson className="w-12 h-12 text-accent opacity-20" />
                <div className="space-y-1">
                  <p className="text-sm font-black">اسحب وأفلت الملف هنا</p>
                  <p className="text-[10px] opacity-50 font-bold">JSON, Markdown, TXT, CSV</p>
                </div>
                <Button variant="secondary" size="sm">اختيار ملف</Button>
            </div>
            
            <div className="space-y-3">
               <h4 className="text-xs font-black opacity-50 px-1">خيارات الاستيراد</h4>
               <div className="space-y-2">
                  {['تخطي البرومبتات المكررة', 'تحديث البرومبتات الموجودة'].map((opt, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-surface2-light rounded-xl text-xs font-bold">
                       <span>{opt}</span>
                       <div className="w-4 h-4 rounded-full border border-accent bg-accent/10" />
                    </div>
                  ))}
               </div>
            </div>
            <Button className="w-full">بدء عملية الاستيراد</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="تصدير البيانات" icon={Download} />
          <CardContent className="space-y-6">
            <div className="space-y-4">
               <h4 className="text-xs font-black opacity-50 px-1">نطاق التصدير</h4>
               <div className="grid grid-cols-2 gap-2">
                  {['جميع البيانات', 'المفضلة فقط', 'تصنيف محدد', 'نتائج البحث'].map((scope, i) => (
                    <button key={i} className="p-3 text-xs font-bold bg-surface2-light dark:bg-surface2-dark rounded-xl border border-transparent hover:border-accent hover:text-accent transition-all">
                       {scope}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-xs font-black opacity-50 px-1">صيغة الملف</h4>
               <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'JSON', icon: FileJson },
                    { label: 'Markdown', icon: FileText },
                    { label: 'Excel', icon: FileText },
                  ].map((format, i) => (
                    <button key={i} className="flex flex-col items-center gap-2 p-4 bg-surface2-light dark:bg-surface2-dark rounded-2xl hover:border-accent border border-transparent transition-all">
                       <format.icon className="w-6 h-6 opacity-30" />
                       <span className="text-[10px] font-black">{format.label}</span>
                    </button>
                  ))}
               </div>
            </div>
            
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl">
               <p className="text-[10px] leading-relaxed opacity-60 font-medium">سيتم تصدير {data.prompts.length} برومبت مع كامل الميتاداتا والوسوم الخاصة بها.</p>
            </div>

            <Button className="w-full" variant="success">تصدير الملف المختار</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

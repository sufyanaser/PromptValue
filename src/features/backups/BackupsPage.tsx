import React from 'react';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { History, Shield, Cloud, HardDrive, RefreshCw, Trash2, CheckCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export function BackupsPage() {
  const { data, createBackup, restoreBackup, deleteBackup, showToast, confirm } = useApp();

  const handleCreateBackup = () => {
    createBackup('manual');
    showToast('تم إنشاء نسخة احتياطية جديدة بنجاح!', 'success');
  };

  const handleRestore = (id: string) => {
    confirm({
      title: 'استعادة النسخة الاحتياطية',
      message: 'هل أنت متأكد من رغبتك في استعادة هذه النسخة الاحتياطية؟ سيتم استبدال البيانات الحالية بالبيانات المحفوظة في هذه النسخة.',
      type: 'warning',
      confirmText: 'استعادة',
      cancelText: 'إلغاء',
      onConfirm: () => {
        restoreBackup(id);
        showToast('تم استعادة النسخة الاحتياطية بنجاح!', 'success');
      }
    });
  };

  const handleDelete = (id: string) => {
    confirm({
      title: 'حذف النسخة الاحتياطية',
      message: 'هل أنت متأكد من رغبتك في حذف هذه النسخة الاحتياطية؟',
      type: 'danger',
      confirmText: 'حذف',
      cancelText: 'إلغاء',
      onConfirm: () => {
        deleteBackup(id);
      }
    });
  };

  return (
    <div className="space-y-10">
      <PageHeader
        title="النسخ الاحتياطي"
        subtitle="إدارة نسخ احتياطية لبياناتك واستعادتها من أي فقدان لضمان أمان مكتبتك."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2">
            <CardHeader title="سجل النسخ الاحتياطية" subtitle="جميع النسخ الاحتياطية التي تم إنشاؤها" />
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                 <thead>
                   <tr className="bg-surface2-light dark:bg-surface2-dark text-[11px] font-black uppercase text-muted-light dark:text-muted-dark border-b border-border/40">
                     <th className="px-6 py-4">التاريخ</th>
                     <th className="px-6 py-4">النوع</th>
                     <th className="px-6 py-4">الحجم</th>
                     <th className="px-6 py-4">الحالة</th>
                     <th className="px-6 py-4 text-center">الإجراءات</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border/20">
                    {data.backups.map((b) => (
                      <tr key={b.id} className="hover:bg-surface2-light/30">
                         <td className="px-6 py-4 text-xs font-bold font-mono">
                            {new Date(b.createdAt).toLocaleString('ar-EG')}
                         </td>
                         <td className="px-6 py-4 text-xs font-medium">
                            {b.type === 'auto' ? 'تلقائي' : 'يدوي'}
                         </td>
                         <td className="px-6 py-4 text-[10px] font-black">{b.size}</td>
                         <td className="px-6 py-4">
                            <Badge variant={b.status === 'success' ? 'success' : 'danger'}>
                              {b.status === 'success' ? 'ناجحة' : 'فاشلة'}
                            </Badge>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                               <button onClick={() => handleRestore(b.id)} className="text-[10px] font-black text-accent underline">استعادة</button>
                               <button onClick={() => handleDelete(b.id)} className="text-[10px] font-black text-danger/60 hover:text-danger underline">حذف</button>
                            </div>
                         </td>
                      </tr>
                    ))}
                    {data.backups.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-xs opacity-50 italic">لا توجد نسخ احتياطية متوفرة حالياً.</td>
                      </tr>
                    )}
                 </tbody>
              </table>
            </div>
         </Card>

          <div className="space-y-6">
             <Card>
                <CardHeader title="إنشاء نسخة الآن" icon={Shield} />
                <CardContent className="space-y-4">
                   <p className="text-xs font-medium opacity-60 leading-relaxed">قم بإنشاء نسخة احتياطية فورية وحفظها في قاعدة البيانات المحلية لاستعادتها وقت الحاجة.</p>
                   <Button onClick={handleCreateBackup} className="w-full">تنفيذ النسخ اليدوي</Button>
                </CardContent>
             </Card>

             <Card variant="surface">
                <CardHeader title="إعدادات النسخ" />
                <CardContent className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">النسخ التلقائي</span>
                      <div className="w-10 h-5 bg-accent rounded-full flex items-center justify-end px-1 cursor-pointer">
                        <div className="w-3.5 h-3.5 bg-white rounded-full" />
                      </div>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">التكرار</span>
                      <span className="text-[10px] font-black bg-white dark:bg-surface2-dark px-2 py-1 rounded-lg">يومي</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">الاحتفاظ بآخر</span>
                      <span className="text-[10px] font-black bg-white dark:bg-surface2-dark px-2 py-1 rounded-lg">5 نسخ</span>
                   </div>
                </CardContent>
             </Card>
          </div>
      </div>
    </div>
  );
}

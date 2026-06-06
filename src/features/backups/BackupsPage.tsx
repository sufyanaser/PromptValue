import React from 'react';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { History, Shield, Cloud, HardDrive, RefreshCw, Trash2, CheckCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

export function BackupsPage() {
  const { data, createBackup, restoreBackup, deleteBackup, showToast, confirm, t, lang } = useApp();

  const handleCreateBackup = () => {
    createBackup('manual');
    showToast(t('backups.createSuccessToast'), 'success');
  };

  const handleRestore = (id: string) => {
    confirm({
      title: t('backups.restoreConfirmTitle'),
      message: t('backups.restoreConfirmMessage'),
      type: 'warning',
      confirmText: t('backups.restoreBtn'),
      cancelText: t('common.cancel'),
      onConfirm: () => {
        restoreBackup(id);
        showToast(t('backups.restoreSuccessToast'), 'success');
      }
    });
  };

  const handleDelete = (id: string) => {
    confirm({
      title: t('backups.deleteConfirmTitle'),
      message: t('backups.deleteConfirmMessage'),
      type: 'danger',
      confirmText: t('backups.deleteBtn'),
      cancelText: t('common.cancel'),
      onConfirm: () => {
        deleteBackup(id);
        showToast(t('backups.deleteSuccessToast'), 'success');
      }
    });
  };

  return (
    <div className="space-y-10" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('backups.title')}
        subtitle={t('backups.subtitle')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2">
            <CardHeader title={t('backups.historyTitle')} subtitle={t('backups.historySub')} />
            {data.backups.length === 0 ? (
              <EmptyState
                icon={History}
                title={t('emptyStates.noBackupsTitle')}
                description={t('emptyStates.noBackupsDesc')}
                actionLabel={t('emptyStates.createFirstBackupBtn')}
                onAction={handleCreateBackup}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start border-collapse">
                   <thead>
                     <tr className="bg-surface2-light dark:bg-surface2-dark text-[11px] font-black uppercase text-muted-light dark:text-muted-dark border-b border-border/40">
                       <th className="px-6 py-4 text-start">{t('backups.dateLabel')}</th>
                       <th className="px-6 py-4 text-start">{t('backups.typeLabel')}</th>
                       <th className="px-6 py-4 text-start">{t('backups.sizeLabel')}</th>
                       <th className="px-6 py-4 text-start">{t('backups.statusLabel')}</th>
                       <th className="px-6 py-4 text-center">{t('common.actions')}</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border/20">
                      {data.backups.map((b) => (
                        <tr key={b.id} className="hover:bg-surface2-light/30">
                           <td className="px-6 py-4 text-start text-xs font-bold font-mono">
                              {new Date(b.createdAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                           </td>
                           <td className="px-6 py-4 text-start text-xs font-medium">
                              {b.type === 'auto' ? t('backups.autoBackups') : t('backups.manualBackups')}
                           </td>
                           <td className="px-6 py-4 text-start text-[10px] font-black">{b.size}</td>
                           <td className="px-6 py-4 text-start">
                              <Badge variant={b.status === 'success' ? 'success' : 'danger'}>
                                {b.status === 'success' ? t('backups.successStatus') : t('backups.failStatus')}
                              </Badge>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                 <button onClick={() => handleRestore(b.id)} className="text-[10px] font-black text-accent underline">{t('backups.restoreBtn')}</button>
                                 <button onClick={() => handleDelete(b.id)} className="text-[10px] font-black text-danger/60 hover:text-danger underline">{t('backups.deleteBtn')}</button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              </div>
            )}
         </Card>

          <div className="space-y-6">
             <Card>
                <CardHeader title={t('backups.createNowTitle')} icon={Shield} />
                <CardContent className="space-y-4">
                   <p className="text-xs font-medium opacity-60 leading-relaxed">{t('backups.createNowDesc')}</p>
                   <Button onClick={handleCreateBackup} className="w-full">{t('backups.runManualBackup')}</Button>
                </CardContent>
             </Card>

             <Card variant="surface">
                <CardHeader title={t('backups.settingsTitle')} />
                <CardContent className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{t('backups.settingsAuto')}</span>
                      <div className="w-10 h-5 bg-accent rounded-full flex items-center justify-end px-1 cursor-pointer">
                        <div className="w-3.5 h-3.5 bg-white rounded-full" />
                      </div>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{t('backups.settingsFrequency')}</span>
                      <span className="text-[10px] font-black bg-white dark:bg-surface2-dark px-2 py-1 rounded-lg">{t('backups.settingsFrequencyVal')}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{t('backups.settingsRetention')}</span>
                      <span className="text-[10px] font-black bg-white dark:bg-surface2-dark px-2 py-1 rounded-lg">{t('backups.settingsRetentionVal').replace('{count}', '5')}</span>
                   </div>
                </CardContent>
             </Card>
          </div>
      </div>
    </div>
  );
}

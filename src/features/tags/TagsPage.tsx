import React, { useState } from 'react';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Hash, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/cn';
import { EmptyState } from '../../components/ui/EmptyState';

import { getUniqueColor, PRESET_COLORS } from '../../lib/colors';

export function TagsPage() {
  const { data, addTag, updateTag, deleteTag, confirm, t, lang } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');

  const getUsageCount = (tagName: string) => {
    return data.prompts.filter(p => p.tags.includes(tagName)).length;
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    const uniqueColor = getUniqueColor(data.tags.map(t => t.color));
    setColor(uniqueColor);
    setIsModalOpen(true);
  };

  const openEditModal = (tag: any) => {
    setEditingId(tag.id);
    setName(tag.name);
    setColor(tag.color);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editingId) {
      updateTag(editingId, { name, color });
    } else {
      addTag({ name, color });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: t('tags.title'),
      message: t('common.deleteConfirmMessage'),
      type: 'danger',
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      onConfirm: () => {
        deleteTag(id);
      }
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('tags.title')}
        subtitle={t('tags.subtitle')}
        actions={
          <Button onClick={openCreateModal} className="cursor-pointer">
            <Plus className="w-4 h-4 ml-2" />
            {t('tags.newTag')}
          </Button>
        }
      />

      {data.tags.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={Hash}
            title={t('emptyStates.noTagsTitle')}
            description={t('emptyStates.noTagsDesc')}
            actionLabel={t('emptyStates.createFirstTagBtn')}
            onAction={openCreateModal}
          />
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
             {data.tags.map(tag => {
               const usage = getUsageCount(tag.name);
               return (
                 <Card key={tag.id} className="min-w-[160px] hover:border-accent group relative overflow-hidden">
                   <CardContent className="pt-6 text-center">
                     <div className="absolute top-2 start-2 flex gap-1">
                       <button onClick={() => openEditModal(tag)} className="p-1 opacity-20 hover:opacity-100 text-info transition-opacity cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                       <button onClick={() => handleDelete(tag.id)} className="p-1 opacity-20 hover:opacity-100 text-danger transition-opacity cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                     </div>
                     <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:bg-accent/10 transition-colors" style={{ backgroundColor: `${tag.color}15` }}>
                        <Hash className="w-6 h-6" style={{ color: tag.color }} />
                     </div>
                     <h4 className="font-black text-sm mb-1">#{tag.name}</h4>
                     <span className="text-[10px] font-black opacity-50 uppercase">{usage} {t('tags.usageCount')}</span>
                   </CardContent>
                 </Card>
               );
             })}
          </div>

          <Card>
            <CardHeader title={t('tags.title')} />
            <div className="overflow-x-auto">
               <table className="w-full text-start">
                  <thead>
                    <tr className="bg-surface2-light dark:bg-surface2-dark text-[11px] font-black tracking-widest text-muted-light dark:text-muted-dark border-b border-border/40 uppercase">
                      <th className="px-6 py-4">{t('tags.nameLabel')}</th>
                      <th className="px-6 py-4">{t('categories.createdDate')}</th>
                      <th className="px-6 py-4">{t('tags.usageCount')}</th>
                      <th className="px-6 py-4 text-center">{t('categories.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {data.tags.map(tag => {
                      const usage = getUsageCount(tag.name);
                      return (
                        <tr key={tag.id} className="hover:bg-surface2-light/30">
                          <td className="px-6 py-4 text-sm font-bold">#{tag.name}</td>
                          <td className="px-6 py-4">
                             <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: tag.color }} />
                          </td>
                          <td className="px-6 py-4 text-xs font-black">{usage}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                               <button onClick={() => openEditModal(tag)} className="p-1.5 rounded-lg hover:bg-info/10 text-info transition-all cursor-pointer"><Edit className="w-4 h-4" /></button>
                               <button onClick={() => handleDelete(tag.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-danger transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
               </table>
            </div>
          </Card>
        </>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl border border-border/80 bg-surface-light dark:bg-surface-dark overflow-hidden">
            <CardHeader title={editingId ? t('tags.editTag') : t('tags.newTag')} />
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold opacity-60">{t('tags.nameLabel')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border/40 bg-surface2-light dark:bg-surface2-dark text-sm outline-none focus:border-accent"
                  placeholder={t('tags.tagNamePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold opacity-60">{t('categories.createdDate')}</label>
                <div className="flex flex-wrap gap-2">
                  {(PRESET_COLORS.includes(color) ? PRESET_COLORS : [...PRESET_COLORS, color]).map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all cursor-pointer",
                        color === c ? "border-accent scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="ghost" className="flex-1 cursor-pointer" onClick={() => setIsModalOpen(false)}>{t('common.cancel')}</Button>
                <Button className="flex-1 cursor-pointer" onClick={handleSave}>{t('common.save')}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

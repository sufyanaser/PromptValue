import React, { useState } from 'react';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Palette, Plus, Search, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

import { getUniqueColor, PRESET_COLORS } from '../../lib/colors';

export function CategoriesPage() {
  const { data, addCategory, updateCategory, deleteCategory, confirm, t, lang } = useApp();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');

  const getPromptCount = (catId: string) => {
    return data.prompts.filter(p => p.categoryId === catId).length;
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    const uniqueColor = getUniqueColor(data.categories.map(c => c.color));
    setColor(uniqueColor);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
    setColor(cat.color);
    setIsModalOpen(true);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'danger') => {
    const pv = (window as any).PromptVault;
    // Fallback if needed
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editingId) {
      updateCategory(editingId, { name, description, color });
      showToast(t('categories.successUpdate'), 'success');
    } else {
      addCategory({ name, description, color });
      showToast(t('categories.successAdd'), 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: t('categories.title'),
      message: t('common.deleteConfirmMessage'),
      type: 'danger',
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      onConfirm: () => {
        deleteCategory(id);
      }
    });
  };

  return (
    <div className="space-y-10">
      <PageHeader
        title={t('categories.title')}
        subtitle={t('categories.subtitle')}
        actions={
          <Button onClick={openCreateModal} className="cursor-pointer">
            <Plus className="w-4 h-4 ml-2" />
            {t('categories.newCategory')}
          </Button>
        }
      />

      {data.categories.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={Palette}
            title={t('emptyStates.noCategoriesTitle')}
            description={t('emptyStates.noCategoriesDesc')}
            actionLabel={t('emptyStates.createFirstCategoryBtn')}
            onAction={openCreateModal}
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {data.categories.map(cat => {
               const count = getPromptCount(cat.id);
               return (
                 <Card key={cat.id} className="hover:scale-[1.02] transition-all cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                         <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                            <Palette className="w-5 h-5" style={{ color: cat.color }} />
                         </div>
                         <div className="flex gap-1">
                            <button onClick={() => openEditModal(cat)} className="p-1.5 opacity-40 hover:opacity-100 text-info transition-opacity cursor-pointer"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(cat.id)} className="p-1.5 opacity-40 hover:opacity-100 text-danger transition-opacity cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      </div>
                      <h3 className="text-lg font-black mb-1">{cat.name}</h3>
                      <p className="text-xs text-muted-light dark:text-muted-dark font-medium mb-4 line-clamp-2 h-8">{cat.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-border/40">
                         <span className="text-[10px] font-black uppercase text-accent">{t('prompts.promptsCount').replace('{count}', count.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'))}</span>
                         <span className="text-[10px] opacity-40 font-bold">{new Date(cat.updatedAt || new Date()).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                      </div>
                    </CardContent>
                 </Card>
               );
             })}
          </div>

          <Card>
            <CardHeader title={t('categories.title')} />
            <div className="overflow-x-auto">
               <table className="w-full text-start">
                  <thead>
                    <tr className="bg-surface2-light dark:bg-surface2-dark text-[11px] font-black tracking-widest text-muted-light dark:text-muted-dark border-b border-border/40 uppercase">
                      <th className="px-6 py-4">{t('categories.nameLabel')}</th>
                      <th className="px-6 py-4">{t('categories.descLabel')}</th>
                      <th className="px-6 py-4">{t('categories.promptCount')}</th>
                      <th className="px-6 py-4 text-center">{t('categories.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {data.categories.map(cat => {
                      const count = getPromptCount(cat.id);
                      return (
                        <tr key={cat.id} className="hover:bg-surface2-light/30">
                          <td className="px-6 py-4 flex items-center gap-3">
                             <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                             <span className="text-sm font-bold">{cat.name}</span>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium opacity-60">
                            {cat.description}
                          </td>
                          <td className="px-6 py-4 text-xs font-black">
                            {count}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                               <button onClick={() => openEditModal(cat)} className="p-1.5 rounded-lg hover:bg-info/10 text-info transition-all cursor-pointer"><Edit className="w-4 h-4" /></button>
                               <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-danger transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
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
            <CardHeader title={editingId ? t('categories.editCategory') : t('categories.newCategory')} />
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold opacity-60">{t('categories.nameLabel')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border/40 bg-surface2-light dark:bg-surface2-dark text-sm outline-none focus:border-accent"
                  placeholder={t('categories.categoryNamePlaceholder')}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold opacity-60">{t('categories.descLabel')}</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-4 rounded-xl border border-border/40 bg-surface2-light dark:bg-surface2-dark text-sm outline-none focus:border-accent min-h-[80px]"
                  placeholder={t('categories.categoryDescPlaceholder')}
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

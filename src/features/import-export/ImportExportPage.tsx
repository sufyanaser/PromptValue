import React, { useState, useRef } from 'react';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Import, Download, FileJson, FileText } from 'lucide-react';

export function ImportExportPage() {
  const { data, updateData, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [exportScope, setExportScope] = useState<'all' | 'favorites'>('all');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  const handleImport = () => {
    if (!importFile) {
      showToast('يرجى اختيار ملف أولاً.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.prompts) {
          showToast('بنية الملف غير صالحة. يجب أن يحتوي الملف على قائمة البرومبتات.', 'danger');
          return;
        }

        // Merge categories
        const newCategories = [...data.categories];
        if (parsed.categories && Array.isArray(parsed.categories)) {
          parsed.categories.forEach((cat: any) => {
            if (!newCategories.some(c => c.id === cat.id || c.name.toLowerCase() === cat.name.toLowerCase())) {
              newCategories.push({
                id: cat.id || Math.random().toString(36).substr(2, 9),
                name: cat.name,
                description: cat.description || '',
                color: cat.color || '#3B82F6',
                promptCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
            }
          });
        }

        // Merge tags
        const newTags = [...data.tags];
        if (parsed.tags && Array.isArray(parsed.tags)) {
          parsed.tags.forEach((tag: any) => {
            if (!newTags.some(t => t.id === tag.id || t.name.toLowerCase() === tag.name.toLowerCase())) {
              newTags.push({
                id: tag.id || Math.random().toString(36).substr(2, 9),
                name: tag.name,
                color: tag.color || '#3B82F6',
                usageCount: 0
              });
            }
          });
        }

        // Merge prompts
        const newPrompts = [...data.prompts];
        let addedCount = 0;
        parsed.prompts.forEach((prompt: any) => {
          if (!newPrompts.some(p => p.title.toLowerCase() === prompt.title.toLowerCase())) {
            newPrompts.push({
              id: prompt.id || Math.random().toString(36).substr(2, 9),
              title: prompt.title,
              description: prompt.description || '',
              content: prompt.content,
              categoryId: prompt.categoryId || '',
              tags: Array.isArray(prompt.tags) ? prompt.tags : [],
              variables: Array.isArray(prompt.variables) ? prompt.variables : [],
              status: prompt.status || 'active',
              isFavorite: prompt.isFavorite || false,
              usageCount: prompt.usageCount || 0,
              createdAt: prompt.createdAt || new Date().toISOString(),
              updatedAt: prompt.updatedAt || new Date().toISOString(),
              version: prompt.version || 1
            });
            addedCount++;
          }
        });

        updateData({
          prompts: newPrompts,
          categories: newCategories,
          tags: newTags
        });

        showToast(`تم استيراد البيانات بنجاح! تم إضافة ${addedCount} برومبت جديد.`, 'success');
        setImportFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        console.error(err);
        showToast('فشل في قراءة الملف أو تحليله كملف JSON صالح.', 'danger');
      }
    };
    reader.readAsText(importFile);
  };

  const handleExport = () => {
    const promptsToExport = exportScope === 'favorites' 
      ? data.prompts.filter(p => p.isFavorite) 
      : data.prompts;

    const exportData = {
      prompts: promptsToExport,
      categories: data.categories,
      tags: data.tags
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `promptvault_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('تم تصدير الملف بنجاح!', 'success');
  };

  return (
    <div className="space-y-10">
      <PageHeader
        title="استيراد وتصدير"
        subtitle="تحكم في بياناتك بسهولة، انقل مكتبتك من وإلى أي مكان آخر."
      />

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".json" 
        className="hidden" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader title="استيراد البيانات" icon={Import} />
          <CardContent className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="p-12 border-2 border-dashed border-border/40 rounded-3xl flex flex-col items-center justify-center gap-4 text-center bg-surface2-light dark:bg-surface2-dark/20 hover:border-accent/40 transition-colors cursor-pointer"
            >
                <FileJson className="w-12 h-12 text-accent opacity-20" />
                <div className="space-y-1">
                  <p className="text-sm font-black">{importFile ? importFile.name : 'اضغط لاختيار ملف البيانات'}</p>
                  <p className="text-[10px] opacity-50 font-bold">يدعم فقط ملفات JSON المصدرة</p>
                </div>
                <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  {importFile ? 'تغيير الملف' : 'اختيار ملف'}
                </Button>
            </div>
            
            <div className="space-y-3">
               <h4 className="text-xs font-black opacity-50 px-1">خيارات الاستيراد</h4>
               <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-surface2-light dark:bg-surface2-dark/40 rounded-xl text-xs font-bold">
                     <span>تخطي البرومبتات المكررة (عبر العنوان)</span>
                     <div className="w-4 h-4 rounded-full border border-accent bg-accent/10 flex items-center justify-center">
                       <div className="w-2 h-2 bg-accent rounded-full" />
                     </div>
                  </div>
               </div>
            </div>
            <Button onClick={handleImport} className="w-full" disabled={!importFile}>بدء عملية الاستيراد</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="تصدير البيانات" icon={Download} />
          <CardContent className="space-y-6">
            <div className="space-y-4">
               <h4 className="text-xs font-black opacity-50 px-1">نطاق التصدير</h4>
               <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setExportScope('all')}
                    className={`p-3 text-xs font-bold rounded-xl border transition-all ${exportScope === 'all' ? 'border-accent bg-accent/5 text-accent' : 'border-transparent bg-surface2-light dark:bg-surface2-dark'}`}
                  >
                     جميع البيانات
                  </button>
                  <button 
                    onClick={() => setExportScope('favorites')}
                    className={`p-3 text-xs font-bold rounded-xl border transition-all ${exportScope === 'favorites' ? 'border-accent bg-accent/5 text-accent' : 'border-transparent bg-surface2-light dark:bg-surface2-dark'}`}
                  >
                     المفضلة فقط
                  </button>
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-xs font-black opacity-50 px-1">صيغة الملف</h4>
               <div className="grid grid-cols-1 gap-2">
                  <button className="flex items-center gap-3 p-4 bg-surface2-light dark:bg-surface2-dark rounded-2xl border border-accent text-accent">
                     <FileJson className="w-6 h-6 opacity-60" />
                     <div className="text-right">
                       <span className="text-xs font-black block">JSON Format</span>
                       <span className="text-[9px] opacity-60">تصدير كامل البيانات مدمجة للاستعادة لاحقاً</span>
                     </div>
                  </button>
               </div>
            </div>
            
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl">
               <p className="text-[10px] leading-relaxed opacity-60 font-medium">سيتم تصدير {exportScope === 'favorites' ? data.prompts.filter(p => p.isFavorite).length : data.prompts.length} برومبت مع كامل التصنيفات والوسوم الخاصة بها.</p>
            </div>

            <Button onClick={handleExport} className="w-full" variant="success">تصدير الملف المختار</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

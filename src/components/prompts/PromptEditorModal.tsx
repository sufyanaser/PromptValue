import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../app/app-provider';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Save, X, History, Variable, Info, CheckCircle2, Eye, Code, Layout, Languages, AlignRight, AlignLeft } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Prompt } from '../../types';
import Markdown from 'react-markdown';
import { MarkdownToolbar } from './MarkdownToolbar';

interface PromptEditorModalProps {
  promptId?: string;
  onClose: () => void;
}

export function PromptEditorModal({ promptId, onClose }: PromptEditorModalProps) {
  const { data, addPrompt, updatePrompt } = useApp();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const existingPrompt = promptId ? data.prompts.find(p => p.id === promptId) : null;

  const [formData, setFormData] = useState({
    title: existingPrompt?.title || '',
    categoryId: existingPrompt?.categoryId || (data.categories[0]?.id || ''),
    content: existingPrompt?.content || '',
    description: existingPrompt?.description || '',
    notes: existingPrompt?.notes || '',
    tags: existingPrompt?.tags.join(', ') || '',
    status: existingPrompt?.status || 'active',
    direction: 'rtl' as 'rtl' | 'ltr'
  });

  const [isSaved, setIsSaved] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');

  const variables = formData.content.match(/\{[^}]+\}/g)?.map(v => v.slice(1, -1)) || [];

  // Re-implementing a more robust categorization check as a utility or cleaner effect
  useEffect(() => {
    if (promptId || !formData.title) return;

    const text = formData.title.toLowerCase();
    const categories = data.categories;
    
    // Default system keyword map
    const keywordMap: Record<string, string[]> = {
      'programming': ['برمج', 'كود', 'python', 'script', 'برنامج'],
      'writing': ['محتوى', 'كتابة', 'مقالة', 'نص'],
      'marketing': ['تسويق', 'اعلان', 'سوق'],
      'translation': ['ترجم', 'لغة']
    };

    for (const [key, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(k => text.includes(k))) {
        const found = categories.find(c => 
          c.id.includes(key) || 
          keywords.some(kw => c.name.toLowerCase().includes(kw))
        );
        if (found && found.id !== formData.categoryId) {
          setFormData(prev => ({ ...prev, categoryId: found.id }));
          break;
        }
      }
    }
  }, [formData.title, data.categories, promptId]);

  const handleSave = () => {
    const promptData = {
      title: formData.title || 'بدون عنوان',
      description: formData.description,
      content: formData.content,
      categoryId: formData.categoryId,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: formData.status as any,
      notes: formData.notes,
      variables: variables,
      isFavorite: existingPrompt?.isFavorite || false,
      usageCount: existingPrompt?.usageCount || 0,
    };

    if (promptId) {
      updatePrompt(promptId, promptData);
    } else {
      addPrompt(promptData);
    }

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleInsertMarkdown = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = formData.content;
    const selectedText = text.substring(start, end);
    
    const newContent = 
      text.substring(0, start) + 
      prefix + 
      (selectedText || '') + 
      suffix + 
      text.substring(end);

    setFormData({ ...formData, content: newContent });

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = start + prefix.length + (selectedText.length || 0) + suffix.length;
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  const toggleDirection = () => {
    setFormData(prev => ({ ...prev, direction: prev.direction === 'rtl' ? 'ltr' : 'rtl' }));
  };

  return (
    <div className="flex flex-col min-h-full" dir="rtl">
      <div className="flex-1 px-8 py-10 md:px-16 md:py-20 space-y-12">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header Section: Title and Main Meta */}
          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[4px] opacity-30 pr-1 select-none">العنوان الأساسي</label>
              <input
                type="text"
                autoFocus
                placeholder="كيف سنسمي هذا الإبداع؟"
                className="w-full bg-transparent border-none text-4xl lg:text-7xl font-black outline-none placeholder:opacity-5 focus:ring-0 p-0 text-text-light dark:text-text-dark tracking-tight"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Select
                label="التصنيف الوظيفي"
                value={formData.categoryId}
                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                options={data.categories.map(c => ({ value: c.id, label: c.name }))}
                className="bg-accent/5 dark:bg-accent/10 border-none h-14 text-sm rounded-2xl"
              />
              <Input
                label="الوسوم والدلالات"
                placeholder="أدخل الوسوم..."
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                className="bg-accent/5 dark:bg-accent/10 border-none h-14 text-sm rounded-2xl"
              />
              <Select
                label="حالة البرومبت"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                options={[
                  { value: 'active', label: 'نشط' },
                  { value: 'draft', label: 'مسودة' },
                  { value: 'archived', label: 'مؤرشف' },
                ]}
                className="bg-accent/5 dark:bg-accent/10 border-none h-14 text-sm rounded-2xl"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">محرر النصوص المتقدم</span>
              </div>
              <div className="flex p-1 bg-surface2-light/50 dark:bg-surface2-dark/50 rounded-xl border border-border/10">
                 <button onClick={() => setViewMode('edit')} className={cn("px-5 py-2 rounded-lg text-[10px] font-black transition-all", viewMode === 'edit' ? "bg-accent text-white shadow-lg shadow-accent/20" : "opacity-40 hover:opacity-100")}>المحرر</button>
                 <button onClick={() => setViewMode('preview')} className={cn("px-5 py-2 rounded-lg text-[10px] font-black transition-all", viewMode === 'preview' ? "bg-accent text-white shadow-lg shadow-accent/20" : "opacity-40 hover:opacity-100")}>المعاينة</button>
              </div>
            </div>

            <div className="bg-surface2-light/20 dark:bg-surface2-dark/10 rounded-[3rem] border border-border/10 overflow-hidden min-h-[500px]">
               {viewMode === 'edit' ? (
                 <div className="flex flex-col h-full">
                    <MarkdownToolbar onInsert={handleInsertMarkdown} className="bg-transparent border-t-0 px-8 py-4 opacity-50 hover:opacity-100 transition-opacity" />
                    <div className="relative flex-1">
                      <Textarea
                        ref={textareaRef}
                        placeholder="ابدأ بكتابة تعليماتك البرمجية أو الإبداعية هنا..."
                        dir={formData.direction}
                        className={cn(
                          "flex-1 font-mono text-xl leading-[1.8] border-none rounded-none focus:border-none shadow-none bg-transparent p-12 min-h-[500px] resize-none",
                          formData.direction === 'rtl' ? "text-right" : "text-left"
                        )}
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                      />
                      <button onClick={toggleDirection} className="absolute bottom-10 left-10 p-3 rounded-2xl bg-surface2-light dark:bg-surface2-dark hover:bg-accent hover:text-white transition-all text-accent border border-border/20 shadow-xl" title="تغيير الاتجاه">
                        {formData.direction === 'rtl' ? <AlignRight className="w-5 h-5" /> : <AlignLeft className="w-5 h-5" />}
                      </button>
                    </div>
                 </div>
               ) : (
                 <div className="p-12 prose prose-xl dark:prose-invert max-w-none min-h-[500px]" dir={formData.direction}>
                    <Markdown>{formData.content || '_لا يوجد محتوى للمعاينة حالياً..._'}</Markdown>
                 </div>
               )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <Variable className="w-4 h-4 text-accent" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">المتغيرات المكتشفة</h4>
              </div>
              {variables.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                   {Array.from(new Set(variables)).map((v, i) => (
                     <Badge key={i} variant="accent" className="px-5 py-2.5 text-[10px] font-black rounded-xl shadow-sm border-none bg-accent/10 text-accent uppercase tracking-wider">{v}</Badge>
                   ))}
                </div>
              ) : (
                <p className="text-[11px] font-medium opacity-30 italic leading-relaxed">اكتب {'{variable}'} لاكتشاف المتغيرات تلقائياً...</p>
              )}
            </div>

            <div className="space-y-8">
               <div className="flex items-center gap-3">
                  <Info className="w-4 h-4 text-accent" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">التوصيف والملاحظات</h4>
               </div>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[2px] opacity-20 pr-1">وصف العمل</label>
                    <Textarea
                      placeholder="ما الذي يفعله هذا البرومبت بالضبط؟"
                      className="min-h-[100px] text-xs bg-accent/5 dark:bg-accent/5 border-none rounded-[1.5rem] p-6 focus:ring-2 focus:ring-accent/20"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[2px] opacity-20 pr-1">تعليمات الاستخدام</label>
                    <Textarea
                      placeholder="كيف يمكن الحصول على أفضل النتائج؟"
                      className="min-h-[100px] text-xs bg-accent/5 dark:bg-accent/5 border-none rounded-[1.5rem] p-6 focus:ring-2 focus:ring-accent/20"
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 px-12 py-8 border-t border-border/10 flex items-center justify-between bg-white/90 dark:bg-shell-dark/95 backdrop-blur-2xl z-50">
         <Button variant="ghost" onClick={onClose} size="lg" className="rounded-2xl font-black px-12 text-sm opacity-50 hover:opacity-100 transition-opacity">إلغاء الأمر</Button>
         <Button onClick={handleSave} loading={isSaved} size="lg" className="min-w-[280px] h-16 rounded-[1.25rem] shadow-2xl shadow-accent/20 font-black text-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
            {isSaved ? <CheckCircle2 className="w-6 h-6 ml-3" /> : <Save className="w-6 h-6 ml-3" />}
            {promptId ? 'تحديث البيانات' : 'حفظ في المكتبة'}
         </Button>
      </div>
    </div>
  );
}

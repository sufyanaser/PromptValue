import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Save, X, History, Variable, Info, CheckCircle2, Eye, Code, Layout } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Prompt } from '../../types';
import Markdown from 'react-markdown';
import { MarkdownToolbar } from '../../components/prompts/MarkdownToolbar';

export function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, addPrompt, updatePrompt } = useApp();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const existingPrompt = id ? data.prompts.find(p => p.id === id) : null;

  const [formData, setFormData] = useState({
    title: existingPrompt?.title || '',
    categoryId: existingPrompt?.categoryId || (data.categories[0]?.id || ''),
    content: existingPrompt?.content || '',
    description: existingPrompt?.description || '',
    notes: existingPrompt?.notes || '',
    tags: existingPrompt?.tags.join(', ') || '',
    status: existingPrompt?.status || 'active'
  });

  const [isSaved, setIsSaved] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');

  const variables = formData.content.match(/\{[^}]+\}/g)?.map(v => v.slice(1, -1)) || [];

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

    if (id) {
      updatePrompt(id, promptData);
    } else {
      addPrompt(promptData);
    }

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      navigate('/prompts');
    }, 1500);
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

    // Reset focus and selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = start + prefix.length + (selectedText.length || 0) + suffix.length;
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <PageHeader
        title={id ? 'تعديل البرومبت' : 'إنشاء برومبت جديد'}
        subtitle={id ? 'تحديث بيانات ومحتوى البرومبت الحالي' : 'إضافة برومبت جديد إلى مكتبتك المحلية'}
        showBack
        actions={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <X className="w-4 h-4 ml-2" />
              إلغاء
            </Button>
            <Button onClick={handleSave} loading={isSaved}>
              {isSaved ? <CheckCircle2 className="w-4 h-4 ml-2" /> : <Save className="w-4 h-4 ml-2" />}
              {id ? 'حفظ التغييرات' : 'حفظ البرومبت'}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Card>
            <CardHeader title="المعلومات الأساسية" subtitle="أدخل تفاصيل البرومبت الرئيسية" />
            <CardContent className="space-y-4">
              <Input
                label="عنوان البرومبت"
                placeholder="مثال: مساعد البرمجة الذكي..."
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="التصنيف"
                  value={formData.categoryId}
                  onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                  options={data.categories.map(c => ({ value: c.id, label: c.name }))}
                />
                <Select
                  label="الحالة"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  options={[
                    { value: 'active', label: 'نشط' },
                    { value: 'draft', label: 'مسودة' },
                    { value: 'archived', label: 'مؤرشف' },
                  ]}
                />
              </div>
              <Input
                label="الوسوم (مفصولة بفاصلة)"
                placeholder="برمجة، بايثون، ذكاء إصطناعي"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
              />
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader 
               title="محتوى البرومبت" 
               subtitle="نص البرومبت الأساسي (يدعم Markdown)" 
               actions={
                 <div className="flex p-1 bg-surface2-light dark:bg-surface2-dark rounded-xl border border-border/40">
                   <button
                     onClick={() => setViewMode('edit')}
                     className={cn("px-4 py-2 rounded-lg text-[10px] font-black transition-all flex items-center gap-2", viewMode === 'edit' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-40")}
                   >
                     <Code className="w-3 h-3" />
                     محرر
                   </button>
                   <button
                     onClick={() => setViewMode('preview')}
                     className={cn("px-4 py-2 rounded-lg text-[10px] font-black transition-all flex items-center gap-2", viewMode === 'preview' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-40")}
                   >
                     <Eye className="w-3 h-3" />
                     معاينة
                   </button>
                   <button
                     onClick={() => setViewMode('split')}
                     className={cn("px-4 py-2 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 hidden lg:flex", viewMode === 'split' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-40")}
                   >
                     <Layout className="w-3 h-3" />
                     مشترك
                   </button>
                 </div>
               }
            />
            <CardContent className="p-0 border-t border-border/40">
               {viewMode === 'edit' && (
                 <div className="flex flex-col">
                    <MarkdownToolbar onInsert={handleInsertMarkdown} />
                    <Textarea
                      ref={textareaRef}
                      placeholder="اكتب البرومبت هنا... استخدم {variable} لإضافة متغيرات"
                      className="min-h-[500px] font-mono leading-relaxed border-none rounded-none focus:border-none shadow-none bg-transparent"
                      value={formData.content}
                      onChange={e => setFormData({ ...formData, content: e.target.value })}
                    />
                 </div>
               )}

               {viewMode === 'preview' && (
                 <div className="min-h-[500px] p-8 prose prose-sm dark:prose-invert max-w-none bg-surface2-light/30 dark:bg-surface2-dark/30 overflow-y-auto">
                    <Markdown>{formData.content || '_لا يوجد محتوى للمعاينة..._'}</Markdown>
                 </div>
               )}

               {viewMode === 'split' && (
                 <div className="flex h-[600px] divide-x divide-x-reverse divide-border/40">
                    <div className="flex-1 flex flex-col border-l border-border/40">
                      <MarkdownToolbar onInsert={handleInsertMarkdown} />
                      <Textarea
                        ref={textareaRef}
                        placeholder="اكتب هنا..."
                        className="flex-1 font-mono leading-relaxed border-none rounded-none focus:border-none shadow-none bg-transparent p-6 resize-none"
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                      />
                    </div>
                    <div className="flex-1 p-8 prose prose-sm dark:prose-invert max-w-none bg-surface2-light/10 dark:bg-surface2-dark/10 overflow-y-auto">
                      <Markdown>{formData.content || '_لا يوجد محتوى للمعاينة..._'}</Markdown>
                    </div>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card>
            <CardHeader title="المتغيرات المكتشفة" icon={Variable} />
            <CardContent>
              {variables.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(variables)).map((v, i) => (
                    <Badge key={i} variant="accent" className="px-3 py-1.5">{v}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-light font-medium opacity-50 italic">لم يتم اكتشاف متغيرات بعد...</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="ملاحظات داخلية" icon={Info} />
            <CardContent>
              <Textarea
                placeholder="ملاحظات إضافية عن كيفية استخدام هذا البرومبت..."
                className="min-h-[150px] text-xs"
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </CardContent>
          </Card>

          {id && (
            <Card variant="surface">
              <CardHeader title="سجل الإصدارات" icon={History} />
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold">الإصدار v{existingPrompt?.version}</span>
                    <span className="text-[9px] opacity-50">الحالي</span>
                  </div>
                  <Badge variant="success">نشط</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Save, X, History, Variable, Info, CheckCircle2, Eye, Code, Bold, Italic, Underline, Link as LinkIcon, Quote, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Strikethrough, ChevronLeft, GripVertical, Check, MessageSquare, Activity } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Prompt } from '../../types';
import Markdown from 'react-markdown';

export function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, addPrompt, updatePrompt } = useApp();
  
  const existingPrompt = id ? data.prompts.find(p => p.id === id) : null;

  const [formData, setFormData] = useState({
    title: existingPrompt?.title || '',
    categoryId: existingPrompt?.categoryId || (data.categories[0]?.id || ''),
    content: existingPrompt?.content || '',
    description: existingPrompt?.description || '',
    notes: existingPrompt?.notes || '',
    tags: existingPrompt?.tags.join(', ') || '',
    status: existingPrompt?.status || 'active',
    author: existingPrompt?.author || 'أحمد النعيمي',
    source: existingPrompt?.source || 'مكتبة الفريق',
  });

  const [isSaved, setIsSaved] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [autoSavedTime, setAutoSavedTime] = useState<string>('منذ ثوان');

  const variables = formData.content.match(/\{[^}]+\}/g)?.map(v => v.slice(1, -1)) || [];
  const uniqueVariables = Array.from(new Set(variables));

  const charCount = formData.content.length;
  const tokenCount = Math.round(charCount / 0.7); // Approximate token ratio matching mocks

  const handleSave = () => {
    const promptData = {
      title: formData.title || 'بدون عنوان',
      description: formData.description,
      content: formData.content,
      categoryId: formData.categoryId,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: formData.status as any,
      notes: formData.notes,
      variables: uniqueVariables,
      isFavorite: existingPrompt?.isFavorite || false,
      usageCount: existingPrompt?.usageCount || 0,
      author: formData.author,
      source: formData.source,
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

  // Simulate Auto-saving feature
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoSavedTime('منذ ثوان');
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const toolbarButtons = [
    { icon: Bold, label: 'عريض' },
    { icon: Italic, label: 'مائل' },
    { icon: Underline, label: 'تسطير' },
    { icon: Strikethrough, label: 'يتوسطه خط' },
    { icon: AlignRight, label: 'محاذاة لليمين' },
    { icon: AlignCenter, label: 'توسيط' },
    { icon: AlignLeft, label: 'محاذاة لليسرى' },
    { icon: List, label: 'قائمة نقطية' },
    { icon: ListOrdered, label: 'قائمة رقمية' },
    { icon: Quote, label: 'اقتباس' },
    { icon: Code, label: 'كود برمجى' },
    { icon: LinkIcon, label: 'رابط' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb Header */}
      <div className="text-xs font-bold opacity-50 flex items-center gap-1.5 mb-2 select-none">
        <Link to="/prompts" className="hover:text-accent">البرومبتات</Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <span>تحرير/إنشاء برومبت</span>
      </div>

      <PageHeader
        title={id ? 'تحرير/إنشاء برومبت' : 'إنشاء برومبت جديد'}
        subtitle="إنشاء برومبت جديد أو تعديل برومبت موجود لتنظيمه في مكتبتك."
        showBack
        actions={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <X className="w-4 h-4 ml-2" />
              إلغاء
            </Button>
            <Button onClick={handleSave} loading={isSaved}>
              {isSaved ? <CheckCircle2 className="w-4 h-4 ml-2" /> : <Save className="w-4 h-4 ml-2" />}
              حفظ البرومبت
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-8">
        
        {/* Main Content Area (Left) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Card className="bg-white dark:bg-surface-dark border-border/40">
            <CardHeader 
              title="محتوى البرومبت" 
              subtitle="أدخل تفاصيل البرومبت وبياناته"
              actions={
                <div className="flex items-center gap-3">
                  {/* Autosave badge matching Image 4 */}
                  <div className="flex items-center gap-1 text-[10px] text-success font-black bg-success/5 border border-success/15 px-2.5 py-1 rounded-full">
                    <Check className="w-3 h-3" />
                    <span>تم الحفظ تلقائياً</span>
                    <span className="opacity-60">{autoSavedTime}</span>
                  </div>
                </div>
              }
            />
            <CardContent className="space-y-4">
              <Input
                label="عنوان البرومبت *"
                placeholder="كتابة خطة محتوى أسبوع كامل..."
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
                <Input
                  label="الوسوم (مفصولة بفاصلة)"
                  placeholder="تخطيط، محتوى، تسويق"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="المنشئ"
                  placeholder="أحمد النعيمي"
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                />
                <Input
                  label="المصدر"
                  placeholder="مكتبة الفريق"
                  value={formData.source}
                  onChange={e => setFormData({ ...formData, source: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Text Area Card with Rich Toolbar */}
          <Card className="overflow-hidden bg-white dark:bg-surface-dark border-border/40">
            <CardHeader 
               title="نص البرومبت *" 
               subtitle="اكتب البرومبت واستخدم {variable} لإضافة متغيرات" 
               actions={
                 <div className="flex p-1 bg-surface2-light dark:bg-surface2-dark rounded-xl border border-border/40">
                   <button
                     onClick={() => setViewMode('edit')}
                     className={cn("px-4 py-2 rounded-lg text-[10px] font-black transition-all flex items-center gap-2", viewMode === 'edit' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-40")}
                   >
                     <Code className="w-3.5 h-3.5" />
                     محرر
                   </button>
                   <button
                     onClick={() => setViewMode('preview')}
                     className={cn("px-4 py-2 rounded-lg text-[10px] font-black transition-all flex items-center gap-2", viewMode === 'preview' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-40")}
                   >
                     <Eye className="w-3.5 h-3.5" />
                     معاينة
                   </button>
                 </div>
               }
            />

            {/* Rich formatting toolbar from Image 4 */}
            {viewMode === 'edit' && (
              <div className="flex flex-wrap gap-1 p-2 bg-surface2-light dark:bg-surface2-dark/50 border-y border-border/40">
                {toolbarButtons.map((btn, i) => (
                  <button 
                    key={i} 
                    type="button" 
                    title={btn.label}
                    className="p-2 hover:bg-border/30 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <btn.icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            )}

            <CardContent className="p-0">
               {viewMode === 'edit' ? (
                 <div className="relative">
                   <Textarea
                      placeholder="اكتب البرومبت هنا... استخدم {variable} لإضافة متغيرات تفاعلية."
                      className="min-h-[350px] font-mono leading-relaxed border-none rounded-none focus:border-none shadow-none bg-transparent"
                      value={formData.content}
                      onChange={e => setFormData({ ...formData, content: e.target.value })}
                    />
                    <div className="absolute bottom-3 left-4 text-[9px] font-bold opacity-45">
                      عدد الأحرف: {charCount}
                    </div>
                 </div>
               ) : (
                 <div className="min-h-[350px] p-8 prose prose-sm dark:prose-invert max-w-none bg-surface2-light/30 dark:bg-surface2-dark/30 overflow-y-auto">
                    <Markdown>{formData.content || '_لا يوجد محتوى للمعاينة..._'}</Markdown>
                 </div>
               )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-surface-dark border-border/40">
            <CardHeader title="ملاحظات" subtitle="ملاحظات داخلية حول كيفية استخدام هذا البرومبت" />
            <CardContent>
              <Textarea
                placeholder="ملاحظات إضافية..."
                className="min-h-[80px] text-xs"
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (Right) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Variables panel matching Image 4 */}
          <Card className="bg-white dark:bg-surface-dark border-border/40">
            <CardHeader title="المتغيرات" icon={Variable} subtitle="استخدم المتغيرات لجعل البرومبت ديناميكياً" />
            <CardContent className="space-y-2">
              {uniqueVariables.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-surface2-light dark:bg-surface2-dark rounded-xl border border-border/20">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-3.5 h-3.5 opacity-30 cursor-grab" />
                    <span className="text-xs font-mono font-bold">{"{"}{v}{"}"}</span>
                  </div>
                  <Badge variant="accent" className="text-[9px] font-black py-0.5 px-2">نص</Badge>
                </div>
              ))}
              {uniqueVariables.length === 0 && (
                <p className="text-xs text-muted-light font-medium opacity-50 italic py-2">لم يتم اكتشاف متغيرات بعد...</p>
              )}
            </CardContent>
          </Card>

          {/* Prompt Info */}
          <Card className="bg-white dark:bg-surface-dark border-border/40">
            <CardHeader title="معلومات البرومبت" icon={Info} />
            <CardContent className="space-y-3 text-xs font-bold">
              <div className="flex justify-between">
                <span className="opacity-50">تاريخ الإنشاء:</span>
                <span>{existingPrompt ? new Date(existingPrompt.createdAt).toLocaleDateString('ar-EG') : new Date().toLocaleDateString('ar-EG')}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">آخر تعديل:</span>
                <span>{existingPrompt ? new Date(existingPrompt.updatedAt).toLocaleTimeString('ar-EG') : 'الآن'}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">المنشئ:</span>
                <span>{formData.author}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">الحالة:</span>
                <span className="text-success">نشط</span>
              </div>
            </CardContent>
          </Card>

          {/* Usage Estimation matching Image 4 */}
          <Card className="bg-white dark:bg-surface-dark border-border/40">
            <CardHeader title="تقدير الاستخدام" icon={Activity} />
            <CardContent className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-surface2-light dark:bg-surface2-dark rounded-2xl border border-border/20">
                <div className="text-sm font-bold mb-1">الرموز (Tokens)</div>
                <div className="text-xl font-black text-slate-800 dark:text-slate-100">~ {tokenCount}</div>
                <div className="text-[9px] opacity-40 font-bold">تقدير تقريبي</div>
              </div>
              <div className="p-3 bg-surface2-light dark:bg-surface2-dark rounded-2xl border border-border/20">
                <div className="text-sm font-bold mb-1">عدد الأحرف</div>
                <div className="text-xl font-black text-slate-800 dark:text-slate-100">{charCount}</div>
                <div className="text-[9px] opacity-40 font-bold">بما في ذلك المسافات</div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

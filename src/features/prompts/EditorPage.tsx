import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Save, X, History, Variable, Info, CheckCircle2, Eye, Code, Bold, Italic, Underline, 
  Link as LinkIcon, Quote, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, 
  AlignJustify, Strikethrough, ChevronLeft, GripVertical, Check, MessageSquare, Activity, 
  Image, Undo, Redo, Palette, Highlighter, Heading, Cpu, Brain, RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { Prompt } from '../../types';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, addPrompt, updatePrompt, showToast } = useApp();
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [aiEnhancingProvider, setAiEnhancingProvider] = useState<string | null>(null);

  const isGeminiActive = !!data.settings.geminiApiKey?.trim();
  const isOpenAIActive = !!data.settings.openaiApiKey?.trim();
  const isClaudeActive = !!data.settings.claudeApiKey?.trim();
  const hasAnyAi = isGeminiActive || isOpenAIActive || isClaudeActive;

  const editorRef = useRef<HTMLDivElement>(null);
  const existingPrompt = id ? data.prompts.find(p => p.id === id) : null;

  const simulateTyping = (text: string) => {
    let index = 0;
    const step = Math.max(1, Math.ceil(text.length / 100)); // Dynamic step for smooth and snappy animation
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const interval = setInterval(() => {
      if (index < text.length) {
        const nextContent = text.slice(0, index + step);
        if (editorRef.current) {
          editorRef.current.innerHTML = nextContent;
        }
        setFormData(prev => ({ ...prev, content: nextContent }));
        index += step;
      } else {
        clearInterval(interval);
        if (editorRef.current) {
          editorRef.current.innerHTML = text;
        }
        setFormData(prev => ({ ...prev, content: text }));
        showToast('تم تحسين البرومبت بنجاح!', 'success');
      }
    }, 20);
  };

  const handleAiEnhance = async (provider: 'gemini' | 'openai' | 'claude') => {
    const textToImprove = getTextFromHtml(formData.content);
    if (!textToImprove.trim()) {
      showToast('يرجى كتابة نص البرومبت أولاً ليتمكن المساعد من تحسينه.', 'warning');
      return;
    }

    setAiEnhancing(true);
    setAiEnhancingProvider(provider);

    const apiKey = 
      provider === 'gemini' 
        ? data.settings.geminiApiKey 
        : provider === 'openai' 
        ? data.settings.openaiApiKey 
        : data.settings.claudeApiKey;

    const input = `أنت خبير هندسة برومبتات (Prompt Engineer) محترف ومتخصص في كتابة التعليمات البرمجية للذكاء الاصطناعي.
مهمتك هي إعادة صياغة وتحسين وتوسيع البرومبت التالي ليعطي أفضل وأدق النتائج الممكنة.
- ركّز على الوضوح والدقة والترتيب الهيكلي.
- حافظ على المتغيرات المكتوبة بين القوسين المجعدين مثل {variable} كما هي تماماً ولا تغير أسمائها أو تحذفها.
- أرجع فقط نص البرومبت المحسن النهائي مباشرة بدون أي مقدمات أو مؤخرات أو شروحات إضافية.

البرومبت المراد تحسينه:
${textToImprove}`;

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          provider,
          apiKey
        }),
      });

      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);
      
      const enhancedText = resData.text;
      if (enhancedText) {
        simulateTyping(enhancedText);
      } else {
        throw new Error('لم يتم إرجاع أي نص');
      }
    } catch (error: any) {
      console.error(error);
      showToast(`فشل التحسين: ${error.message || 'حدث خطأ غير معروف'}`, 'danger');
    } finally {
      setAiEnhancing(false);
      setAiEnhancingProvider(null);
    }
  };

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

  // Font/Size/Alignment states
  const [fontFamily, setFontFamily] = useState<string>('font-sans');
  const [fontSize, setFontSize] = useState<string>('text-sm');
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
  const [isPenDropdownOpen, setIsPenDropdownOpen] = useState(false);
  const [isHighlighterDropdownOpen, setIsHighlighterDropdownOpen] = useState(false);
  const [alignment, setAlignment] = useState<'right' | 'center' | 'left' | 'justify'>('right');

  // Sync contenteditable editor innerHTML when viewMode changes
  useEffect(() => {
    if (editorRef.current && viewMode === 'edit') {
      if (editorRef.current.innerHTML !== formData.content) {
        editorRef.current.innerHTML = formData.content;
      }
    }
  }, [viewMode]);

  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setFormData(prev => ({ ...prev, content: html }));
    }
  };

  const execFormat = (command: string, value: string = '') => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleEditorInput();
  };

  const handleUndo = () => execFormat('undo');
  const handleRedo = () => execFormat('redo');

  const insertLink = () => {
    const url = prompt('أدخل الرابط:');
    if (url) {
      execFormat('createLink', url);
    }
  };

  const insertColorText = (colorHex: string) => {
    execFormat('foreColor', colorHex || '#111827');
    setIsPenDropdownOpen(false);
  };

  const insertHighlightText = (colorHex: string) => {
    execFormat('hiliteColor', colorHex || 'transparent');
    setIsHighlighterDropdownOpen(false);
  };

  const insertHeader = (headerTag: string) => {
    const level = headerTag.length;
    execFormat('formatBlock', `<h${level}>`);
    setIsHeaderDropdownOpen(false);
  };

  const handleAlignmentChange = (alignType: 'right' | 'center' | 'left' | 'justify') => {
    setAlignment(alignType);
    if (alignType === 'right') execFormat('justifyRight');
    else if (alignType === 'center') execFormat('justifyCenter');
    else if (alignType === 'left') execFormat('justifyLeft');
    else if (alignType === 'justify') execFormat('justifyFull');
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              const base64Url = event.target.result as string;
              editorRef.current?.focus();
              document.execCommand('insertImage', false, base64Url);
              handleEditorInput();
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result as string;
          editorRef.current?.focus();
          document.execCommand('insertImage', false, base64Url);
          handleEditorInput();
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleImageToolbarClick = () => {
    const input = document.getElementById('editor-image-uploader');
    input?.click();
  };

  // Helper to extract plain text from HTML
  const getTextFromHtml = (html: string) => {
    if (typeof document === 'undefined') return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const plainTextContent = getTextFromHtml(formData.content);
  const variables = plainTextContent.match(/\{[^}]+\}/g)?.map(v => v.slice(1, -1)) || [];
  const uniqueVariables = Array.from(new Set(variables));

  const charCount = plainTextContent.length;
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
              <div className="flex flex-wrap gap-1 p-2 bg-surface2-light dark:bg-surface2-dark/50 border-y border-border/40 select-none">
                {/* Image upload helper */}
                <button 
                  onClick={handleImageToolbarClick} 
                  type="button"
                  title="رفع صورة وإدراجها" 
                  className="p-2 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"
                >
                  <Image className="w-4 h-4 opacity-70" />
                </button>

                <div className="w-[1px] h-5 bg-border mx-1 my-auto" />

                {/* Undo / Redo */}
                <button 
                  onClick={handleUndo} 
                  type="button"
                  title="تراجع" 
                  className="p-2 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"
                >
                  <Undo className="w-4 h-4 opacity-70" />
                </button>
                <button 
                  onClick={handleRedo} 
                  type="button"
                  title="إعادة" 
                  className="p-2 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"
                >
                  <Redo className="w-4 h-4 opacity-70" />
                </button>

                <div className="w-[1px] h-5 bg-border mx-1 my-auto" />

                {/* Font Family selector */}
                <select 
                  value={fontFamily}
                  onChange={e => setFontFamily(e.target.value)}
                  className="h-8 px-2 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-lg text-[10px] font-black outline-none cursor-pointer text-slate-700 dark:text-slate-200"
                >
                  <option value="font-sans">IBM Plex Sans (عادي)</option>
                  <option value="font-mono">Monospace (كود)</option>
                  <option value="font-serif">Serif (كلاسيك)</option>
                </select>

                {/* Font Size selector */}
                <select 
                  value={fontSize}
                  onChange={e => setFontSize(e.target.value)}
                  className="h-8 px-2 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-lg text-[10px] font-black outline-none cursor-pointer text-slate-700 dark:text-slate-200"
                >
                  <option value="text-xs">12px</option>
                  <option value="text-sm">14px</option>
                  <option value="text-base">16px</option>
                  <option value="text-lg">18px</option>
                  <option value="text-xl">20px</option>
                </select>

                <div className="w-[1px] h-5 bg-border mx-1 my-auto" />

                {/* Text Color Picker (Pen) */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsPenDropdownOpen(!isPenDropdownOpen);
                      setIsHighlighterDropdownOpen(false);
                      setIsHeaderDropdownOpen(false);
                    }}
                    type="button"
                    title="لون الخط" 
                    className="p-2 hover:bg-border/20 rounded-lg cursor-pointer flex items-center gap-0.5 text-slate-600 dark:text-slate-300"
                  >
                    <Palette className="w-4 h-4 opacity-70 text-accent" />
                  </button>
                  {isPenDropdownOpen && (
                    <div className="absolute right-0 top-9 w-28 bg-white dark:bg-surface-dark border border-border/60 rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-0.5 text-right">
                      {[
                        { name: 'أحمر', hex: '#ef4444', class: 'bg-red-500' },
                        { name: 'أخضر', hex: '#22c55e', class: 'bg-emerald-500' },
                        { name: 'أزرق', hex: '#3b82f6', class: 'bg-blue-500' },
                        { name: 'بنفسجي', hex: '#a855f7', class: 'bg-purple-500' },
                        { name: 'برتقالي', hex: '#f97316', class: 'bg-orange-500' }
                      ].map((color, idx) => (
                        <button 
                          key={idx}
                          type="button"
                          onClick={() => insertColorText(color.hex)}
                          className="px-2 py-1.5 rounded-lg text-[10px] font-bold hover:bg-surface2-light dark:hover:bg-surface2-dark text-right flex items-center gap-2 w-full cursor-pointer text-slate-700 dark:text-slate-200"
                        >
                          <span className={cn("w-3 h-3 rounded-full shrink-0", color.class)} />
                          <span>{color.name}</span>
                        </button>
                      ))}
                      <button 
                        type="button"
                        onClick={() => insertColorText('')}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold hover:bg-surface2-light dark:hover:bg-surface2-dark text-right flex items-center gap-2 w-full border-t border-border/30 mt-1 cursor-pointer text-slate-700 dark:text-slate-200"
                      >
                        <span className="w-3 h-3 rounded-full shrink-0 bg-transparent border border-border" />
                        <span>مسح التنسيق</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Highlighter Picker */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsHighlighterDropdownOpen(!isHighlighterDropdownOpen);
                      setIsPenDropdownOpen(false);
                      setIsHeaderDropdownOpen(false);
                    }}
                    type="button"
                    title="تمييز النص" 
                    className="p-2 hover:bg-border/20 rounded-lg cursor-pointer flex items-center gap-0.5 text-slate-600 dark:text-slate-300"
                  >
                    <Highlighter className="w-4 h-4 opacity-70 text-warning" />
                  </button>
                  {isHighlighterDropdownOpen && (
                    <div className="absolute right-0 top-9 w-28 bg-white dark:bg-surface-dark border border-border/60 rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-0.5 text-right">
                      {[
                        { name: 'أصفر', hex: '#fef08a', class: 'bg-yellow-200 text-slate-800' },
                        { name: 'ليموني', hex: '#bbf7d0', class: 'bg-emerald-200 text-slate-800' },
                        { name: 'سماوي', hex: '#cffafe', class: 'bg-cyan-200 text-slate-800' },
                        { name: 'وردي', hex: '#fbcfe8', class: 'bg-pink-200 text-slate-800' }
                      ].map((color, idx) => (
                        <button 
                          key={idx}
                          type="button"
                          onClick={() => insertHighlightText(color.hex)}
                          className="px-2 py-1.5 rounded-lg text-[10px] font-bold hover:bg-surface2-light dark:hover:bg-surface2-dark text-right flex items-center gap-2 w-full cursor-pointer text-slate-700 dark:text-slate-200"
                        >
                          <span className={cn("w-3 h-3 rounded shrink-0", color.class)} />
                          <span>{color.name}</span>
                        </button>
                      ))}
                      <button 
                        type="button"
                        onClick={() => insertHighlightText('')}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold hover:bg-surface2-light dark:hover:bg-surface2-dark text-right flex items-center gap-2 w-full border-t border-border/30 mt-1 cursor-pointer text-slate-700 dark:text-slate-200"
                      >
                        <span className="w-3 h-3 rounded shrink-0 bg-transparent border border-border" />
                        <span>مسح التمييز</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-[1px] h-5 bg-border mx-1 my-auto" />

                {/* Headers Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsHeaderDropdownOpen(!isHeaderDropdownOpen);
                      setIsPenDropdownOpen(false);
                      setIsHighlighterDropdownOpen(false);
                    }}
                    type="button"
                    className="h-8 px-2.5 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-lg text-[10px] font-black flex items-center gap-1 hover:bg-border/20 cursor-pointer text-slate-700 dark:text-slate-200"
                  >
                    <Heading className="w-3.5 h-3.5 text-accent" />
                    <span>العناوين</span>
                  </button>
                  {isHeaderDropdownOpen && (
                    <div className="absolute right-0 top-9 w-24 bg-white dark:bg-surface-dark border border-border/60 rounded-xl shadow-xl p-1 z-50 flex flex-col gap-0.5 text-right">
                      {['#', '##', '###', '####', '#####', '######'].map((tag, idx) => (
                        <button 
                          key={idx}
                          type="button"
                          onClick={() => insertHeader(tag)}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-black hover:bg-surface2-light dark:hover:bg-surface2-dark text-right cursor-pointer text-slate-700 dark:text-slate-200"
                        >
                          عنوان H{idx + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-[1px] h-5 bg-border mx-1 my-auto" />

                {/* Alignment */}
                <div className="flex bg-surface2-light dark:bg-surface2-dark p-0.5 rounded-lg border border-border/30">
                  <button 
                    onClick={() => handleAlignmentChange('right')}
                    type="button"
                    className={cn("p-1 rounded-md transition-colors cursor-pointer", alignment === 'right' ? "bg-white dark:bg-surface-dark text-accent shadow-sm" : "opacity-45")}
                    title="محاذاة لليمين"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleAlignmentChange('center')}
                    type="button"
                    className={cn("p-1 rounded-md transition-colors cursor-pointer", alignment === 'center' ? "bg-white dark:bg-surface-dark text-accent shadow-sm" : "opacity-45")}
                    title="محاذاة للوسط"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleAlignmentChange('left')}
                    type="button"
                    className={cn("p-1 rounded-md transition-colors cursor-pointer", alignment === 'left' ? "bg-white dark:bg-surface-dark text-accent shadow-sm" : "opacity-45")}
                    title="محاذاة لليصار"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleAlignmentChange('justify')}
                    type="button"
                    className={cn("p-1 rounded-md transition-colors cursor-pointer", alignment === 'justify' ? "bg-white dark:bg-surface-dark text-accent shadow-sm" : "opacity-45")}
                    title="ضبط النص"
                  >
                    <AlignJustify className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-[1px] h-5 bg-border mx-1 my-auto" />

                {/* Formatting Helpers */}
                <button type="button" onClick={() => execFormat('bold')} title="عريض" className="p-2 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><Bold className="w-3.5 h-3.5 opacity-60" /></button>
                <button type="button" onClick={() => execFormat('italic')} title="مائل" className="p-2 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><Italic className="w-3.5 h-3.5 opacity-60" /></button>
                <button type="button" onClick={() => execFormat('underline')} title="تسطير" className="p-2 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><Underline className="w-3.5 h-3.5 opacity-60" /></button>
                <button type="button" onClick={() => execFormat('strikeThrough')} title="يتوسطه خط" className="p-2 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><Strikethrough className="w-3.5 h-3.5 opacity-60" /></button>
                <button type="button" onClick={() => execFormat('insertUnorderedList')} title="قائمة نقطية" className="p-2 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><List className="w-3.5 h-3.5 opacity-60" /></button>
                <button type="button" onClick={() => execFormat('insertOrderedList')} title="قائمة رقمية" className="p-2 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><ListOrdered className="w-3.5 h-3.5 opacity-60" /></button>
                <button type="button" onClick={() => execFormat('formatBlock', '<blockquote>')} title="اقتباس" className="p-2 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><Quote className="w-3.5 h-3.5 opacity-60" /></button>
                <button type="button" onClick={() => execFormat('formatBlock', '<pre>')} title="كود" className="p-2 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><Code className="w-3.5 h-3.5 opacity-60" /></button>
                <button type="button" onClick={insertLink} title="رابط" className="p-2 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><LinkIcon className="w-3.5 h-3.5 opacity-60" /></button>
              </div>
            )}

            <CardContent className="p-0">
               {viewMode === 'edit' ? (
                 <div className="relative p-4">
                   {/* Floating AI Enhancer Buttons */}
                   {hasAnyAi && (
                     <div className="absolute top-8 left-8 flex items-center gap-1.5 p-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-border/40 rounded-xl shadow-lg z-30 opacity-70 hover:opacity-100 transition-all select-none">
                        <div className="text-[9px] font-black px-2 text-muted-light dark:text-muted-dark border-l border-border/30">
                          محسّن الذكاء الاصطناعي
                        </div>
                        {isGeminiActive && (
                          <button
                            type="button"
                            onClick={() => handleAiEnhance('gemini')}
                            disabled={aiEnhancing}
                            className="p-1.5 hover:bg-info/10 hover:text-info text-slate-500 rounded-lg transition-all cursor-pointer relative group flex items-center justify-center"
                          >
                            <Sparkles className={cn("w-3.5 h-3.5", aiEnhancingProvider === 'gemini' && "animate-spin text-info")} />
                            <span className="absolute bottom-full mb-2 hidden group-hover:block text-[9px] font-bold bg-slate-950 text-white px-2 py-1 rounded shadow-md whitespace-nowrap">تحسين عبر Gemini</span>
                          </button>
                        )}
                        {isOpenAIActive && (
                          <button
                            type="button"
                            onClick={() => handleAiEnhance('openai')}
                            disabled={aiEnhancing}
                            className="p-1.5 hover:bg-success/10 hover:text-success text-slate-500 rounded-lg transition-all cursor-pointer relative group flex items-center justify-center"
                          >
                            <Cpu className={cn("w-3.5 h-3.5", aiEnhancingProvider === 'openai' && "animate-spin text-success")} />
                            <span className="absolute bottom-full mb-2 hidden group-hover:block text-[9px] font-bold bg-slate-950 text-white px-2 py-1 rounded shadow-md whitespace-nowrap">تحسين عبر OpenAI</span>
                          </button>
                        )}
                        {isClaudeActive && (
                          <button
                            type="button"
                            onClick={() => handleAiEnhance('claude')}
                            disabled={aiEnhancing}
                            className="p-1.5 hover:bg-accent/10 hover:text-accent text-slate-500 rounded-lg transition-all cursor-pointer relative group flex items-center justify-center"
                          >
                            <Brain className={cn("w-3.5 h-3.5", aiEnhancingProvider === 'claude' && "animate-spin text-accent")} />
                            <span className="absolute bottom-full mb-2 hidden group-hover:block text-[9px] font-bold bg-slate-950 text-white px-2 py-1 rounded shadow-md whitespace-nowrap">تحسين عبر Claude</span>
                          </button>
                        )}
                     </div>
                   )}

                   <input
                     id="editor-image-uploader"
                     type="file"
                     accept="image/*"
                     className="hidden"
                     onChange={handleImageUpload}
                   />
                   <div
                      ref={editorRef}
                      contentEditable
                      onInput={handleEditorInput}
                      onPaste={handlePaste}
                      placeholder="اكتب البرومبت هنا... استخدم {variable} لإضافة متغيرات تفاعلية."
                      className={cn(
                        "min-h-[350px] leading-relaxed border border-border/20 rounded-xl p-4 focus:outline-none bg-transparent overflow-y-auto text-right w-full transition-all duration-500",
                        fontFamily,
                        fontSize,
                        aiEnhancing && "border-accent/40 bg-accent/[0.01] animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.05)]"
                      )}
                      style={{ direction: 'rtl' }}
                    />
                    <div className="absolute bottom-3 left-6 text-[9px] font-bold opacity-45">
                      عدد الأحرف: {charCount}
                    </div>

                    {/* AI Loading/Generating Overlay */}
                    {aiEnhancing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-surface-dark/40 backdrop-blur-xs rounded-xl z-20 pointer-events-none select-none">
                        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-surface2-dark border border-border/50 shadow-xl">
                          <RefreshCw className="w-4 h-4 text-accent animate-spin" />
                          <span className="text-xs font-black">جاري تحسين البرومبت بالذكاء الاصطناعي...</span>
                        </div>
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="min-h-[350px] p-8 prose prose-sm dark:prose-invert max-w-none bg-surface2-light/30 dark:bg-surface2-dark/30 overflow-y-auto">
                    <Markdown rehypePlugins={[rehypeRaw]}>{formData.content || '_لا يوجد محتوى للمعاينة..._'}</Markdown>
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

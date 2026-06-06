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
  Image, Undo, Redo, Palette, Highlighter, Heading, Cpu, Brain, RefreshCw, Sparkles,
  Maximize2, Minimize2
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { Prompt } from '../../types';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { EmptyState } from '../../components/ui/EmptyState';

export function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, addPrompt, updatePrompt, showToast, t, lang } = useApp();
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [aiEnhancingProvider, setAiEnhancingProvider] = useState<string | null>(null);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  const [isFocusMode, setIsFocusMode] = useState(() => {
    return localStorage.getItem('promptvault_editor_focus_mode') === 'true';
  });

  const toggleFocusMode = () => {
    setIsFocusMode(prev => {
      const next = !prev;
      localStorage.setItem('promptvault_editor_focus_mode', String(next));
      return next;
    });
  };

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
        showToast(t('editor.successEnhance'), 'success');
      }
    }, 20);
  };

  const handleAiEnhance = async (provider: 'gemini' | 'openai' | 'claude') => {
    const textToImprove = getTextFromHtml(formData.content);
    if (!textToImprove.trim()) {
      showToast(t('editor.writePromptFirst'), 'warning');
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
      showToast(`${t('editor.enhanceFailed')}${error.message || (lang === 'ar' ? 'حدث خطأ غير معروف' : 'An unknown error occurred')}`, 'danger');
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
    author: existingPrompt?.author || (lang === 'ar' ? 'أحمد النعيمي' : 'Ahmed Al-Nuaimi'),
    source: existingPrompt?.source || (lang === 'ar' ? 'مكتبة الفريق' : 'Team Library'),
  });

  const [isSaved, setIsSaved] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [autoSavedTime, setAutoSavedTime] = useState<string>('');

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
    const url = prompt(t('editor.promptInsertLink'));
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
      title: formData.title || t('editor.untitled'),
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
    setAutoSavedTime(t('editor.secondsAgo'));
  }, [lang]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAutoSavedTime(t('editor.secondsAgo'));
    }, 10000);
    return () => clearInterval(timer);
  }, [lang]);

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Breadcrumb Header */}
      <div className="text-xs font-bold opacity-50 flex items-center gap-1.5 mb-1 select-none text-start">
        <Link to="/prompts" className="hover:text-accent">{t('sidebar.prompts')}</Link>
        <ChevronLeft className={cn("w-3.5 h-3.5", lang === 'en' && "rotate-180")} />
        <span>{t('editor.editPrompt')}</span>
      </div>

      <PageHeader
        title={id ? t('editor.editPrompt') : t('editor.newPrompt')}
        subtitle={t('editor.subtitle')}
        showBack
        actions={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <X className="w-4 h-4 me-2" />
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave} loading={isSaved}>
              {isSaved ? <CheckCircle2 className="w-4 h-4 me-2" /> : <Save className="w-4 h-4 me-2" />}
              {t('editor.savePrompt')}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-6 items-start">
        
        {/* Main Content Area (Left) */}
        <div className={cn(
          "col-span-12 space-y-4 transition-all duration-300",
          isFocusMode ? "" : "lg:col-span-8"
        )}>
          {/* Metadata Card: Title, category, tags, author, source */}
          {!isFocusMode && (
            <Card className="bg-white dark:bg-surface-dark border-border/40 shadow-xs">
              <CardHeader 
                title={t('editor.promptContent')} 
                subtitle={t('editor.enterDetails')}
                actions={
                  <div className="flex items-center gap-3">
                    {/* Autosave badge */}
                    <div className="flex items-center gap-1 text-[10px] text-success font-black bg-success/5 border border-success/15 px-2.5 py-1 rounded-full select-none">
                      <Check className="w-3 h-3" />
                      <span>{t('editor.autosaved')}</span>
                      <span className="opacity-60">{autoSavedTime}</span>
                    </div>
                  </div>
                }
              />
              <CardContent className="space-y-4">
                <Input
                  label={t('editor.titleLabel')}
                  placeholder={t('editor.titlePlaceholder')}
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label={t('editor.category')}
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    options={data.categories.map(c => ({ value: c.id, label: c.name }))}
                  />
                  <Input
                    label={t('editor.tagsLabel')}
                    placeholder={t('editor.tagsPlaceholder')}
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('editor.authorLabel')}
                    placeholder={lang === 'ar' ? 'أحمد النعيمي' : 'Ahmed Al-Nuaimi'}
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                  />
                  <Input
                    label={t('editor.sourceLabel')}
                    placeholder={lang === 'ar' ? 'مكتبة الفريق' : 'Team Library'}
                    value={formData.source}
                    onChange={e => setFormData({ ...formData, source: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Text Area Card with Rich Toolbar */}
          <Card className="overflow-hidden bg-white dark:bg-surface-dark border-border/40 shadow-xs">
            <CardHeader 
               title={isFocusMode ? (formData.title || t('editor.untitled')) : t('editor.contentLabel')} 
               subtitle={isFocusMode ? (lang === 'ar' ? 'وضع التركيز نشط - تحرير محتوى البرومبت' : 'Focus Mode active - editing prompt content') : t('editor.contentSubtitle')} 
               actions={
                 <div className="flex items-center gap-2 select-none">
                    {/* Focus Mode Button */}
                    <button
                      type="button"
                      onClick={toggleFocusMode}
                      className={cn(
                        "px-3 py-1.5 sm:px-3.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-1.5 border cursor-pointer",
                        isFocusMode 
                          ? "bg-accent/10 text-accent border-accent/30" 
                          : "bg-surface2-light dark:bg-surface2-dark border-border/40 hover:bg-border/10 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark"
                      )}
                      title={isFocusMode ? t('editor.exitFocusMode') : t('editor.focusMode')}
                    >
                      {isFocusMode ? <Minimize2 className="w-3.5 h-3.5 text-accent" /> : <Maximize2 className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{isFocusMode ? t('editor.exitFocusMode') : t('editor.focusMode')}</span>
                    </button>

                    {/* View Switcher: Editor / Preview */}
                    <div className="flex p-0.5 bg-surface2-light dark:bg-surface2-dark rounded-xl border border-border/40 select-none">
                      <button
                        type="button"
                        onClick={() => setViewMode('edit')}
                        className={cn("px-3.5 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1.5 cursor-pointer", viewMode === 'edit' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-45 hover:opacity-100")}
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('editor.modeEditor')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('preview')}
                        className={cn("px-3.5 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1.5 cursor-pointer", viewMode === 'preview' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-45 hover:opacity-100")}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('editor.modePreview')}</span>
                      </button>
                    </div>
                 </div>
               }
            />

            {/* Rich formatting toolbar */}
            {viewMode === 'edit' && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-surface-dark border-y border-border/40 select-none sticky top-[80px] z-30 shadow-xs transition-all">
                {/* Group 1: History */}
                <div className="flex items-center gap-0.5">
                  <button 
                    onClick={handleUndo} 
                    type="button"
                    title={t('editor.tooltipUndo')} 
                    className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <Undo className="w-3.5 h-3.5 opacity-80" />
                  </button>
                  <button 
                    onClick={handleRedo} 
                    type="button"
                    title={t('editor.tooltipRedo')} 
                    className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <Redo className="w-3.5 h-3.5 opacity-80" />
                  </button>
                </div>

                <div className="w-[1px] h-4 bg-border/40 mx-1 my-auto shrink-0" />

                {/* Group 2: Font & Size */}
                <div className="flex items-center gap-1.5">
                  <select 
                    value={fontFamily}
                    onChange={e => setFontFamily(e.target.value)}
                    className="h-7 px-1.5 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-lg text-[9px] font-black outline-none cursor-pointer text-slate-700 dark:text-slate-200"
                  >
                    <option value="font-sans">{t('editor.fontSans')}</option>
                    <option value="font-mono">{t('editor.fontMono')}</option>
                    <option value="font-serif">{t('editor.fontSerif')}</option>
                  </select>

                  <select 
                    value={fontSize}
                    onChange={e => setFontSize(e.target.value)}
                    className="h-7 px-1.5 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-lg text-[9px] font-black outline-none cursor-pointer text-slate-700 dark:text-slate-200"
                  >
                    <option value="text-xs">12px</option>
                    <option value="text-sm">14px</option>
                    <option value="text-base">16px</option>
                    <option value="text-lg">18px</option>
                    <option value="text-xl">20px</option>
                  </select>

                  {/* Headers Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setIsHeaderDropdownOpen(!isHeaderDropdownOpen);
                        setIsPenDropdownOpen(false);
                        setIsHighlighterDropdownOpen(false);
                      }}
                      type="button"
                      className="h-7 px-2 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-lg text-[9px] font-black flex items-center gap-1 hover:bg-border/20 cursor-pointer text-slate-700 dark:text-slate-200"
                    >
                      <Heading className="w-3 h-3 text-accent" />
                      <span>{t('editor.headings')}</span>
                    </button>
                    {isHeaderDropdownOpen && (
                      <div className="absolute right-0 top-8 w-24 bg-white dark:bg-surface-dark border border-border/60 rounded-xl shadow-xl p-1 z-50 flex flex-col gap-0.5 text-start">
                        {['#', '##', '###', '####', '#####', '######'].map((tag, idx) => (
                          <button 
                            key={idx}
                            type="button"
                            onClick={() => insertHeader(tag)}
                            className="px-2.5 py-1.5 rounded-lg text-[9px] font-black hover:bg-surface2-light dark:hover:bg-surface2-dark text-start cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            {t('editor.heading')} H{idx + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-[1px] h-4 bg-border/40 mx-1 my-auto shrink-0" />

                {/* Group 3: Text Formatting */}
                <div className="flex items-center gap-0.5">
                  <button type="button" onClick={() => execFormat('bold')} title={lang === 'ar' ? 'عريض' : 'Bold'} className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><Bold className="w-3.5 h-3.5 opacity-80" /></button>
                  <button type="button" onClick={() => execFormat('italic')} title={lang === 'ar' ? 'مائل' : 'Italic'} className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><Italic className="w-3.5 h-3.5 opacity-80" /></button>
                  <button type="button" onClick={() => execFormat('underline')} title={lang === 'ar' ? 'تسطير' : 'Underline'} className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><Underline className="w-3.5 h-3.5 opacity-80" /></button>
                  <button type="button" onClick={() => execFormat('strikeThrough')} title={lang === 'ar' ? 'يتوسطه خط' : 'Strikethrough'} className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><Strikethrough className="w-3.5 h-3.5 opacity-80" /></button>
                  
                  {/* Pen Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setIsPenDropdownOpen(!isPenDropdownOpen);
                        setIsHighlighterDropdownOpen(false);
                        setIsHeaderDropdownOpen(false);
                      }}
                      type="button"
                      title={t('editor.tooltipColor')} 
                      className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer flex items-center gap-0.5 text-slate-600 dark:text-slate-300"
                    >
                      <Palette className="w-3.5 h-3.5 opacity-80 text-accent" />
                    </button>
                    {isPenDropdownOpen && (
                      <div className="absolute right-0 top-8 w-28 bg-white dark:bg-surface-dark border border-border/60 rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-0.5 text-start">
                        {[
                          { name: lang === 'ar' ? 'أحمر' : 'Red', hex: '#ef4444', class: 'bg-red-500' },
                          { name: lang === 'ar' ? 'أخضر' : 'Green', hex: '#22c55e', class: 'bg-emerald-500' },
                          { name: lang === 'ar' ? 'أزرق' : 'Blue', hex: '#3b82f6', class: 'bg-blue-500' },
                          { name: lang === 'ar' ? 'بنفسجي' : 'Purple', hex: '#a855f7', class: 'bg-purple-500' },
                          { name: lang === 'ar' ? 'برتقالي' : 'Orange', hex: '#f97316', class: 'bg-orange-500' }
                        ].map((color, idx) => (
                          <button 
                            key={idx}
                            type="button"
                            onClick={() => insertColorText(color.hex)}
                            className="px-2 py-1 rounded-lg text-[9px] font-bold hover:bg-surface2-light dark:hover:bg-surface2-dark text-start flex items-center gap-2 w-full cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", color.class)} />
                            <span>{color.name}</span>
                          </button>
                        ))}
                        <button 
                          type="button"
                          onClick={() => insertColorText('')}
                          className="px-2 py-1 rounded-lg text-[9px] font-bold hover:bg-surface2-light dark:hover:bg-surface2-dark text-start flex items-center gap-2 w-full border-t border-border/30 mt-1 cursor-pointer text-slate-700 dark:text-slate-200"
                        >
                          <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-transparent border border-border" />
                          <span>{t('editor.clearFormat')}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Highlighter Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setIsHighlighterDropdownOpen(!isHighlighterDropdownOpen);
                        setIsPenDropdownOpen(false);
                        setIsHeaderDropdownOpen(false);
                      }}
                      type="button"
                      title={t('editor.tooltipHighlight')} 
                      className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer flex items-center gap-0.5 text-slate-600 dark:text-slate-300"
                    >
                      <Highlighter className="w-3.5 h-3.5 opacity-80 text-warning" />
                    </button>
                    {isHighlighterDropdownOpen && (
                      <div className="absolute right-0 top-8 w-28 bg-white dark:bg-surface-dark border border-border/60 rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-0.5 text-start">
                        {[
                          { name: lang === 'ar' ? 'أصفر' : 'Yellow', hex: '#fef08a', class: 'bg-yellow-200 text-slate-800' },
                          { name: lang === 'ar' ? 'ليموني' : 'Greenish', hex: '#bbf7d0', class: 'bg-emerald-200 text-slate-800' },
                          { name: lang === 'ar' ? 'سماوي' : 'Cyan', hex: '#cffafe', class: 'bg-cyan-200 text-slate-800' },
                          { name: lang === 'ar' ? 'وردي' : 'Pink', hex: '#fbcfe8', class: 'bg-pink-200 text-slate-800' }
                        ].map((color, idx) => (
                          <button 
                            key={idx}
                            type="button"
                            onClick={() => insertHighlightText(color.hex)}
                            className="px-2 py-1 rounded-lg text-[9px] font-bold hover:bg-surface2-light dark:hover:bg-surface2-dark text-start flex items-center gap-2 w-full cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            <span className={cn("w-2.5 h-2.5 rounded shrink-0", color.class)} />
                            <span>{color.name}</span>
                          </button>
                        ))}
                        <button 
                          type="button"
                          onClick={() => insertHighlightText('')}
                          className="px-2 py-1 rounded-lg text-[9px] font-bold hover:bg-surface2-light dark:hover:bg-surface2-dark text-start flex items-center gap-2 w-full border-t border-border/30 mt-1 cursor-pointer text-slate-700 dark:text-slate-200"
                        >
                          <span className="w-2.5 h-2.5 rounded shrink-0 bg-transparent border border-border" />
                          <span>{t('editor.clearHighlight')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-[1px] h-4 bg-border/40 mx-1 my-auto shrink-0" />

                {/* Group 4: Alignment */}
                <div className="flex bg-surface2-light dark:bg-surface2-dark p-0.5 rounded-lg border border-border/30">
                  <button 
                    onClick={() => handleAlignmentChange('right')}
                    type="button"
                    className={cn("p-1 rounded-md transition-colors cursor-pointer", alignment === 'right' ? "bg-white dark:bg-surface-dark text-accent shadow-sm" : "opacity-45")}
                    title={t('editor.tooltipAlignRight')}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleAlignmentChange('center')}
                    type="button"
                    className={cn("p-1 rounded-md transition-colors cursor-pointer", alignment === 'center' ? "bg-white dark:bg-surface-dark text-accent shadow-sm" : "opacity-45")}
                    title={t('editor.tooltipAlignCenter')}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleAlignmentChange('left')}
                    type="button"
                    className={cn("p-1 rounded-md transition-colors cursor-pointer", alignment === 'left' ? "bg-white dark:bg-surface-dark text-accent shadow-sm" : "opacity-45")}
                    title={t('editor.tooltipAlignLeft')}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleAlignmentChange('justify')}
                    type="button"
                    className={cn("p-1 rounded-md transition-colors cursor-pointer", alignment === 'justify' ? "bg-white dark:bg-surface-dark text-accent shadow-sm" : "opacity-45")}
                    title={t('editor.tooltipAlignJustify')}
                  >
                    <AlignJustify className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-[1px] h-4 bg-border/40 mx-1 my-auto shrink-0" />

                {/* Group 5: Blocks */}
                <div className="flex items-center gap-0.5">
                  <button type="button" onClick={() => execFormat('insertUnorderedList')} title={lang === 'ar' ? 'قائمة نقطية' : 'Bullet List'} className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><List className="w-3.5 h-3.5 opacity-80" /></button>
                  <button type="button" onClick={() => execFormat('insertOrderedList')} title={lang === 'ar' ? 'قائمة رقمية' : 'Numbered List'} className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><ListOrdered className="w-3.5 h-3.5 opacity-80" /></button>
                  <button type="button" onClick={() => execFormat('formatBlock', '<blockquote>')} title={lang === 'ar' ? 'اقتباس' : 'Blockquote'} className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><Quote className="w-3.5 h-3.5 opacity-80" /></button>
                  <button type="button" onClick={() => execFormat('formatBlock', '<pre>')} title={lang === 'ar' ? 'كود' : 'Code Block'} className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><Code className="w-3.5 h-3.5 opacity-80" /></button>
                </div>

                <div className="w-[1px] h-4 bg-border/40 mx-1 my-auto shrink-0" />

                {/* Group 6: Media & Links */}
                <div className="flex items-center gap-0.5">
                  <button type="button" onClick={insertLink} title={lang === 'ar' ? 'رابط' : 'Link'} className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"><LinkIcon className="w-3.5 h-3.5 opacity-80" /></button>
                  <button 
                    onClick={handleImageToolbarClick} 
                    type="button"
                    title={t('editor.tooltipUploadImage')} 
                    className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300"
                  >
                    <Image className="w-3.5 h-3.5 opacity-80" />
                  </button>
                </div>

                {/* Group 7: AI Enhancer Panel Toggle */}
                {hasAnyAi && (
                  <>
                    <div className="w-[1px] h-4 bg-border/40 mx-1 my-auto shrink-0" />
                    <button
                      type="button"
                      onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                      className={cn(
                        "h-7 px-2.5 rounded-lg text-[9px] font-black flex items-center gap-1.5 transition-all cursor-pointer border",
                        isAiPanelOpen 
                          ? "bg-accent/15 text-accent border-accent/30 shadow-sm"
                          : "bg-surface2-light dark:bg-surface2-dark border-border/30 hover:bg-border/20 text-slate-700 dark:text-slate-200"
                      )}
                      title={t('editor.aiEnhance')}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{t('editor.aiEnhance')}</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Collapsible AI Enhancer Panel */}
            {isAiPanelOpen && viewMode === 'edit' && (
              <div className="p-4 bg-slate-50 dark:bg-surface2-dark/30 border-b border-border/30 space-y-3 transition-all duration-300">
                <div className="flex items-center justify-between select-none">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-xs font-black">{lang === 'ar' ? 'مساعد الذكاء الاصطناعي لتحسين البرومبت' : 'AI Prompt Enhancer'}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsAiPanelOpen(false)}
                    className="p-1 rounded-lg hover:bg-border/20 text-muted-light dark:text-muted-dark cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 select-none">
                  {/* Gemini Provider */}
                  <div className={cn(
                    "p-3 rounded-xl border flex flex-col gap-2 transition-all",
                    isGeminiActive ? "border-border/60 bg-white dark:bg-surface-dark" : "border-border/30 bg-transparent opacity-60"
                  )}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Google Gemini</span>
                      <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full", isGeminiActive ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
                        {isGeminiActive ? t('editor.geminiReady') : (lang === 'ar' ? 'مفتاح غير متوفر' : 'Key Missing')}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant={isGeminiActive ? 'primary' : 'secondary'}
                      disabled={!isGeminiActive || aiEnhancing}
                      onClick={() => handleAiEnhance('gemini')}
                      className="w-full text-[10px] h-8 font-black"
                    >
                      {aiEnhancingProvider === 'gemini' ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin me-1.5" />
                          {lang === 'ar' ? 'جاري التحسين...' : 'Enhancing...'}
                        </>
                      ) : (
                        lang === 'ar' ? 'تحسين باستخدام Gemini' : 'Enhance with Gemini'
                      )}
                    </Button>
                  </div>

                  {/* OpenAI Provider */}
                  <div className={cn(
                    "p-3 rounded-xl border flex flex-col gap-2 transition-all",
                    isOpenAIActive ? "border-border/60 bg-white dark:bg-surface-dark" : "border-border/30 bg-transparent opacity-60"
                  )}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">OpenAI GPT</span>
                      <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full", isOpenAIActive ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
                        {isOpenAIActive ? t('editor.openaiReady') : (lang === 'ar' ? 'مفتاح غير متوفر' : 'Key Missing')}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant={isOpenAIActive ? 'primary' : 'secondary'}
                      disabled={!isOpenAIActive || aiEnhancing}
                      onClick={() => handleAiEnhance('openai')}
                      className="w-full text-[10px] h-8 font-black"
                    >
                      {aiEnhancingProvider === 'openai' ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin me-1.5" />
                          {lang === 'ar' ? 'جاري التحسين...' : 'Enhancing...'}
                        </>
                      ) : (
                        lang === 'ar' ? 'تحسين باستخدام OpenAI' : 'Enhance with OpenAI'
                      )}
                    </Button>
                  </div>

                  {/* Claude Provider */}
                  <div className={cn(
                    "p-3 rounded-xl border flex flex-col gap-2 transition-all",
                    isClaudeActive ? "border-border/60 bg-white dark:bg-surface-dark" : "border-border/30 bg-transparent opacity-60"
                  )}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Anthropic Claude</span>
                      <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full", isClaudeActive ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
                        {isClaudeActive ? t('editor.claudeReady') : (lang === 'ar' ? 'مفتاح غير متوفر' : 'Key Missing')}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant={isClaudeActive ? 'primary' : 'secondary'}
                      disabled={!isClaudeActive || aiEnhancing}
                      onClick={() => handleAiEnhance('claude')}
                      className="w-full text-[10px] h-8 font-black"
                    >
                      {aiEnhancingProvider === 'claude' ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin me-1.5" />
                          {lang === 'ar' ? 'جاري التحسين...' : 'Enhancing...'}
                        </>
                      ) : (
                        lang === 'ar' ? 'تحسين باستخدام Claude' : 'Enhance with Claude'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <CardContent className="p-0">
               {viewMode === 'edit' ? (
                  <div className="relative p-4">
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
                      {...{ placeholder: t('editor.editorPlaceholder') }}
                      className={cn(
                        "min-h-[350px] leading-relaxed border border-border/20 rounded-xl p-4 focus:outline-none bg-transparent overflow-y-auto text-start w-full transition-all duration-500",
                        fontFamily,
                        fontSize,
                        aiEnhancing && "animate-pulse",
                        aiEnhancing && aiEnhancingProvider === 'gemini' && "border-indigo-500/40 bg-indigo-500/[0.01] shadow-[0_0_20px_rgba(99,102,241,0.08)]",
                        aiEnhancing && aiEnhancingProvider === 'openai' && "border-emerald-500/40 bg-emerald-500/[0.01] shadow-[0_0_20px_rgba(16,185,129,0.08)]",
                        aiEnhancing && aiEnhancingProvider === 'claude' && "border-orange-500/40 bg-orange-500/[0.01] shadow-[0_0_20px_rgba(249,115,22,0.08)]"
                      )}
                      style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                    />
                    <div className="absolute bottom-3 start-6 text-[9px] font-bold opacity-45 select-none">
                      {t('editor.charCountText').replace('{count}', String(charCount))}
                    </div>

                     {/* AI Loading/Generating Overlay */}
                     {aiEnhancing && (
                       <div className="absolute inset-0 flex items-center justify-center bg-white/30 dark:bg-surface-dark/30 backdrop-blur-xs rounded-xl z-20 pointer-events-none select-none">
                         <div className={cn(
                           "flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-surface2-dark border shadow-xl transition-all duration-300",
                           aiEnhancingProvider === 'gemini' && "border-indigo-500/30 text-indigo-500 shadow-indigo-500/5",
                           aiEnhancingProvider === 'openai' && "border-emerald-500/30 text-emerald-500 shadow-emerald-500/5",
                           aiEnhancingProvider === 'claude' && "border-orange-500/30 text-orange-500 shadow-orange-500/5"
                         )}>
                           <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                           <span className="text-xs font-black">{t('editor.aiEnhancing')}</span>
                         </div>
                       </div>
                     )}
                  </div>
               ) : (
                  <div className="min-h-[350px] p-8 prose prose-sm dark:prose-invert max-w-none bg-surface2-light/30 dark:bg-surface2-dark/30 overflow-y-auto" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                     <Markdown rehypePlugins={[rehypeRaw]}>{formData.content || t('editor.noContentPreview')}</Markdown>
                  </div>
               )}
            </CardContent>
          </Card>

          {/* Notes Card */}
          {!isFocusMode && (
            <Card className="bg-white dark:bg-surface-dark border-border/40 shadow-xs">
              <CardHeader title={t('editor.notes')} subtitle={t('editor.notesSubtitle')} />
              <CardContent>
                <Textarea
                  placeholder={t('editor.notesPlaceholder')}
                  className="min-h-[80px] text-xs"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar (Right Column) */}
        {!isFocusMode && (
          <div className="col-span-12 lg:col-span-4 space-y-4">
            
            {/* Variables panel */}
            <Card className="bg-white dark:bg-surface-dark border-border/40 shadow-xs">
              <CardHeader title={t('editor.variables')} icon={Variable} subtitle={t('editor.variablesSubtitle')} />
              <CardContent className="space-y-2">
                {uniqueVariables.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-surface2-light dark:bg-surface2-dark rounded-xl border border-border/20">
                    <div className="flex items-center gap-2 min-w-0">
                      <GripVertical className="w-3.5 h-3.5 opacity-30 cursor-grab shrink-0" />
                      <span className="text-xs font-mono font-bold truncate">{"{"}{v}{"}"}</span>
                    </div>
                    <Badge variant="accent" className="text-[9px] font-black py-0.5 px-2 shrink-0">{t('editor.badgeText')}</Badge>
                  </div>
                ))}
                {uniqueVariables.length === 0 && (
                  <EmptyState
                    icon={Variable}
                    title={t('editor.variablesEmptyTitle')}
                    description={t('editor.variablesEmptyDesc')}
                    compactMode={true}
                    className="border border-dashed border-border/40 rounded-2xl bg-surface2-light/30 dark:bg-surface2-dark/30"
                  />
                )}
              </CardContent>
            </Card>

            {/* Prompt Info metadata panel */}
            <Card className="bg-white dark:bg-surface-dark border-border/40 shadow-xs">
              <CardHeader title={t('editor.promptInfo')} icon={Info} />
              <CardContent className="space-y-3 text-xs font-bold">
                <div className="flex justify-between">
                  <span className="opacity-50">{t('editor.createdAt')}</span>
                  <span>{existingPrompt ? new Date(existingPrompt.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US') : new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-50">{t('editor.lastModified')}</span>
                  <span>{existingPrompt ? new Date(existingPrompt.updatedAt).toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US') : (lang === 'ar' ? 'الآن' : 'Now')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-50">{t('editor.creator')}</span>
                  <span>{formData.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-50">{t('editor.status')}</span>
                  <span className="text-success">{lang === 'ar' ? 'نشط' : 'Active'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Usage Estimation panel */}
            <Card className="bg-white dark:bg-surface-dark border-border/40 shadow-xs">
              <CardHeader title={t('editor.usageEstimate')} icon={Activity} />
              <CardContent className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-surface2-light dark:bg-surface2-dark rounded-2xl border border-border/20">
                  <div className="text-xs font-bold mb-1 opacity-70">{t('editor.tokens')}</div>
                  <div className="text-lg font-black text-slate-800 dark:text-slate-100">~ {tokenCount}</div>
                  <div className="text-[9px] opacity-40 font-bold">{t('editor.approximate')}</div>
                </div>
                <div className="p-3 bg-surface2-light dark:bg-surface2-dark rounded-2xl border border-border/20">
                  <div className="text-xs font-bold mb-1 opacity-70">{t('editor.charCountTitle')}</div>
                  <div className="text-lg font-black text-slate-800 dark:text-slate-100">{charCount}</div>
                  <div className="text-[9px] opacity-40 font-bold">{t('editor.includingSpaces')}</div>
                </div>
               </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}

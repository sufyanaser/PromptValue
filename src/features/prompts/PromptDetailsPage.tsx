import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Copy, Edit, Star, Clock, User, Share2, AlertCircle, Calendar, Sparkles, Send, RefreshCw, MessageSquare, Check, CopyPlus, ArrowLeftRight, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import { PromptVariablesPanel } from '../../components/prompts/PromptVariablesPanel';

export function PromptDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, toggleFavorite, duplicatePrompt, showToast } = useApp();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [aiProvider, setAiProvider] = useState<'gemini' | 'openai' | 'claude' | 'copilot'>('gemini');
  const [copied, setCopied] = useState(false);

  const prompt = data.prompts.find(p => p.id === id);

  if (!prompt) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="w-16 h-16 text-danger opacity-20" />
        <h2 className="text-xl font-black">البرومبت غير موجود</h2>
        <Button variant="secondary" onClick={() => navigate('/prompts')}>العودة للبرومبتات</Button>
      </div>
    );
  }

  const category = data.categories.find(c => c.id === prompt.categoryId);

  const handleCopy = (finalContent?: string) => {
    const html = finalContent || prompt.content;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    try {
      const blobHtml = new Blob([html], { type: 'text/html' });
      const blobText = new Blob([plainText], { type: 'text/plain' });
      const clipboardItem = new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText
      });
      navigator.clipboard.write([clipboardItem]);
    } catch (err) {
      navigator.clipboard.writeText(plainText);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDuplicate = () => {
    duplicatePrompt(prompt.id);
    showToast('تم تكرار البرومبت بنجاح!', 'success');
  };

  const getApiKey = (provider: string) => {
    switch (provider) {
      case 'gemini': return data.settings.geminiApiKey;
      case 'openai': 
      case 'copilot': return data.settings.openaiApiKey;
      case 'claude': return data.settings.claudeApiKey;
      default: return undefined;
    }
  };

  const handleAiAction = async (action: 'improve' | 'chat') => {
    const input = action === 'chat' ? aiInput : `Improve the following prompt for better results. Provide only the improved prompt text:\n\n${prompt.content}`;
    if (action === 'chat' && !input.trim()) return;

    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          provider: aiProvider,
          apiKey: getApiKey(aiProvider)
        }),
      });
      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);
      setAiResponse(resData.text);
      if (action === 'chat') setAiInput('');
    } catch (error: any) {
      console.error(error);
      setAiResponse(`خطأ: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Helper: Highlight variables {variable} in HTML content
  const getHighlightedContentHtml = (html: string) => {
    return html.replace(/(\{[^}]+\})/g, (match) => {
      return `<span class="px-1.5 py-0.5 rounded bg-accent/10 text-accent font-black border border-accent/20 mx-0.5 inline-block font-sans">${match}</span>`;
    });
  };

  // Filter versions
  const promptVersions = data.versions.filter(v => v.promptId === prompt.id);
  
  // Find related prompts based on same category or sharing tags
  const relatedPrompts = data.prompts.filter(p => 
    p.id !== prompt.id && 
    (p.categoryId === prompt.categoryId || p.tags.some(t => prompt.tags.includes(t)))
  ).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Breadcrumb Header */}
      <div className="text-xs font-bold opacity-50 flex items-center gap-1.5 mb-2 select-none">
        <Link to="/prompts" className="hover:text-accent">البرومبتات</Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <span>معاينة البرومبت</span>
      </div>

      <PageHeader
        title="معاينة البرومبت"
        subtitle="تعرض تفاصيل البرومبت ومعاينته قبل الاستخدام."
        showBack
        actions={
          <div className="flex gap-2.5">
             <Button variant="secondary" onClick={() => toggleFavorite(prompt.id)}>
              <Star className={cn("w-4 h-4 ml-2", prompt.isFavorite && "fill-accent text-accent")} />
              {prompt.isFavorite ? 'مفضل' : 'إضافة للمفضلة'}
            </Button>
            <Button variant="secondary" onClick={handleDuplicate}>
              <CopyPlus className="w-4 h-4 ml-2" />
              تكرار
            </Button>
            <Link to={`/editor/${prompt.id}`}>
              <Button variant="secondary">
                <Edit className="w-4 h-4 ml-2" />
                تحرير
              </Button>
            </Link>
            <Button onClick={() => handleCopy()} className="bg-accent text-white shadow-lg shadow-accent/10">
              {copied ? <Check className="w-4 h-4 ml-2" /> : <Copy className="w-4 h-4 ml-2" />}
              نسخ البرومبت
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Side: Variables and original text */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <PromptVariablesPanel 
            content={prompt.content} 
            variables={prompt.variables} 
            onCopy={handleCopy} 
          />

          <Card className="min-h-[300px] bg-white dark:bg-surface-dark border-border/40">
            <CardHeader title="نص البرومبت" subtitle="معاينة النص مع إبراز المتغيرات" />
            <CardContent>
              <div 
                className="p-6 bg-surface2-light dark:bg-surface2-dark rounded-2xl border border-border/40 font-mono text-sm leading-loose whitespace-pre-wrap select-all"
                dangerouslySetInnerHTML={{ __html: getHighlightedContentHtml(prompt.content) }}
              />
            </CardContent>
          </Card>

          {/* AI Assistant Section */}
          <Card className="border-accent/30 overflow-hidden bg-white dark:bg-surface-dark border-border/40">
            <CardHeader 
              title="مساعد الذكاء الاصطناعي الذكي" 
              icon={Sparkles}
              subtitle="اختر الوكيل المفضل واختبر البرومبت أو قم بتحسينه" 
              actions={
                <div className="flex p-1 bg-surface2-light dark:bg-surface2-dark rounded-2xl border border-border/40 gap-1">
                  {[
                    { id: 'gemini', color: 'text-info', label: 'Gemini' },
                    { id: 'openai', color: 'text-success', label: 'ChatGPT' },
                    { id: 'claude', color: 'text-warning', label: 'Claude' },
                    { id: 'copilot', color: 'text-accent', label: 'Copilot' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setAiProvider(p.id as any)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2",
                        aiProvider === p.id 
                          ? "bg-white dark:bg-surface-dark shadow-sm " + p.color 
                          : "opacity-40 hover:opacity-100"
                      )}
                    >
                      <div className={cn("w-1.5 h-1.5 rounded-full bg-current", aiProvider === p.id ? "opacity-100" : "opacity-0")} />
                      {p.label}
                    </button>
                  ))}
                </div>
              }
            />
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => handleAiAction('improve')} loading={aiLoading}>
                   <Sparkles className="w-4 h-4 ml-2 text-success" />
                   تحسين البرومبت
                </Button>
                <div className="flex-2 flex gap-2">
                   <input 
                    type="text" 
                    placeholder={`اسأل ${aiProvider} عن هذا البرومبت...`}
                    className="flex-1 px-4 rounded-xl border border-border/40 bg-surface2-light dark:bg-surface2-dark text-xs outline-none focus:border-accent"
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAiAction('chat')}
                   />
                   <Button onClick={() => handleAiAction('chat')} loading={aiLoading} size="icon">
                      <Send className="w-4 h-4" />
                   </Button>
                </div>
              </div>

              {aiResponse && (
                <div className="p-5 bg-success/5 border border-success/20 rounded-2xl space-y-3">
                   <div className="flex items-center justify-between">
                      <Badge variant="success">استجابة المساعد</Badge>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setAiResponse('')}>مسح</Button>
                   </div>
                   <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                      {aiResponse}
                   </div>
                   <div className="pt-2 flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(aiResponse) }}>
                           <Copy className="w-3 h-3 ml-1" /> نسخ
                        </Button>
                   </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Prompts & Versions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Version History Table */}
            <Card className="bg-white dark:bg-surface-dark border-border/40">
              <CardHeader title="إصدارات البرومبت" icon={Clock} />
              <div className="overflow-x-auto px-4 pb-4">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="opacity-50 border-b border-border/40 font-bold">
                      <th className="py-2 pr-2">المنشئ</th>
                      <th className="py-2">تاريخ الإصدار</th>
                      <th className="py-2 pl-2">تعديل الإصدار</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promptVersions.map((v) => (
                      <tr key={v.id} className="border-b border-border/10 hover:bg-surface2-light/20">
                        <td className="py-3 pr-2 font-bold opacity-80">{prompt.author || 'أحمد النعيمي'}</td>
                        <td className="py-3 font-mono opacity-60">{new Date(v.createdAt).toLocaleDateString('ar-EG')}</td>
                        <td className="py-3 pl-2 opacity-80 flex items-center gap-1.5 justify-between">
                          <span className="truncate max-w-[120px]">{v.changeNote}</span>
                          <span className="px-1.5 py-0.5 rounded bg-surface2-light dark:bg-surface2-dark text-[9px] font-black">v{v.version}.0</span>
                        </td>
                      </tr>
                    ))}
                    {promptVersions.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center opacity-40 italic">لا توجد إصدارات سابقة محفوظة.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Related Prompts */}
            <Card className="bg-white dark:bg-surface-dark border-border/40">
              <CardHeader title="برومبتات ذات صلة" icon={FileText} />
              <CardContent className="space-y-3">
                {relatedPrompts.map((p) => (
                  <Link 
                    key={p.id} 
                    to={`/prompts/${p.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-surface2-light dark:hover:bg-surface2-dark border border-border/20 transition-all group"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-accent transition-colors">{p.title}</span>
                      <span className="text-[10px] opacity-40">{data.categories.find(c => c.id === p.categoryId)?.name || 'عام'}</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </Link>
                ))}
                {relatedPrompts.length === 0 && (
                  <p className="text-xs text-center opacity-40 italic py-6">لا توجد برومبتات ذات صلة.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side: Metadata Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="bg-white dark:bg-surface-dark border-border/40">
            <CardHeader title="معلومات البرومبت" />
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm py-2 border-b border-border/40">
                <span className="opacity-50 font-medium">التصنيف</span>
                <Badge variant="accent">{category?.name || 'غير مصنف'}</Badge>
              </div>
              <div className="flex flex-col gap-2 py-2 border-b border-border/40">
                <span className="opacity-50 font-medium text-xs">الوسوم</span>
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.map(tag => (
                    <Badge key={tag} variant="default">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-border/40">
                <span className="opacity-50 font-medium">الإصدار</span>
                <span className="font-black text-xs bg-surface2-light dark:bg-surface2-dark px-2.5 py-1 rounded-lg">v{prompt.version}.0.0</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-border/40">
                <span className="opacity-50 font-medium">الاستخدامات</span>
                <span className="font-bold">{prompt.usageCount} مرة</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-border/40">
                <span className="opacity-50 font-medium">المنشئ</span>
                <span className="font-bold">{prompt.author || 'أحمد النعيمي'}</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2">
                <span className="opacity-50 font-medium">المصدر</span>
                <span className="font-bold text-accent">{prompt.source || 'مكتبة الفريق'}</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="surface" className="bg-white dark:bg-surface-dark border-border/40">
            <CardHeader title="التواريخ" icon={Calendar} />
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-accent" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold opacity-50 uppercase">تاريخ الإنشاء</span>
                  <span className="text-xs font-bold">{new Date(prompt.createdAt).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-accent" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold opacity-50 uppercase">آخر تحديث</span>
                  <span className="text-xs font-bold">{new Date(prompt.updatedAt).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

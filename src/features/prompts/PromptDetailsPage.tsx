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
  const { data, toggleFavorite, duplicatePrompt, showToast, t, lang } = useApp();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [aiProvider, setAiProvider] = useState<'gemini' | 'openai' | 'claude' | 'copilot'>('gemini');
  const [copied, setCopied] = useState(false);

  const prompt = data.prompts.find(p => p.id === id);

  const getTagStyle = (tagName: string) => {
    const found = data.tags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
    if (found) {
      return {
        backgroundColor: `${found.color}15`,
        color: found.color,
        borderColor: `${found.color}30`,
        borderWidth: '1px',
        borderStyle: 'solid' as const,
      };
    }
    return {};
  };

  if (!prompt) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="w-16 h-16 text-danger opacity-20" />
        <h2 className="text-xl font-black">{t('details.promptNotFound')}</h2>
        <Button variant="secondary" onClick={() => navigate('/prompts')}>{t('details.backToPrompts')}</Button>
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
    showToast(t('details.duplicateSuccess'), 'success');
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
      let resData;
      const pv = (window as any).PromptVault;
      if (pv && pv.ai && pv.ai.generate) {
        resData = await pv.ai.generate({
          prompt: input,
          provider: aiProvider,
          apiKey: getApiKey(aiProvider)
        });
      } else {
        const response = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: input,
            provider: aiProvider,
            apiKey: getApiKey(aiProvider)
          }),
        });
        resData = await response.json();
      }
      if (resData.error) throw new Error(resData.error);
      setAiResponse(resData.text);
      if (action === 'chat') setAiInput('');
    } catch (error: any) {
      console.error(error);
      setAiResponse(`${t('details.error')}${error.message}`);
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
        <Link to="/prompts" className="hover:text-accent">{t('sidebar.prompts')}</Link>
        <ChevronLeft className={cn("w-3.5 h-3.5", lang === 'en' && "rotate-180")} />
        <span>{t('details.title')}</span>
      </div>

      <PageHeader
        title={t('details.title')}
        subtitle={t('details.subtitle')}
        showBack
        actions={
          <div className="flex gap-2.5">
             <Button variant="secondary" onClick={() => toggleFavorite(prompt.id)}>
              <Star className={cn("w-4 h-4 me-2", prompt.isFavorite && "fill-accent text-accent")} />
              {prompt.isFavorite ? t('details.favorite') : t('details.addToFavorites')}
            </Button>
            <Button variant="secondary" onClick={handleDuplicate}>
              <CopyPlus className="w-4 h-4 me-2" />
              {t('details.duplicate')}
            </Button>
            <Link to={`/editor/${prompt.id}`}>
              <Button variant="secondary">
                <Edit className="w-4 h-4 me-2" />
                {t('details.edit')}
              </Button>
            </Link>
            <Button onClick={() => handleCopy()} className="bg-accent text-white shadow-lg shadow-accent/10">
              {copied ? <Check className="w-4 h-4 me-2" /> : <Copy className="w-4 h-4 me-2" />}
              {t('details.copyPrompt')}
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
            <CardHeader title={t('details.promptText')} subtitle={t('details.previewTextSubtitle')} />
            <CardContent>
              <div 
                className="p-6 bg-surface2-light dark:bg-surface2-dark rounded-2xl border border-border/40 font-mono text-sm leading-loose whitespace-pre-wrap select-all text-start"
                style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                dangerouslySetInnerHTML={{ __html: getHighlightedContentHtml(prompt.content) }}
              />
            </CardContent>
          </Card>

          {/* AI Assistant Section */}
          <Card className="border-accent/30 overflow-hidden bg-white dark:bg-surface-dark border-border/40">
            <CardHeader 
              title={t('details.aiAssistantTitle')} 
              icon={Sparkles}
              subtitle={t('details.aiAssistantSubtitle')} 
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
                   <Sparkles className="w-4 h-4 me-2 text-success" />
                   {t('details.improvePrompt')}
                </Button>
                <div className="flex-2 flex gap-2">
                   <input 
                    type="text" 
                    placeholder={t('details.askAiPlaceholder').replace('{provider}', aiProvider)}
                    className="flex-1 px-4 rounded-xl border border-border/40 bg-surface2-light dark:bg-surface2-dark text-xs outline-none focus:border-accent text-start"
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
                      <Badge variant="success">{t('details.assistantResponse')}</Badge>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setAiResponse('')}>{t('details.clear')}</Button>
                   </div>
                   <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-start">
                      {aiResponse}
                   </div>
                   <div className="pt-2 flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(aiResponse) }}>
                           <Copy className="w-3 h-3 me-1" /> {t('details.copy')}
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
              <CardHeader title={t('details.versionsTitle')} icon={Clock} />
              <div className="overflow-x-auto px-4 pb-4">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="opacity-50 border-b border-border/40 font-bold">
                      <th className="py-2 pe-2 text-start">{t('details.creatorCol')}</th>
                      <th className="py-2 text-start">{t('details.releaseDateCol')}</th>
                      <th className="py-2 ps-2 text-start">{t('details.releaseEditCol')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promptVersions.map((v) => (
                      <tr key={v.id} className="border-b border-border/10 hover:bg-surface2-light/20">
                        <td className="py-3 pe-2 font-bold opacity-80">{prompt.author || (lang === 'ar' ? 'أحمد النعيمي' : 'Ahmed Al-Nuaimi')}</td>
                        <td className="py-3 font-mono opacity-60">{new Date(v.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</td>
                        <td className="py-3 ps-2 opacity-80 flex items-center gap-1.5 justify-between">
                          <span className="truncate max-w-[120px]">{v.changeNote}</span>
                          <span className="px-1.5 py-0.5 rounded bg-surface2-light dark:bg-surface2-dark text-[9px] font-black">v{v.version}.0</span>
                        </td>
                      </tr>
                    ))}
                    {promptVersions.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center opacity-40 italic">{t('details.noVersions')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Related Prompts */}
            <Card className="bg-white dark:bg-surface-dark border-border/40">
              <CardHeader title={t('details.relatedPrompts')} icon={FileText} />
              <CardContent className="space-y-3">
                {relatedPrompts.map((p) => (
                  <Link 
                    key={p.id} 
                    to={`/prompts/${p.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-surface2-light dark:hover:bg-surface2-dark border border-border/20 transition-all group"
                  >
                    <div className="flex flex-col gap-0.5 text-start">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-accent transition-colors">{p.title}</span>
                      <span className="text-[10px] opacity-40">{data.categories.find(c => c.id === p.categoryId)?.name || (lang === 'ar' ? 'عام' : 'General')}</span>
                    </div>
                    <ChevronLeft className={cn("w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity", lang === 'en' && "rotate-180")} />
                  </Link>
                ))}
                {relatedPrompts.length === 0 && (
                  <p className="text-xs text-center opacity-40 italic py-6">{t('details.noRelated')}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side: Metadata Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="bg-white dark:bg-surface-dark border-border/40">
            <CardHeader title={t('details.title')} />
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm py-2 border-b border-border/40">
                <span className="opacity-50 font-medium">{t('details.category')}</span>
                <Badge variant="accent">{category?.name || (lang === 'ar' ? 'غير مصنف' : 'Unclassified')}</Badge>
              </div>
              <div className="flex flex-col gap-2 py-2 border-b border-border/40 text-start">
                <span className="opacity-50 font-medium text-xs">{t('details.tags')}</span>
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.map(tag => {
                    const style = getTagStyle(tag);
                    const hasColor = !!style.color;
                    return (
                      <Badge 
                        key={tag} 
                        variant={hasColor ? undefined : "default"}
                        className={cn(!hasColor && "opacity-60")}
                        style={style}
                      >
                        #{tag}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-border/40">
                <span className="opacity-50 font-medium">{t('details.version')}</span>
                <span className="font-black text-xs bg-surface2-light dark:bg-surface2-dark px-2.5 py-1 rounded-lg">v{prompt.version}.0.0</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-border/40">
                <span className="opacity-50 font-medium">{t('details.usages')}</span>
                <span className="font-bold">{prompt.usageCount} {lang === 'ar' ? 'مرة' : 'times'}</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-border/40">
                <span className="opacity-50 font-medium">{t('details.creatorCol')}</span>
                <span className="font-bold">{prompt.author || (lang === 'ar' ? 'أحمد النعيمي' : 'Ahmed Al-Nuaimi')}</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2">
                <span className="opacity-50 font-medium">{t('details.source')}</span>
                <span className="font-bold text-accent">{prompt.source || (lang === 'ar' ? 'مكتبة الفريق' : 'Team Library')}</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="surface" className="bg-white dark:bg-surface-dark border-border/40">
            <CardHeader title={t('details.dates')} icon={Calendar} />
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-accent" />
                <div className="flex flex-col text-start">
                  <span className="text-[10px] font-bold opacity-50 uppercase">{t('details.createdAt')}</span>
                  <span className="text-xs font-bold">{new Date(prompt.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-accent" />
                <div className="flex flex-col text-start">
                  <span className="text-[10px] font-bold opacity-50 uppercase">{t('details.lastUpdatedAt')}</span>
                  <span className="text-xs font-bold">{new Date(prompt.updatedAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

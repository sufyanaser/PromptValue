import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Copy, Edit, Star, Clock, User, Share2, AlertCircle, Calendar, Sparkles, Send, RefreshCw, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/cn';
import { PromptVariablesPanel } from '../../components/prompts/PromptVariablesPanel';
import { Modal } from '../../components/ui/Modal';
import { PromptEditorModal } from '../../components/prompts/PromptEditorModal';

export function PromptDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, toggleFavorite } = useApp();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [aiProvider, setAiProvider] = useState<'gemini' | 'openai' | 'claude' | 'copilot'>('gemini');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const textToCopy = finalContent || prompt.content;
    navigator.clipboard.writeText(textToCopy);
  };

  const getApiKey = (provider: string) => {
    switch (provider) {
      case 'gemini': return data.settings.geminiApiKey;
      case 'openai': return data.settings.openaiApiKey;
      case 'copilot': return data.settings.copilotApiKey || data.settings.openaiApiKey;
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <PageHeader
        title={prompt.title}
        subtitle={prompt.description}
        showBack
        actions={
          <div className="flex gap-3">
             <Button variant="secondary" onClick={() => toggleFavorite(prompt.id)}>
              <Star className={cn("w-4 h-4 ml-2", prompt.isFavorite && "fill-accent text-accent")} />
              {prompt.isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              <Edit className="w-4 h-4 ml-2" />
              تعديل
            </Button>
          </div>
        }
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="تعديل البرومبت" maxWidth="7xl">
         <PromptEditorModal promptId={prompt.id} onClose={() => setIsModalOpen(false)} />
      </Modal>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <PromptVariablesPanel 
            content={prompt.content} 
            variables={prompt.variables} 
            onCopy={handleCopy} 
          />

          <Card className="min-h-[300px]">
            <CardHeader title="نص البرومبت الأصلي" />
            <CardContent>
              <div className="p-6 bg-surface2-light dark:bg-surface2-dark rounded-2xl border border-border/40 font-mono text-sm leading-loose whitespace-pre-wrap select-all">
                {prompt.content}
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant Section */}
          <Card className="border-accent/30 overflow-hidden">
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

          <Card>
            <CardHeader title="ملاحظات" />
            <CardContent>
              <p className="text-sm font-medium leading-relaxed opacity-70">
                {prompt.notes || 'لا توجد ملاحظات إضافية لهذا البرومبت.'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card>
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
                <span className="font-bold">v{prompt.version}.0.0</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2">
                <span className="opacity-50 font-medium">الاستخدامات</span>
                <span className="font-bold">{prompt.usageCount} مرة</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="surface">
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

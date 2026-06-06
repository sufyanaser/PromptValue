import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Globe, Save, Database, Shield, Info, Keyboard, Sparkles, Cloud, Check, X, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/cn';

export function SettingsPage() {
  const { data, theme, setTheme, updateData, showToast, createBackup, t, lang } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('preferences');
  const [testingProvider, setTestingProvider] = React.useState<string | null>(null);

  const tabs = [
    { id: 'preferences', name: t('settings.tabPreferences'), icon: Globe },
    { id: 'ai', name: t('settings.tabAIProviders'), icon: Sparkles },
    { id: 'data', name: t('settings.tabDataSafety'), icon: Shield },
    { id: 'app', name: t('settings.tabApplication'), icon: Info },
  ];

  const handleSelectDirectory = async () => {
    const pv = (window as any).PromptVault;
    if (pv && pv.files && pv.files.selectDirectory) {
      try {
        const newPath = await pv.files.selectDirectory();
        if (newPath) {
          updateData({ settings: { ...data.settings, databasePath: newPath } });
          showToast(t('settings.pathChangeSuccess'), 'success');
        }
      } catch (err) {
        showToast(t('settings.pathChangeFail'), 'danger');
      }
    } else {
      showToast(t('settings.desktopOnlyWarning'), 'warning');
    }
  };

  const testApiKey = (provider: string, key?: string) => {
    if (!key || key.trim() === '') {
      showToast(t('settings.testInputWarning'), 'warning');
      return;
    }
    setTestingProvider(provider);
    setTimeout(() => {
      setTestingProvider(null);
      showToast(t('settings.testSuccessToast').replace('{provider}', provider), 'success');
    }, 1500);
  };

  const triggerManualBackup = () => {
    createBackup('manual');
    showToast(t('settings.backupSuccessToast'), 'success');
  };

  return (
    <div className="space-y-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
      />

      <div className="grid grid-cols-12 gap-8">
        {/* Navigation Tabs Card */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="p-2 shadow-inner-sm bg-surface2-light dark:bg-surface2-dark border-transparent">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full text-start px-6 py-4 rounded-xl text-sm font-black transition-all flex items-center gap-3 cursor-pointer",
                  activeTab === tab.id 
                    ? "bg-white dark:bg-surface-dark shadow-sm text-accent" 
                    : "opacity-60 hover:bg-white/50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                )}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                <tab.icon className={cn("w-4.5 h-4.5", activeTab === tab.id ? "text-accent" : "opacity-50")} />
                {tab.name}
              </button>
            ))}
          </Card>
        </div>

        {/* Settings Panes */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          
          {/* 1. USER PREFERENCES */}
          {activeTab === 'preferences' && (
            <section className="space-y-6">
              <h3 className="text-lg font-black flex items-center gap-2.5 px-1">
                <Globe className="w-5 h-5 text-accent" />
                {t('settings.tabPreferences')}
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Theme Setting */}
                <Card className="hover:border-border/60 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex flex-col gap-1 text-start">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t('settings.visualTheme')}</span>
                        <span className="text-xs opacity-60 font-medium">{t('settings.themeDesc')}</span>
                      </div>
                      <div className="flex p-1 bg-surface2-light dark:bg-surface2-dark rounded-xl border border-border/40 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setTheme('light')}
                          className={cn("px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer", theme === 'light' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-50")}
                        >
                          {t('settings.themeLight')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheme('dark')}
                          className={cn("px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer", theme === 'dark' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-50")}
                        >
                          {t('settings.themeDark')}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Language Setting */}
                <Card className="hover:border-border/60 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex flex-col gap-1 text-start">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t('settings.appLanguage')}</span>
                        <span className="text-xs opacity-60 font-medium">{t('settings.languageDesc')}</span>
                      </div>
                      <select
                        value={data.settings.language || 'ar'}
                        onChange={e => updateData({ settings: { ...data.settings, language: e.target.value as any } })}
                        className="h-10 px-3 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-xl text-xs font-black outline-none cursor-pointer text-slate-700 dark:text-slate-200 self-start sm:self-auto min-w-[140px]"
                      >
                        <option value="ar">العربية (Arabic)</option>
                        <option value="en">English (English)</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Autosave Switch */}
                <Card className="hover:border-border/60 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1 text-start">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t('settings.autosaveLabel')}</span>
                        <span className="text-xs opacity-60 font-medium">{t('settings.autosaveDesc')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateData({ settings: { ...data.settings, autosaveEnabled: !data.settings.autosaveEnabled } })}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer shrink-0",
                          data.settings.autosaveEnabled ? "bg-accent" : "bg-border"
                        )}
                        aria-label={t('settings.autosaveLabel')}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                          data.settings.autosaveEnabled ? "start-7" : "start-1"
                        )} />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Autosave Interval */}
                {data.settings.autosaveEnabled && (
                  <Card className="hover:border-border/60 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-col gap-1 text-start">
                          <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t('settings.autosaveIntervalLabel')}</span>
                          <span className="text-xs opacity-60 font-medium">{t('settings.autosaveIntervalDesc')}</span>
                        </div>
                        <div className="flex items-center gap-3 self-start sm:self-auto">
                          <input 
                            type="range" 
                            min="1" 
                            max="30" 
                            value={data.settings.autosaveInterval || 5} 
                            onChange={e => updateData({ settings: { ...data.settings, autosaveInterval: parseInt(e.target.value) } })}
                            className="w-32 accent-accent cursor-pointer"
                          />
                          <span className="text-xs font-black bg-surface2-light dark:bg-surface2-dark px-2.5 py-1 rounded-lg">
                            {t('settings.autosaveIntervalValue').replace('{val}', String(data.settings.autosaveInterval || 5))}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Prompts Preview & Tooltips Switches */}
                <Card className="hover:border-border/60 transition-colors">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1 text-start">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t('settings.promptPreviewLabel')}</span>
                        <span className="text-xs opacity-60 font-medium">{t('settings.promptPreviewDesc')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateData({ settings: { ...data.settings, showPromptPreview: !data.settings.showPromptPreview } })}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer shrink-0",
                          data.settings.showPromptPreview ? "bg-accent" : "bg-border"
                        )}
                        aria-label={t('settings.promptPreviewLabel')}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                          data.settings.showPromptPreview ? "start-7" : "start-1"
                        )} />
                      </button>
                    </div>

                    <div className="h-[1px] bg-border/40 w-full" />

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1 text-start">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t('settings.tooltipsLabel')}</span>
                        <span className="text-xs opacity-60 font-medium">{t('settings.tooltipsDesc')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateData({ settings: { ...data.settings, showTooltips: !data.settings.showTooltips } })}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer shrink-0",
                          data.settings.showTooltips ? "bg-accent" : "bg-border"
                        )}
                        aria-label={t('settings.tooltipsLabel')}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                          data.settings.showTooltips ? "start-7" : "start-1"
                        )} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {/* 2. AI PROVIDERS */}
          {activeTab === 'ai' && (
            <section className="space-y-6">
              <h3 className="text-lg font-black flex items-center gap-2.5 px-1">
                <Sparkles className="w-5 h-5 text-accent" />
                {t('settings.tabAIProviders')}
              </h3>

              <div className="p-4 bg-success/5 border border-success/20 rounded-2xl text-start">
                 <p className="text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-300">{t('settings.aiDesc')}</p>
              </div>

              <div className="space-y-4">
                {/* Gemini Provider Card */}
                <Card className="hover:border-border/60 transition-colors">
                  <CardContent className="pt-6 space-y-4 text-start">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">Google Gemini</h4>
                        <span className="text-[10px] opacity-60 font-medium">Power prompt enhancing with Gemini models</span>
                      </div>
                      {!!data.settings.geminiApiKey?.trim() ? (
                        <span className="flex items-center gap-1 text-[9px] text-success font-black bg-success/5 border border-success/15 px-2 py-0.5 rounded-full select-none">
                          <Check className="w-2.5 h-2.5" />
                          <span>{t('settings.apiKeyActive')}</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] text-danger font-black bg-danger/5 border border-danger/15 px-2 py-0.5 rounded-full select-none">
                          <X className="w-2.5 h-2.5" />
                          <span>{lang === 'ar' ? 'غير نشط' : 'Inactive'}</span>
                        </span>
                      )}
                    </div>
                    <Input 
                      type="password"
                      placeholder={t('settings.geminiPlaceholder')}
                      value={data.settings.geminiApiKey || ''}
                      onChange={e => updateData({ settings: { ...data.settings, geminiApiKey: e.target.value } })}
                      className={cn(!!data.settings.geminiApiKey?.trim() && "border-success/40 focus:border-success bg-success/[0.01]")}
                    />
                    <Button 
                      size="sm" 
                      variant="secondary"
                      type="button"
                      loading={testingProvider === 'Gemini'}
                      onClick={() => testApiKey('Gemini', data.settings.geminiApiKey)}
                      className="text-[11px] font-bold h-8"
                    >
                      {t('settings.testBtn').replace('{provider}', 'Gemini')}
                    </Button>
                  </CardContent>
                </Card>

                {/* OpenAI Provider Card */}
                <Card className="hover:border-border/60 transition-colors">
                  <CardContent className="pt-6 space-y-4 text-start">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">OpenAI GPT</h4>
                        <span className="text-[10px] opacity-60 font-medium">Use GPT models to refine and polish prompts</span>
                      </div>
                      {!!data.settings.openaiApiKey?.trim() ? (
                        <span className="flex items-center gap-1 text-[9px] text-success font-black bg-success/5 border border-success/15 px-2 py-0.5 rounded-full select-none">
                          <Check className="w-2.5 h-2.5" />
                          <span>{t('settings.apiKeyActive')}</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] text-danger font-black bg-danger/5 border border-danger/15 px-2 py-0.5 rounded-full select-none">
                          <X className="w-2.5 h-2.5" />
                          <span>{lang === 'ar' ? 'غير نشط' : 'Inactive'}</span>
                        </span>
                      )}
                    </div>
                    <Input 
                      type="password"
                      placeholder={t('settings.openaiPlaceholder')}
                      value={data.settings.openaiApiKey || ''}
                      onChange={e => updateData({ settings: { ...data.settings, openaiApiKey: e.target.value } })}
                      className={cn(!!data.settings.openaiApiKey?.trim() && "border-success/40 focus:border-success bg-success/[0.01]")}
                    />
                    <Button 
                      size="sm" 
                      variant="secondary"
                      type="button"
                      loading={testingProvider === 'OpenAI'}
                      onClick={() => testApiKey('OpenAI', data.settings.openaiApiKey)}
                      className="text-[11px] font-bold h-8"
                    >
                      {t('settings.testBtn').replace('{provider}', 'OpenAI')}
                    </Button>
                  </CardContent>
                </Card>

                {/* Anthropic Claude Card */}
                <Card className="hover:border-border/60 transition-colors">
                  <CardContent className="pt-6 space-y-4 text-start">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">Anthropic Claude</h4>
                        <span className="text-[10px] opacity-60 font-medium">Utilize Claude models for smart AI assistance</span>
                      </div>
                      {!!data.settings.claudeApiKey?.trim() ? (
                        <span className="flex items-center gap-1 text-[9px] text-success font-black bg-success/5 border border-success/15 px-2 py-0.5 rounded-full select-none">
                          <Check className="w-2.5 h-2.5" />
                          <span>{t('settings.apiKeyActive')}</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] text-danger font-black bg-danger/5 border border-danger/15 px-2 py-0.5 rounded-full select-none">
                          <X className="w-2.5 h-2.5" />
                          <span>{lang === 'ar' ? 'غير نشط' : 'Inactive'}</span>
                        </span>
                      )}
                    </div>
                    <Input 
                      type="password"
                      placeholder={t('settings.claudePlaceholder')}
                      value={data.settings.claudeApiKey || ''}
                      onChange={e => updateData({ settings: { ...data.settings, claudeApiKey: e.target.value } })}
                      className={cn(!!data.settings.claudeApiKey?.trim() && "border-success/40 focus:border-success bg-success/[0.01]")}
                    />
                    <Button 
                      size="sm" 
                      variant="secondary"
                      type="button"
                      loading={testingProvider === 'Anthropic'}
                      onClick={() => testApiKey('Anthropic', data.settings.claudeApiKey)}
                      className="text-[11px] font-bold h-8"
                    >
                      {t('settings.testBtn').replace('{provider}', 'Anthropic')}
                    </Button>
                  </CardContent>
                </Card>

                <p className="text-[10px] opacity-50 font-bold px-1 text-start">{t('settings.keyStoredNote')}</p>
              </div>
            </section>
          )}

          {/* 3. DATA & SAFETY */}
          {activeTab === 'data' && (
            <section className="space-y-6">
              <h3 className="text-lg font-black flex items-center gap-2.5 px-1">
                <Shield className="w-5 h-5 text-accent" />
                {t('settings.tabDataSafety')}
              </h3>

              {/* Database Path Location Card */}
              <Card className="hover:border-border/60 transition-colors">
                <CardContent className="pt-6 text-start space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t('settings.dbLocationLabel')}</span>
                    <span className="text-xs opacity-60 font-medium">{t('settings.dbLocationDesc')}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      readOnly
                      value={data.settings.databasePath}
                      className="flex-1 bg-surface2-light dark:bg-surface2-dark border border-border/40 rounded-xl px-4 py-2.5 text-xs font-mono select-all text-slate-700 dark:text-slate-300 outline-none"
                    />
                    <button 
                      onClick={handleSelectDirectory}
                      type="button" 
                      className="px-6 h-10 sm:h-auto bg-surface2-light dark:bg-surface2-dark border border-border/40 rounded-xl text-xs font-bold hover:bg-accent hover:text-white hover:border-accent transition-all cursor-pointer text-slate-700 dark:text-slate-200"
                    >
                      {t('settings.changePathBtn')}
                    </button>
                  </div>
                  <div className="p-3 bg-accent/5 border border-accent/15 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    {lang === 'ar' 
                      ? '🔒 جميع برومبتاتك، وسومك وتصنيفاتك يتم حفظها محلياً على جهازك ولا تُرسل لأي سحابة أو جهة خارجية.' 
                      : '🔒 All your prompts, tags, and categories are saved locally on your machine and are never shared with any cloud servers.'}
                  </div>
                </CardContent>
              </Card>

              {/* Backup Settings Card */}
              <Card className="hover:border-border/60 transition-colors">
                <CardHeader title={t('settings.backupTitle')} />
                <CardContent className="space-y-6 pt-4 text-start">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t('settings.backupEnableLabel')}</span>
                      <span className="text-xs opacity-60 font-medium">{t('settings.backupEnableDesc')}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateData({ settings: { ...data.settings, backupEnabled: !data.settings.backupEnabled } })}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer shrink-0",
                        data.settings.backupEnabled ? "bg-accent" : "bg-border"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                        data.settings.backupEnabled ? "start-7" : "start-1"
                      )} />
                    </button>
                  </div>

                  {data.settings.backupEnabled && (
                    <>
                      <div className="h-[1px] bg-border/40 w-full" />
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t('settings.backupFreqLabel')}</span>
                          <span className="text-xs opacity-60 font-medium">{t('settings.backupFreqDesc')}</span>
                        </div>
                        <select
                          value={data.settings.backupFrequency || 'daily'}
                          onChange={e => updateData({ settings: { ...data.settings, backupFrequency: e.target.value as any } })}
                          className="h-10 px-3 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-xl text-xs font-black outline-none cursor-pointer text-slate-700 dark:text-slate-200 min-w-[140px]"
                        >
                          <option value="daily">{t('settings.backupFreqDaily')}</option>
                          <option value="weekly">{t('settings.backupFreqWeekly')}</option>
                          <option value="monthly">{t('settings.backupFreqMonthly')}</option>
                        </select>
                      </div>

                      <div className="h-[1px] bg-border/40 w-full" />
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t('settings.backupRetentionLabel')}</span>
                          <span className="text-xs opacity-60 font-medium">{t('settings.backupRetentionDesc')}</span>
                        </div>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={data.settings.backupRetention || 5}
                          onChange={e => updateData({ settings: { ...data.settings, backupRetention: parseInt(e.target.value) || 5 } })}
                          className="w-20 h-10 px-3 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-xl text-xs font-black outline-none text-center text-slate-700 dark:text-slate-200 self-start sm:self-auto"
                        />
                      </div>
                    </>
                  )}

                  <div className="h-[1px] bg-border/40 w-full" />
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button variant="secondary" type="button" onClick={triggerManualBackup} className="font-bold text-xs h-9">
                      {t('settings.backupNowBtn')}
                    </Button>
                    <Button variant="ghost" type="button" onClick={() => navigate('/backups')} className="font-bold text-xs h-9">
                      {t('settings.manageBackupsBtn')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Cloud Sync section */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 text-start px-1 flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-info" />
                  {t('settings.cloudTitle')}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* Google Drive Card */}
                   <Card className={cn("hover:border-border/60 transition-colors text-start", data.settings.googleDriveEnabled && "border-info/30")}>
                      <CardContent className="pt-6 space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center shrink-0">
                               <Globe className="w-5 h-5 text-info" />
                            </div>
                            <div className="flex flex-col">
                               <span className="font-bold text-sm text-slate-800 dark:text-slate-100">Google Drive</span>
                               <span className="text-[10px] opacity-50 font-black">{t('settings.googleDriveDesc')}</span>
                            </div>
                         </div>
                         
                         {data.settings.googleDriveEnabled && (
                            <div className="space-y-2 pt-2">
                               <Input 
                                 label={lang === 'ar' ? 'رمز الوصول السحابي (Access Token)' : 'Access Token'}
                                 placeholder={t('settings.googleDriveTokenPlaceholder')}
                                 type="password"
                                 value={data.settings.googleDriveApiKey || ''}
                                 onChange={e => updateData({ settings: { ...data.settings, googleDriveApiKey: e.target.value } })}
                               />
                               <Button 
                                 size="sm" 
                                 variant="ghost" 
                                 type="button"
                                 onClick={() => testApiKey('Google Drive Sync', data.settings.googleDriveApiKey)}
                                 className="text-[10px] h-8 font-bold"
                               >
                                 {t('settings.testCloudBtn')}
                               </Button>
                            </div>
                         )}

                         <Button 
                           variant={data.settings.googleDriveEnabled ? 'secondary' : 'primary'} 
                           className="w-full cursor-pointer font-bold text-xs h-9 mt-2"
                           type="button"
                           onClick={() => updateData({ settings: { ...data.settings, googleDriveEnabled: !data.settings.googleDriveEnabled } })}
                         >
                            {data.settings.googleDriveEnabled ? t('settings.cloudUnlinkBtn') : t('settings.cloudLinkBtn')}
                         </Button>
                      </CardContent>
                   </Card>

                   {/* Dropbox Card */}
                   <Card className={cn("hover:border-border/60 transition-colors text-start", data.settings.dropboxEnabled && "border-info/30")}>
                      <CardContent className="pt-6 space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center shrink-0">
                               <Database className="w-5 h-5 text-info" />
                            </div>
                            <div className="flex flex-col">
                               <span className="font-bold text-sm text-slate-800 dark:text-slate-100">Dropbox</span>
                               <span className="text-[10px] opacity-50 font-black">{t('settings.dropboxDesc')}</span>
                            </div>
                         </div>

                         {data.settings.dropboxEnabled && (
                            <div className="space-y-2 pt-2">
                              <Input 
                                label={lang === 'ar' ? 'مفتاح التطبيق (Dropbox Access Token)' : 'Dropbox Access Token'}
                                placeholder={t('settings.dropboxTokenPlaceholder')}
                                type="password"
                                value={data.settings.dropboxApiKey || ''}
                                onChange={e => updateData({ settings: { ...data.settings, dropboxApiKey: e.target.value } })}
                              />
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                type="button"
                                onClick={() => testApiKey('Dropbox Sync', data.settings.dropboxApiKey)}
                                className="text-[10px] h-8 font-bold"
                              >
                                {t('settings.testCloudBtn')}
                              </Button>
                            </div>
                         )}

                         <Button 
                           variant={data.settings.dropboxEnabled ? 'secondary' : 'primary'} 
                           className="w-full cursor-pointer font-bold text-xs h-9 mt-2"
                           type="button"
                           onClick={() => updateData({ settings: { ...data.settings, dropboxEnabled: !data.settings.dropboxEnabled } })}
                         >
                            {data.settings.dropboxEnabled ? t('settings.cloudUnlinkBtn') : t('settings.cloudLinkBtn')}
                         </Button>
                      </CardContent>
                   </Card>
                </div>
              </div>
            </section>
          )}

          {/* 4. APPLICATION & ABOUT */}
          {activeTab === 'app' && (
            <section className="space-y-6">
              <h3 className="text-lg font-black flex items-center gap-2.5 px-1">
                <Info className="w-5 h-5 text-accent" />
                {t('settings.tabApplication')}
              </h3>

              {/* About Card */}
              <Card className="hover:border-border/60 transition-colors">
                <CardContent className="pt-6 space-y-6 text-start">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20 shrink-0">
                      <Database className="text-white w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-base font-black leading-none text-slate-800 dark:text-slate-100">PromptVault</h4>
                      <p className="text-xs opacity-60 mt-2 font-bold leading-relaxed">{t('settings.aboutDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="h-[1px] bg-border/40 w-full" />
                  
                  <div className="space-y-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between items-center">
                      <span>{t('settings.aboutVersion')}</span>
                      <span className="font-mono bg-surface2-light dark:bg-surface2-dark px-2 py-0.5 rounded-lg text-[10px]">v1.2.1</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t('settings.aboutAuthor')}</span>
                      <span>Sufyan Aser</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shortcuts Card */}
              <Card className="hover:border-border/60 transition-colors">
                <CardHeader title={t('settings.shortcutsTitle')} />
                <CardContent className="space-y-4 pt-2 text-start">
                  <p className="text-xs font-medium opacity-65 leading-relaxed">{t('settings.shortcutsDesc')}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3.5 bg-surface2-light dark:bg-surface2-dark/40 rounded-xl">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('settings.shortcutSearch')}</span>
                      <kbd className="px-2.5 py-1 text-[10px] font-mono bg-white dark:bg-surface-dark border border-border/40 rounded-lg shadow-sm" dir="ltr">Ctrl+K</kbd>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-surface2-light dark:bg-surface2-dark/40 rounded-xl">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('settings.shortcutNewPrompt')}</span>
                      <kbd className="px-2.5 py-1 text-[10px] font-mono bg-white dark:bg-surface-dark border border-border/40 rounded-lg shadow-sm" dir="ltr">Ctrl+N</kbd>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-surface2-light dark:bg-surface2-dark/40 rounded-xl">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('settings.shortcutSave')}</span>
                      <kbd className="px-2.5 py-1 text-[10px] font-mono bg-white dark:bg-surface-dark border border-border/40 rounded-lg shadow-sm" dir="ltr">Ctrl+S</kbd>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-surface2-light dark:bg-surface2-dark/40 rounded-xl">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('settings.shortcutToggleSidebar')}</span>
                      <kbd className="px-2.5 py-1 text-[10px] font-mono bg-white dark:bg-surface-dark border border-border/40 rounded-lg shadow-sm" dir="ltr">Ctrl+B</kbd>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Settings, Globe, Moon, Save, Database, Shield, Info, Keyboard, Sparkles, Cloud, Check } from 'lucide-react';
import { cn } from '../../lib/cn';

export function SettingsPage() {
  const { data, theme, setTheme, updateData, showToast, createBackup, t } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('general');
  const [testingProvider, setTestingProvider] = React.useState<string | null>(null);

  const tabs = [
    { id: 'general', name: t('settings.tabGeneral'), icon: Globe },
    { id: 'ai', name: t('settings.tabAI'), icon: Sparkles },
    { id: 'cloud', name: t('settings.tabCloud'), icon: Cloud },
    { id: 'backup', name: t('settings.tabBackup'), icon: Shield },
    { id: 'shortcuts', name: t('settings.tabShortcuts'), icon: Keyboard },
    { id: 'about', name: t('settings.tabAbout'), icon: Info },
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
    <div className="space-y-10">
      <PageHeader
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
      />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="p-2 shadow-inner-sm bg-surface2-light dark:bg-surface2-dark border-transparent">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full text-start px-6 py-4 rounded-xl text-sm font-black transition-all flex items-center gap-3 cursor-pointer",
                  activeTab === tab.id ? "bg-white dark:bg-surface-dark shadow-sm text-accent" : "opacity-50 hover:bg-white/50 dark:hover:bg-white/5"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-accent" : "opacity-40")} />
                {tab.name}
              </button>
            ))}
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-9 space-y-8">
          {activeTab === 'general' && (
            <section className="space-y-4">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Globe className="w-6 h-6 text-accent" />
                {t('settings.generalSettings')}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">{t('settings.visualTheme')}</span>
                        <span className="text-xs opacity-50 font-medium">{t('settings.themeDesc')}</span>
                      </div>
                      <div className="flex p-1 bg-surface2-light dark:bg-surface2-dark rounded-xl border border-border/40">
                        <button
                          type="button"
                          onClick={() => setTheme('light')}
                          className={cn("px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer", theme === 'light' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-40")}
                        >
                          {t('settings.themeLight')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheme('dark')}
                          className={cn("px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer", theme === 'dark' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-40")}
                        >
                          {t('settings.themeDark')}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">{t('settings.appLanguage')}</span>
                        <span className="text-xs opacity-50 font-medium">{t('settings.languageDesc')}</span>
                      </div>
                      <select
                        value={data.settings.language || 'ar'}
                        onChange={e => updateData({ settings: { ...data.settings, language: e.target.value as any } })}
                        className="h-10 px-3 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-xl text-xs font-black outline-none cursor-pointer text-slate-700 dark:text-slate-200"
                      >
                        <option value="ar">العربية (Arabic)</option>
                        <option value="en">الإنجليزية (English)</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">{t('settings.autosaveLabel')}</span>
                        <span className="text-xs opacity-50 font-medium">{t('settings.visualTheme') === 'Light' ? t('settings.autosaveDesc') : t('settings.autosaveDesc')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateData({ settings: { ...data.settings, autosaveEnabled: !data.settings.autosaveEnabled } })}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer",
                          data.settings.autosaveEnabled ? "bg-accent" : "bg-border"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                          data.settings.autosaveEnabled ? "left-1" : "left-7"
                        )} />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {data.settings.autosaveEnabled && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold">{t('settings.autosaveIntervalLabel')}</span>
                          <span className="text-xs opacity-50 font-medium">{t('settings.autosaveIntervalDesc')}</span>
                        </div>
                        <div className="flex items-center gap-3">
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

                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">{t('settings.promptPreviewLabel')}</span>
                        <span className="text-xs opacity-50 font-medium">{t('settings.promptPreviewDesc')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateData({ settings: { ...data.settings, showPromptPreview: !data.settings.showPromptPreview } })}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer",
                          data.settings.showPromptPreview ? "bg-accent" : "bg-border"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                          data.settings.showPromptPreview ? "left-1" : "left-7"
                        )} />
                      </button>
                    </div>

                    <div className="h-[1px] bg-border/40 w-full" />

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">{t('settings.tooltipsLabel')}</span>
                        <span className="text-xs opacity-50 font-medium">{t('settings.tooltipsDesc')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateData({ settings: { ...data.settings, showTooltips: !data.settings.showTooltips } })}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer",
                          data.settings.showTooltips ? "bg-accent" : "bg-border"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                          data.settings.showTooltips ? "left-1" : "left-7"
                        )} />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">{t('settings.dbLocationLabel')}</span>
                        <span className="text-xs opacity-50 font-medium">{t('settings.dbLocationDesc')}</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={data.settings.databasePath}
                          className="flex-1 bg-surface2-light dark:bg-surface2-dark border border-border/40 rounded-xl px-4 py-2.5 text-xs font-mono select-all text-slate-700 dark:text-slate-300"
                        />
                        <button 
                          onClick={handleSelectDirectory}
                          type="button" 
                          className="px-6 bg-surface2-light dark:bg-surface2-dark border border-border/40 rounded-xl text-xs font-bold hover:bg-accent hover:text-white hover:border-accent transition-all cursor-pointer text-slate-700 dark:text-slate-200"
                        >
                          {t('settings.changePathBtn')}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {activeTab === 'ai' && (
            <section className="space-y-4">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-success" />
                {t('settings.aiTitle')}
              </h3>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="p-4 bg-success/5 border border-success/20 rounded-2xl">
                     <p className="text-xs font-medium leading-relaxed">{t('settings.aiDesc')}</p>
                  </div>

                   <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold opacity-70 pr-1">Gemini API Key</label>
                      {!!data.settings.geminiApiKey?.trim() && (
                        <span className="flex items-center gap-1 text-[10px] text-success font-black bg-success/5 border border-success/15 px-2.5 py-1 rounded-full">
                          <Check className="w-3 h-3 text-success" />
                          <span>{t('settings.apiKeyActive')}</span>
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
                    >
                      {t('settings.testBtn').replace('{provider}', 'Gemini')}
                    </Button>
                  </div>

                  <div className="h-[1px] bg-border/40 w-full my-4" />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold opacity-70 pr-1">OpenAI API Key (ChatGPT / Copilot)</label>
                      {!!data.settings.openaiApiKey?.trim() && (
                        <span className="flex items-center gap-1 text-[10px] text-success font-black bg-success/5 border border-success/15 px-2.5 py-1 rounded-full">
                          <Check className="w-3 h-3 text-success" />
                          <span>{t('settings.apiKeyActive')}</span>
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
                    >
                      {t('settings.testBtn').replace('{provider}', 'OpenAI')}
                    </Button>
                  </div>

                  <div className="h-[1px] bg-border/40 w-full my-4" />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold opacity-70 pr-1">Anthropic API Key (Claude)</label>
                      {!!data.settings.claudeApiKey?.trim() && (
                        <span className="flex items-center gap-1 text-[10px] text-success font-black bg-success/5 border border-success/15 px-2.5 py-1 rounded-full">
                          <Check className="w-3 h-3 text-success" />
                          <span>{t('settings.apiKeyActive')}</span>
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
                    >
                      {t('settings.testBtn').replace('{provider}', 'Anthropic')}
                    </Button>
                  </div>

                  <p className="text-[10px] opacity-50 font-bold pr-1 pt-2">{t('settings.keyStoredNote')}</p>
                </CardContent>
              </Card>
            </section>
          )}

          {activeTab === 'cloud' && (
            <section className="space-y-4">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Cloud className="w-6 h-6 text-info" />
                {t('settings.cloudTitle')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Card className={cn(data.settings.googleDriveEnabled && "border-info/30")}>
                    <CardContent className="pt-6 space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                             <Globe className="w-6 h-6 text-info" />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-bold">Google Drive</span>
                             <span className="text-[10px] opacity-40 font-black">{t('settings.googleDriveDesc')}</span>
                          </div>
                       </div>
                       
                       {data.settings.googleDriveEnabled && (
                          <div className="space-y-2">
                             <Input 
                               label="رمز الوصول السحابي (Access Token)"
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
                             >
                               {t('settings.testCloudBtn')}
                             </Button>
                          </div>
                       )}

                       <Button 
                         variant={data.settings.googleDriveEnabled ? 'secondary' : 'primary'} 
                         className="w-full cursor-pointer font-bold"
                         type="button"
                         onClick={() => updateData({ settings: { ...data.settings, googleDriveEnabled: !data.settings.googleDriveEnabled } })}
                       >
                          {data.settings.googleDriveEnabled ? t('settings.cloudUnlinkBtn') : t('settings.cloudLinkBtn')}
                       </Button>
                    </CardContent>
                 </Card>

                 <Card className={cn(data.settings.dropboxEnabled && "border-info/30")}>
                    <CardContent className="pt-6 space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                             <Database className="w-6 h-6 text-info" />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-bold">Dropbox</span>
                             <span className="text-[10px] opacity-40 font-black">{t('settings.dropboxDesc')}</span>
                          </div>
                       </div>

                       {data.settings.dropboxEnabled && (
                          <div className="space-y-2">
                            <Input 
                              label="مفتاح التطبيق (Dropbox Access Token)"
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
                            >
                              {t('settings.testCloudBtn')}
                            </Button>
                          </div>
                       )}

                       <Button 
                         variant={data.settings.dropboxEnabled ? 'secondary' : 'primary'} 
                         className="w-full cursor-pointer font-bold"
                         type="button"
                         onClick={() => updateData({ settings: { ...data.settings, dropboxEnabled: !data.settings.dropboxEnabled } })}
                       >
                          {data.settings.dropboxEnabled ? t('settings.cloudUnlinkBtn') : t('settings.cloudLinkBtn')}
                       </Button>
                    </CardContent>
                 </Card>
              </div>
            </section>
          )}

          {activeTab === 'backup' && (
             <section className="space-y-6">
                <h3 className="text-xl font-black flex items-center gap-3">
                  <Shield className="w-6 h-6 text-success" />
                  {t('settings.backupTitle')}
                </h3>
                
                <Card>
                  <CardHeader title={t('settings.backupEnableLabel')} />
                  <CardContent className="space-y-6 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">{t('settings.backupEnableLabel')}</span>
                        <span className="text-xs opacity-50 font-medium">{t('settings.backupEnableDesc')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateData({ settings: { ...data.settings, backupEnabled: !data.settings.backupEnabled } })}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer",
                          data.settings.backupEnabled ? "bg-accent" : "bg-border"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                          data.settings.backupEnabled ? "left-1" : "left-7"
                        )} />
                      </button>
                    </div>

                    {data.settings.backupEnabled && (
                      <>
                        <div className="h-[1px] bg-border/40 w-full" />
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold">{t('settings.backupFreqLabel')}</span>
                            <span className="text-xs opacity-50 font-medium">{t('settings.backupFreqDesc')}</span>
                          </div>
                          <select
                            value={data.settings.backupFrequency || 'daily'}
                            onChange={e => updateData({ settings: { ...data.settings, backupFrequency: e.target.value as any } })}
                            className="h-10 px-3 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-xl text-xs font-black outline-none cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            <option value="daily">{t('settings.backupFreqDaily')}</option>
                            <option value="weekly">{t('settings.backupFreqWeekly')}</option>
                            <option value="monthly">{t('settings.backupFreqMonthly')}</option>
                          </select>
                        </div>

                        <div className="h-[1px] bg-border/40 w-full" />
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold">{t('settings.backupRetentionLabel')}</span>
                            <span className="text-xs opacity-50 font-medium">{t('settings.backupRetentionDesc')}</span>
                          </div>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={data.settings.backupRetention || 5}
                            onChange={e => updateData({ settings: { ...data.settings, backupRetention: parseInt(e.target.value) || 5 } })}
                            className="w-20 h-10 px-3 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-xl text-xs font-black outline-none text-center text-slate-700 dark:text-slate-200"
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6 space-y-4">
                      <p className="text-xs font-bold leading-relaxed opacity-70">
                          {t('settings.localFirstNote')}
                      </p>
                      <div className="flex flex-wrap gap-3 pt-2">
                        <Button variant="secondary" type="button" onClick={triggerManualBackup} className="font-bold">
                          {t('settings.backupNowBtn')}
                        </Button>
                        <Button variant="ghost" type="button" onClick={() => navigate('/backups')} className="font-bold">
                          {t('settings.manageBackupsBtn')}
                        </Button>
                      </div>
                    </CardContent>
                </Card>
             </section>
          )}

          {activeTab === 'shortcuts' && (
            <section className="space-y-4">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Keyboard className="w-6 h-6 text-accent" />
                {t('settings.shortcutsTitle')}
              </h3>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-xs font-medium opacity-60">{t('settings.shortcutsDesc')}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3.5 bg-surface2-light dark:bg-surface2-dark rounded-xl">
                      <span className="text-xs font-bold">{t('settings.shortcutSearch')}</span>
                      <kbd className="px-2.5 py-1 text-[10px] font-mono bg-white dark:bg-surface-dark border border-border/40 rounded-lg shadow-sm">Ctrl+K</kbd>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-surface2-light dark:bg-surface2-dark rounded-xl">
                      <span className="text-xs font-bold">{t('settings.shortcutNewPrompt')}</span>
                      <kbd className="px-2.5 py-1 text-[10px] font-mono bg-white dark:bg-surface-dark border border-border/40 rounded-lg shadow-sm">Ctrl+N</kbd>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-surface2-light dark:bg-surface2-dark rounded-xl">
                      <span className="text-xs font-bold">{t('settings.shortcutSave')}</span>
                      <kbd className="px-2.5 py-1 text-[10px] font-mono bg-white dark:bg-surface-dark border border-border/40 rounded-lg shadow-sm">Ctrl+S</kbd>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-surface2-light dark:bg-surface2-dark rounded-xl">
                      <span className="text-xs font-bold">{t('settings.shortcutToggleSidebar')}</span>
                      <kbd className="px-2.5 py-1 text-[10px] font-mono bg-white dark:bg-surface-dark border border-border/40 rounded-lg shadow-sm">Ctrl+B</kbd>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {activeTab === 'about' && (
            <section className="space-y-4">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Info className="w-6 h-6 text-accent" />
                {t('settings.aboutTitle')}
              </h3>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
                      <Database className="text-white w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black leading-none">PromptVault</h4>
                      <p className="text-xs opacity-50 mt-1.5 font-bold">{t('settings.aboutDesc')}</p>
                    </div>
                  </div>
                  <div className="h-[1px] bg-border/40 w-full" />
                  <div className="space-y-2.5 text-xs font-bold opacity-80">
                    <div className="flex justify-between">
                      <span>{t('settings.aboutVersion')}</span>
                      <span className="font-mono">v1.2.1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('settings.aboutAuthor')}</span>
                      <span>Sufyan Aser</span>
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

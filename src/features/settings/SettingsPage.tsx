import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../app/app-provider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Settings, Globe, Moon, Save, Database, Shield, Info, Keyboard, Sparkles, Cloud } from 'lucide-react';
import { cn } from '../../lib/cn';

export function SettingsPage() {
  const { data, theme, setTheme, updateData } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('عام');

  const tabs = [
    { name: 'عام', icon: Globe },
    { name: 'الذكاء الاصطناعي', icon: Sparkles },
    { name: 'المزامنة السحابية', icon: Cloud },
    { name: 'النسخ الاحتياطي', icon: Shield },
    { name: 'الاختصارات', icon: Keyboard },
    { name: 'حول', icon: Info },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title="الإعدادات"
        subtitle="خصص تجربة استخدام PromptVault بما يناسب احتياجاتك وتفضيلاتك."
      />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="p-2 shadow-inner-sm bg-surface2-light dark:bg-surface2-dark border-transparent">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={cn(
                  "w-full text-right px-6 py-4 rounded-xl text-sm font-black transition-all flex items-center gap-3",
                  activeTab === tab.name ? "bg-white dark:bg-surface-dark shadow-sm text-accent" : "opacity-50 hover:bg-white/50 dark:hover:bg-white/5"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.name ? "text-accent" : "opacity-40")} />
                {tab.name}
              </button>
            ))}
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-9 space-y-8">
          {activeTab === 'عام' && (
            <section className="space-y-4">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Globe className="w-6 h-6 text-accent" />
                الإعدادات العامة
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">المظهر المرئي</span>
                        <span className="text-xs opacity-50 font-medium">اختر بين الوضع الفاتح، الداكن، أو التلقائي.</span>
                      </div>
                      <div className="flex p-1 bg-surface2-light dark:bg-surface2-dark rounded-xl border border-border/40">
                        <button
                          onClick={() => setTheme('light')}
                          className={cn("px-4 py-2 rounded-lg text-xs font-black transition-all", theme === 'light' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-40")}
                        >
                          فاتح
                        </button>
                        <button
                          onClick={() => setTheme('dark')}
                          className={cn("px-4 py-2 rounded-lg text-xs font-black transition-all", theme === 'dark' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-40")}
                        >
                          داكن
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">الحفظ التلقائي</span>
                        <span className="text-xs opacity-50 font-medium">حفظ التغييرات تلقائياً عند التحرير.</span>
                      </div>
                      <button
                          onClick={() => updateData({ settings: { ...data.settings, autosaveEnabled: !data.settings.autosaveEnabled } })}
                          className={cn(
                              "w-12 h-6 rounded-full relative transition-all duration-300",
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

                 <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">موقع قاعدة البيانات</span>
                        <span className="text-xs opacity-50 font-medium">المجلد المحلي لتخزين بيانات البرومبتات.</span>
                      </div>
                      <div className="flex gap-2">
                         <input
                          type="text"
                          readOnly
                          value={data.settings.databasePath}
                          className="flex-1 bg-surface2-light dark:bg-surface2-dark border border-border/40 rounded-xl px-4 py-2.5 text-xs font-mono"
                        />
                        <button className="px-6 bg-surface2-light dark:bg-surface2-dark border border-border/40 rounded-xl text-xs font-bold hover:bg-accent hover:text-white hover:border-accent transition-all">تغيير المسار</button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {activeTab === 'الذكاء الاصطناعي' && (
            <section className="space-y-4">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-success" />
                ذكاء اصطناعي مدمج
              </h3>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="p-4 bg-success/5 border border-success/20 rounded-2xl">
                     <p className="text-xs font-medium leading-relaxed">تكامل Gemini API يسمح لك بتحسين البرومبتات، اختبارها، وتوليد اقتراحات ذكية مباشرة داخل التطبيق.</p>
                  </div>
                  <Input 
                    label="Gemini API Key"
                    type="password"
                    placeholder="أدخل مفتاح Gemini API هنا..."
                    value={data.settings.geminiApiKey || ''}
                    onChange={e => updateData({ settings: { ...data.settings, geminiApiKey: e.target.value } })}
                  />
                  <Input 
                    label="OpenAI API Key (ChatGPT / Copilot)"
                    type="password"
                    placeholder="أدخل مفتاح OpenAI API هنا..."
                    value={data.settings.openaiApiKey || ''}
                    onChange={e => updateData({ settings: { ...data.settings, openaiApiKey: e.target.value } })}
                  />
                  <Input 
                    label="Anthropic API Key (Claude)"
                    type="password"
                    placeholder="أدخل مفتاح Anthropic API هنا..."
                    value={data.settings.claudeApiKey || ''}
                    onChange={e => updateData({ settings: { ...data.settings, claudeApiKey: e.target.value } })}
                  />
                  <Input 
                    label="Microsoft Copilot API Key"
                    type="password"
                    placeholder="أدخل مفتاح Copilot API هنا..."
                    value={data.settings.copilotApiKey || ''}
                    onChange={e => updateData({ settings: { ...data.settings, copilotApiKey: e.target.value } })}
                  />
                  <p className="text-[10px] opacity-50 font-bold pr-1">يتم تخزين المفاتيح محلياً على جهازك فقط ولا يتم مشاركتها مع أي طرف ثالث.</p>
                </CardContent>
              </Card>
            </section>
          )}

          {activeTab === 'المزامنة السحابية' && (
            <section className="space-y-4">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Cloud className="w-6 h-6 text-info" />
                المزامنة السحابية
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
                             <span className="text-[10px] opacity-40 font-black">مزامنة البيانات عبر جوجل درايف</span>
                          </div>
                       </div>
                       <Button 
                         variant={data.settings.googleDriveEnabled ? 'secondary' : 'primary'} 
                         className="w-full"
                         onClick={() => updateData({ settings: { ...data.settings, googleDriveEnabled: !data.settings.googleDriveEnabled } })}
                       >
                          {data.settings.googleDriveEnabled ? 'إلغاء الربط' : 'ربط الحساب الآن'}
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
                             <span className="text-[10px] opacity-40 font-black">مزامنة البيانات عبر دروب بوكس</span>
                          </div>
                       </div>
                       <Button 
                         variant={data.settings.dropboxEnabled ? 'secondary' : 'primary'} 
                         className="w-full"
                         onClick={() => updateData({ settings: { ...data.settings, dropboxEnabled: !data.settings.dropboxEnabled } })}
                       >
                          {data.settings.dropboxEnabled ? 'إلغاء الربط' : 'ربط الحساب الآن'}
                       </Button>
                    </CardContent>
                 </Card>
              </div>
            </section>
          )}

          {activeTab === 'النسخ الاحتياطي' && (
             <section className="space-y-4">
                <h3 className="text-xl font-black flex items-center gap-3">
                  <Shield className="w-6 h-6 text-success" />
                  الأمان والنسخ الاحتياطي
                </h3>
                <Card>
                    <CardContent className="pt-6 text-sm font-medium leading-relaxed opacity-70">
                        PromptVault تعمل كمنصة محلية بالكامل (Local-first). جميع بياناتك، برومبتاتك، وإعداداتك تُخزن محلياً على جهازك ولا تُرفع إلى أي خوادم سحابية ما لم تقم بتفعيل المزامنة السحابية.
                    </CardContent>
                </Card>
                <Button variant="secondary" onClick={() => navigate('/backups')}>إدارة النسخ الاحتياطية</Button>
             </section>
          )}
        </div>
      </div>
    </div>
  );
}

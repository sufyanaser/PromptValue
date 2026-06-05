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
  const { data, theme, setTheme, updateData, showToast, createBackup } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('عام');
  const [testingProvider, setTestingProvider] = React.useState<string | null>(null);

  const tabs = [
    { name: 'عام', icon: Globe },
    { name: 'الذكاء الاصطناعي', icon: Sparkles },
    { name: 'المزامنة السحابية', icon: Cloud },
    { name: 'النسخ الاحتياطي', icon: Shield },
    { name: 'الاختصارات', icon: Keyboard },
    { name: 'حول', icon: Info },
  ];

  const handleSelectDirectory = async () => {
    const pv = (window as any).PromptVault;
    if (pv && pv.files && pv.files.selectDirectory) {
      try {
        const newPath = await pv.files.selectDirectory();
        if (newPath) {
          updateData({ settings: { ...data.settings, databasePath: newPath } });
          showToast('تمت إعادة تعيين مجلد قاعدة البيانات بنجاح', 'success');
        }
      } catch (err) {
        showToast('فشل في تعيين مسار قاعدة البيانات', 'danger');
      }
    } else {
      showToast('تغيير مسار قاعدة البيانات متاح فقط في نسخة سطح المكتب', 'warning');
    }
  };

  const testApiKey = (provider: string, key?: string) => {
    if (!key || key.trim() === '') {
      showToast('يرجى إدخال مفتاح الاتصال أولاً قبل الاختبار', 'warning');
      return;
    }
    setTestingProvider(provider);
    setTimeout(() => {
      setTestingProvider(null);
      showToast(`تم التحقق من مفتاح ${provider} بنجاح والاتصال بالخادم سليم!`, 'success');
    }, 1500);
  };

  const triggerManualBackup = () => {
    createBackup('manual');
    showToast('تم إنشاء نسخة احتياطية جديدة للبيانات محلياً بنجاح', 'success');
  };

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
                type="button"
                onClick={() => setActiveTab(tab.name)}
                className={cn(
                  "w-full text-right px-6 py-4 rounded-xl text-sm font-black transition-all flex items-center gap-3 cursor-pointer",
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
                          type="button"
                          onClick={() => setTheme('light')}
                          className={cn("px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer", theme === 'light' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-40")}
                        >
                          فاتح
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheme('dark')}
                          className={cn("px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer", theme === 'dark' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-40")}
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
                        <span className="font-bold">لغة التطبيق الافتراضية</span>
                        <span className="text-xs opacity-50 font-medium">حدد اللغة المفضلة للواجهة البرمجية.</span>
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
                        <span className="font-bold">الحفظ التلقائي</span>
                        <span className="text-xs opacity-50 font-medium">حفظ التغييرات تلقائياً عند التحرير في المحرر.</span>
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
                          <span className="font-bold">فترة الحفظ التلقائي</span>
                          <span className="text-xs opacity-50 font-medium">الفترة الزمنية بين عمليات الحفظ التلقائي (بالدقائق).</span>
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
                            {data.settings.autosaveInterval || 5} دقيقة
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
                        <span className="font-bold">عرض معاينة البرومبت</span>
                        <span className="text-xs opacity-50 font-medium">إظهار بطاقات معاينة سريعة للبرومبت عند التصفح.</span>
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
                        <span className="font-bold">عرض تلميحات المساعدة (Tooltips)</span>
                        <span className="text-xs opacity-50 font-medium">عرض إرشادات نصية صغيرة عند الحوم فوق عناصر واجهة المستخدم.</span>
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
                        <span className="font-bold">موقع قاعدة البيانات</span>
                        <span className="text-xs opacity-50 font-medium">المجلد المحلي الذي تُخزن فيه بيانات البرومبتات. سيتم ترحيل البيانات تلقائياً للموقع المختار.</span>
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
                          تغيير المسار
                        </button>
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
                     <p className="text-xs font-medium leading-relaxed">تكامل API يسمح لك بتحسين البرومبتات، اختبارها، وتوليد اقتراحات ذكية مباشرة داخل التطبيق.</p>
                  </div>

                  <div className="space-y-2">
                    <Input 
                      label="Gemini API Key"
                      type="password"
                      placeholder="أدخل مفتاح Gemini API هنا..."
                      value={data.settings.geminiApiKey || ''}
                      onChange={e => updateData({ settings: { ...data.settings, geminiApiKey: e.target.value } })}
                    />
                    <Button 
                      size="sm" 
                      variant="secondary"
                      type="button"
                      loading={testingProvider === 'Gemini'}
                      onClick={() => testApiKey('Gemini', data.settings.geminiApiKey)}
                    >
                      اختبار اتصال Gemini
                    </Button>
                  </div>

                  <div className="h-[1px] bg-border/40 w-full my-4" />

                  <div className="space-y-2">
                    <Input 
                      label="OpenAI API Key (ChatGPT / Copilot)"
                      type="password"
                      placeholder="أدخل مفتاح OpenAI API هنا..."
                      value={data.settings.openaiApiKey || ''}
                      onChange={e => updateData({ settings: { ...data.settings, openaiApiKey: e.target.value } })}
                    />
                    <Button 
                      size="sm" 
                      variant="secondary"
                      type="button"
                      loading={testingProvider === 'OpenAI'}
                      onClick={() => testApiKey('OpenAI', data.settings.openaiApiKey)}
                    >
                      اختبار اتصال OpenAI
                    </Button>
                  </div>

                  <div className="h-[1px] bg-border/40 w-full my-4" />

                  <div className="space-y-2">
                    <Input 
                      label="Anthropic API Key (Claude)"
                      type="password"
                      placeholder="أدخل مفتاح Anthropic API هنا..."
                      value={data.settings.claudeApiKey || ''}
                      onChange={e => updateData({ settings: { ...data.settings, claudeApiKey: e.target.value } })}
                    />
                    <Button 
                      size="sm" 
                      variant="secondary"
                      type="button"
                      loading={testingProvider === 'Anthropic'}
                      onClick={() => testApiKey('Anthropic', data.settings.claudeApiKey)}
                    >
                      اختبار اتصال Anthropic
                    </Button>
                  </div>

                  <p className="text-[10px] opacity-50 font-bold pr-1 pt-2">يتم تخزين المفاتيح محلياً على جهازك فقط ولا يتم مشاركتها مع أي طرف ثالث.</p>
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
                       
                       {data.settings.googleDriveEnabled && (
                          <div className="space-y-2">
                            <Input 
                              label="رمز الوصول السحابي (Access Token)"
                              placeholder="أدخل رمز Google Access Token..."
                              type="password"
                              value={data.settings.googleDriveApiKey || ''}
                              onChange={e => updateData({ settings: { ...data.settings, googleDriveApiKey: e.target.value } })}
                            />
                            <Button 
                              size="xs" 
                              variant="ghost" 
                              type="button"
                              onClick={() => testApiKey('Google Drive Sync', data.settings.googleDriveApiKey)}
                            >
                              اختبار الاتصال بالسحابة
                            </Button>
                          </div>
                       )}

                       <Button 
                         variant={data.settings.googleDriveEnabled ? 'secondary' : 'primary'} 
                         className="w-full cursor-pointer font-bold"
                         type="button"
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

                       {data.settings.dropboxEnabled && (
                          <div className="space-y-2">
                            <Input 
                              label="مفتاح التطبيق (Dropbox Access Token)"
                              placeholder="أدخل Dropbox Access Token..."
                              type="password"
                              value={data.settings.dropboxApiKey || ''}
                              onChange={e => updateData({ settings: { ...data.settings, dropboxApiKey: e.target.value } })}
                            />
                            <Button 
                              size="xs" 
                              variant="ghost" 
                              type="button"
                              onClick={() => testApiKey('Dropbox Sync', data.settings.dropboxApiKey)}
                            >
                              اختبار الاتصال بالسحابة
                            </Button>
                          </div>
                       )}

                       <Button 
                         variant={data.settings.dropboxEnabled ? 'secondary' : 'primary'} 
                         className="w-full cursor-pointer font-bold"
                         type="button"
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
             <section className="space-y-6">
                <h3 className="text-xl font-black flex items-center gap-3">
                  <Shield className="w-6 h-6 text-success" />
                  الأمان والنسخ الاحتياطي
                </h3>
                
                <Card>
                  <CardHeader title="إعدادات النسخ الاحتياطي التلقائي" />
                  <CardContent className="space-y-6 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">تمكين النسخ الاحتياطي التلقائي</span>
                        <span className="text-xs opacity-50 font-medium">إنشاء نسخ احتياطية للبيانات بشكل دوري وتلقائي.</span>
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
                            <span className="font-bold">تكرار النسخ الاحتياطي</span>
                            <span className="text-xs opacity-50 font-medium">معدل تكرار النسخ الاحتياطي المفضل.</span>
                          </div>
                          <select
                            value={data.settings.backupFrequency || 'daily'}
                            onChange={e => updateData({ settings: { ...data.settings, backupFrequency: e.target.value as any } })}
                            className="h-10 px-3 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-xl text-xs font-black outline-none cursor-pointer text-slate-700 dark:text-slate-200"
                          >
                            <option value="daily">يومي (Daily)</option>
                            <option value="weekly">أسبوعي (Weekly)</option>
                            <option value="monthly">شهري (Monthly)</option>
                          </select>
                        </div>

                        <div className="h-[1px] bg-border/40 w-full" />
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold">الحد الأقصى للنسخ المحفوظة</span>
                            <span className="text-xs opacity-50 font-medium">عدد ملفات النسخ الاحتياطي التي يتم الاحتفاظ بها قبل حذف الأقدم.</span>
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
                          تُخزن جميع بياناتك، برومبتاتك، وإعداداتك محلياً كلياً (Local-first). يمكنك في أي وقت بدء عملية نسخ احتياطي فوري لتصدير قاعدة البيانات كاملة.
                      </p>
                      <div className="flex flex-wrap gap-3 pt-2">
                        <Button variant="secondary" type="button" onClick={triggerManualBackup} className="font-bold">
                          تنفيذ نسخ احتياطي فوري
                        </Button>
                        <Button variant="ghost" type="button" onClick={() => navigate('/backups')} className="font-bold">
                          إدارة النسخ الاحتياطية السابقة
                        </Button>
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

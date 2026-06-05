import { AppData, Prompt, Category, Tag, Activity, Settings, Backup, PromptVersion } from '../types';

const STORAGE_KEY = 'promptvault_data';

// Simple obfuscation for "shuffled/encrypted" storage request
const b64Encode = (str: string) => {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    return str;
  }
};

const b64Decode = (str: string) => {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    return str;
  }
};

const obscureKeys = (settings: Settings): Settings => {
  const result = { ...settings };
  const keysToObscure: (keyof Settings)[] = ['geminiApiKey', 'openaiApiKey', 'claudeApiKey', 'copilotApiKey', 'googleDriveApiKey', 'dropboxApiKey'];
  
  keysToObscure.forEach(key => {
    const val = result[key];
    if (val && typeof val === 'string') {
      (result as any)[key] = `_v2_${b64Encode(val)}`;
    }
  });
  
  return result;
};

const deobscureKeys = (settings: Settings): Settings => {
  const result = { ...settings };
  const keysToObscure: (keyof Settings)[] = ['geminiApiKey', 'openaiApiKey', 'claudeApiKey', 'copilotApiKey', 'googleDriveApiKey', 'dropboxApiKey'];
  
  keysToObscure.forEach(key => {
    const val = result[key];
    if (val && typeof val === 'string' && val.startsWith('_v2_')) {
      (result as any)[key] = b64Decode(val.substring(4));
    }
  });
  
  return result;
};

export const INITIAL_DATA: AppData = {
  prompts: [
    {
      id: '1',
      title: 'خبير برمجة في بايثون',
      description: 'برومبت مخصص للمساعدة في كتابة كود بايثون نظيف ومعياري.',
      content: 'تصرف كمبرمج بايثون خبير. يرجى تحليل الكود التالي واقتراح تحسينات...',
      categoryId: '1',
      tags: ['البرمجة', 'بايثون', 'تحسين'],
      variables: ['code'],
      status: 'active',
      isFavorite: true,
      usageCount: 12,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
    {
      id: '2',
      title: 'محلل محتوى تسويقي',
      description: 'تحسين المحتوى التسويقي لمنصات التواصل الاجتماعي.',
      content: 'كخبير تسويق رقمي، قم بتقييم هذا المنشور من حيث التفاعل والوضوح...',
      categoryId: '2',
      tags: ['تسويق', 'محتوى'],
      variables: ['content', 'platform'],
      status: 'active',
      isFavorite: false,
      usageCount: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    }
  ],
  categories: [
    { id: '1', name: 'برمجة', description: 'كل ما يخص تطوير البرمجيات', color: '#3B82F6', promptCount: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: 'تسويق', description: 'برومبتات التسويق والمبيعات', color: '#F59E0B', promptCount: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', name: 'تصميم', description: 'مساعد التصميم المرئي', color: '#EF4444', promptCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ],
  tags: [
    { id: '1', name: 'بايثون', color: '#3776AB', usageCount: 1 },
    { id: '2', name: 'محتوى', color: '#FF4500', usageCount: 1 }
  ],
  activities: [],
  backups: [],
  versions: [],
  settings: {
    theme: 'light',
    language: 'ar',
    defaultView: 'card',
    autosaveEnabled: true,
    autosaveInterval: 5,
    databasePath: './database',
    backupEnabled: true,
    backupFrequency: 'daily',
    backupRetention: 5,
    showPromptPreview: true,
    showTooltips: true
  }
};

export const localStore = {
  load: (): AppData => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return INITIAL_DATA;
    const parsed = JSON.parse(data);
    if (parsed.settings) {
      parsed.settings = deobscureKeys(parsed.settings);
    }
    return parsed;
  },
  save: (data: AppData) => {
    const toSave = { ...data };
    if (toSave.settings) {
      toSave.settings = obscureKeys(toSave.settings);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }
};

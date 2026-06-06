import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../app/app-provider';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Folder, FolderOpen, FileText, Plus, Bold, Italic, List, Code, 
  Link as LinkIcon, Image, Heading, AlignLeft, AlignCenter, AlignRight, 
  AlignJustify, Eye, Edit, ChevronDown, ChevronLeft, ChevronRight, Check, X, Undo, Redo, 
  Palette, Highlighter, Trash2, Star, Sliders, Sparkles, Cpu, Brain, RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/cn';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { EmptyState } from '../ui/EmptyState';

interface FolderType {
  id: string;
  name: string;
  color: string;
  tag: string;
  icon?: string;
}

const AI_FOLDERS: FolderType[] = [
  { id: 'gemini', name: 'Gemini Prompts', color: '#3B82F6', tag: 'gemini' },
  { id: 'chatgpt', name: 'ChatGPT Prompts', color: '#10B981', tag: 'chatgpt' },
  { id: 'claude', name: 'Claude Prompts', color: '#F59E0B', tag: 'claude' },
  { id: 'copilot', name: 'Copilot Prompts', color: '#8B5CF6', tag: 'copilot' },
  { id: 'other', name: 'برومبتات عامة', color: '#6B7280', tag: 'general' }
];

const PEN_COLORS = [
  { name: 'أحمر', hex: '#ef4444', class: 'bg-red-500' },
  { name: 'أخضر', hex: '#22c55e', class: 'bg-emerald-500' },
  { name: 'أزرق', hex: '#3b82f6', class: 'bg-blue-500' },
  { name: 'بنفسجي', hex: '#a855f7', class: 'bg-purple-500' },
  { name: 'برتقالي', hex: '#f97316', class: 'bg-orange-500' }
];

const HIGHLIGHT_COLORS = [
  { name: 'أصفر', hex: '#fef08a', class: 'bg-yellow-200 text-slate-800' },
  { name: 'ليموني', hex: '#bbf7d0', class: 'bg-emerald-200 text-slate-800' },
  { name: 'سماوي', hex: '#cffafe', class: 'bg-cyan-200 text-slate-800' },
  { name: 'وردي', hex: '#fbcfe8', class: 'bg-pink-200 text-slate-800' }
];

export function NotepadView() {
  const { data, updatePrompt, addPrompt, toggleFavorite, addTag, deletePrompt, showToast, confirm, setViewMode: setAppViewMode, t, lang } = useApp();
  const navigate = useNavigate();
  
  // Folders State loaded from local storage
  const [folders, setFolders] = useState<FolderType[]>(() => {
    const saved = localStorage.getItem('notepad_custom_folders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return AI_FOLDERS;
  });

  // Save folders to local storage
  useEffect(() => {
    localStorage.setItem('notepad_custom_folders', JSON.stringify(folders));
  }, [folders]);

  // States
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    gemini: true,
    chatgpt: true
  });
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(
    data.prompts.length > 0 ? data.prompts[0].id : null
  );
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [activeFolderId, setActiveFolderId] = useState<string>('gemini');
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Sidebar Collapsed State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('notepad_sidebar_collapsed') === 'true';
  });

  // Sync collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('notepad_sidebar_collapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Sync contenteditable editor innerHTML when active prompt changes
  useEffect(() => {
    if (editorRef.current && selectedPrompt) {
      if (editorRef.current.innerHTML !== selectedPrompt.content) {
        editorRef.current.innerHTML = selectedPrompt.content;
      }
    }
  }, [selectedPromptId, viewMode]);

  const handleEditorInput = () => {
    if (editorRef.current && selectedPrompt) {
      const html = editorRef.current.innerHTML;
      handleContentChange(html);
    }
  };

  const execFormat = (command: string, value: string = '') => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleEditorInput();
  };

  const insertLink = () => {
    const url = prompt(t('editor.promptInsertLink'));
    if (url) {
      execFormat('createLink', url);
    }
  };

  // Font/Size states
  const [fontFamily, setFontFamily] = useState<string>('font-sans');
  const [fontSize, setFontSize] = useState<string>('text-sm');
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
  const [isPenDropdownOpen, setIsPenDropdownOpen] = useState(false);
  const [isHighlighterDropdownOpen, setIsHighlighterDropdownOpen] = useState(false);
  const [alignment, setAlignment] = useState<'right' | 'center' | 'left' | 'justify'>('right');

  const handleAlignmentChange = (alignType: 'right' | 'center' | 'left' | 'justify') => {
    setAlignment(alignType);
    if (alignType === 'right') execFormat('justifyRight');
    else if (alignType === 'center') execFormat('justifyCenter');
    else if (alignType === 'left') execFormat('justifyLeft');
    else if (alignType === 'justify') execFormat('justifyFull');
  };

  // AI Enhancer States & Helpers
  const isGeminiActive = !!data.settings.geminiApiKey?.trim();
  const isOpenAIActive = !!data.settings.openaiApiKey?.trim();
  const isClaudeActive = !!data.settings.claudeApiKey?.trim();
  const hasAnyAi = isGeminiActive || isOpenAIActive || isClaudeActive;

  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [aiEnhancingProvider, setAiEnhancingProvider] = useState<string | null>(null);

  const getTextFromHtml = (html: string) => {
    if (typeof document === 'undefined') return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const simulateTyping = (text: string) => {
    let index = 0;
    const step = Math.max(1, Math.ceil(text.length / 100));
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const interval = setInterval(() => {
      if (index < text.length) {
        const nextContent = text.slice(0, index + step);
        if (editorRef.current) {
          editorRef.current.innerHTML = nextContent;
        }
        if (selectedPromptId) {
          updatePrompt(selectedPromptId, { content: nextContent });
        }
        index += step;
      } else {
        clearInterval(interval);
        if (editorRef.current) {
          editorRef.current.innerHTML = text;
        }
        if (selectedPromptId) {
          updatePrompt(selectedPromptId, { content: text });
        }
        showToast(t('editor.successEnhance'), 'success');
      }
    }, 20);
  };

  const handleAiEnhance = async (provider: 'gemini' | 'openai' | 'claude') => {
    if (!selectedPrompt) return;
    const textToImprove = getTextFromHtml(selectedPrompt.content);
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

  // Prompt Rename States
  const [renamingPromptId, setRenamingPromptId] = useState<string | null>(null);
  const [promptRenameTitle, setPromptRenameTitle] = useState('');

  // Folder Customization States
  const [editingFolder, setEditingFolder] = useState<FolderType | null>(null);
  const [folderEditName, setFolderEditName] = useState('');
  const [folderEditColor, setFolderEditColor] = useState('');
  const [folderEditIcon, setFolderEditIcon] = useState(''); // Base64 data URL

  // Open Tabs State
  const [openTabs, setOpenTabs] = useState<string[]>(() => {
    const saved = localStorage.getItem('notepad_open_tabs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return data.prompts.length > 0 ? [data.prompts[0].id] : [];
  });

  // Persist open tabs
  useEffect(() => {
    localStorage.setItem('notepad_open_tabs', JSON.stringify(openTabs));
  }, [openTabs]);

  // Sync selected prompt with open tabs, and handle deletions
  useEffect(() => {
    const validOpenTabs = openTabs.filter(tId => data.prompts.some(p => p.id === tId));
    
    if (validOpenTabs.length !== openTabs.length) {
      setOpenTabs(validOpenTabs);
    }
    
    if (selectedPromptId && !validOpenTabs.includes(selectedPromptId)) {
      setOpenTabs(prev => [...prev, selectedPromptId]);
    }
    
    if (selectedPromptId && !data.prompts.some(p => p.id === selectedPromptId)) {
      if (validOpenTabs.length > 0) {
        setSelectedPromptId(validOpenTabs[0]);
      } else if (data.prompts.length > 0) {
        setSelectedPromptId(data.prompts[0].id);
      } else {
        setSelectedPromptId(null);
      }
    }
  }, [selectedPromptId, data.prompts]);

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextTabs = openTabs.filter(tId => tId !== id);
    setOpenTabs(nextTabs);
    if (selectedPromptId === id) {
      if (nextTabs.length > 0) {
        setSelectedPromptId(nextTabs[nextTabs.length - 1]);
      } else {
        setSelectedPromptId(null);
      }
    }
  };

  const startEditFolder = (folder: FolderType, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFolder(folder);
    setFolderEditName(folder.name);
    setFolderEditColor(folder.color);
    setFolderEditIcon(folder.icon || '');
  };

  const saveFolderEdits = () => {
    if (!editingFolder) return;
    setFolders(prev => prev.map(f => f.id === editingFolder.id ? {
      ...f,
      name: folderEditName,
      color: folderEditColor,
      icon: folderEditIcon
    } : f));
    setEditingFolder(null);
    showToast('تم تحديث إعدادات المجلد بنجاح', 'success');
  };

  const handleFolderIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('يرجى اختيار ملف صورة فقط', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFolderEditIcon(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const savePromptRename = (id: string) => {
    const title = promptRenameTitle.trim();
    if (title) {
      updatePrompt(id, { title });
      showToast('تمت إعادة تسمية البرومبت بنجاح', 'success');
    }
    setRenamingPromptId(null);
  };

  const handleDeletePrompt = (id: string) => {
    confirm({
      title: 'حذف البرومبت',
      message: 'هل أنت متأكد من رغبتك في حذف هذا البرومبت؟',
      type: 'danger',
      confirmText: 'حذف',
      cancelText: 'إلغاء',
      onConfirm: () => {
        deletePrompt(id);
        showToast('تم حذف البرومبت بنجاح', 'info');
      }
    });
  };

  const handleAddFolder = () => {
    const newId = 'folder_' + Math.random().toString(36).substr(2, 9);
    const newFolder: FolderType = {
      id: newId,
      name: 'مجلد جديد',
      color: '#6B7280',
      tag: 'new_folder_' + Math.random().toString(36).substr(2, 5)
    };
    setFolders(prev => [...prev, newFolder]);
    setEditingFolder(newFolder);
    setFolderEditName(newFolder.name);
    setFolderEditColor(newFolder.color);
    setFolderEditIcon('');
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
          showToast('تم رفع الصورة وإدراجها بنجاح', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleImageToolbarClick = () => {
    const input = document.getElementById('notepad-image-uploader');
    input?.click();
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
              showToast(lang === 'ar' ? 'تم لصق الصورة وإدراجها بنجاح' : 'Image pasted and inserted successfully', 'success');
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const getFolderForPrompt = (prompt: any): string => {
    const text = (prompt.title + ' ' + prompt.content + ' ' + prompt.tags.join(' ')).toLowerCase();
    for (const folder of folders) {
      if (folder.tag && folder.tag !== 'general') {
        if (text.includes(folder.tag.toLowerCase()) || text.includes(folder.name.toLowerCase())) {
          return folder.id;
        }
      }
    }
    return 'other';
  };

  const selectedPrompt = data.prompts.find(p => p.id === selectedPromptId);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
    setActiveFolderId(folderId);
  };

  const handleCreatePromptInFolder = (folderId: string) => {
    const targetFolder = folders.find(f => f.id === folderId);
    const newPromptTag = targetFolder ? targetFolder.tag : 'general';
    
    const newPromptData = {
      title: lang === 'ar' ? 'برومبت جديد غير معنون' : 'New Untitled Prompt',
      description: lang === 'ar' ? 'تم إنشاؤه عبر المفكرة' : 'Created via Notepad',
      content: lang === 'ar' ? 'اكتب نص البرومبت هنا...' : 'Write the prompt text here...',
      categoryId: data.categories[0]?.id || '',
      tags: [newPromptTag],
      variables: [],
      status: 'active' as const,
      isFavorite: false,
      usageCount: 0,
      author: lang === 'ar' ? 'أحمد النعيمي' : 'Ahmed Al-Nuaimi',
      source: lang === 'ar' ? 'المفكرة الشخصية' : 'Personal Notepad'
    };

    addPrompt(newPromptData);
    
    setTimeout(() => {
      const latest = data.prompts[0];
      if (latest) {
        setSelectedPromptId(latest.id);
      }
    }, 100);
  };

  const handleTitleChange = (newTitle: string) => {
    if (selectedPromptId) {
      updatePrompt(selectedPromptId, { title: newTitle });
    }
  };

  const handleContentChange = (newContent: string) => {
    if (selectedPromptId) {
      updatePrompt(selectedPromptId, { content: newContent });
    }
  };

  // Rich Formatting Helpers
  const insertHeader = (headerTag: string) => {
    const level = headerTag.length;
    execFormat('formatBlock', `<h${level}>`);
    setIsHeaderDropdownOpen(false);
  };

  const handleUndo = () => {
    execFormat('undo');
  };

  const handleRedo = () => {
    execFormat('redo');
  };

  const insertColorText = (colorHex: string) => {
    execFormat('foreColor', colorHex || '#111827');
    setIsPenDropdownOpen(false);
  };

  const insertHighlightText = (colorHex: string) => {
    execFormat('hiliteColor', colorHex || 'transparent');
    setIsHighlighterDropdownOpen(false);
  };

  // Group prompts by folder dynamically
  const groupedPrompts: Record<string, any[]> = {};
  folders.forEach(f => {
    groupedPrompts[f.id] = [];
  });
  if (!groupedPrompts['other']) {
    groupedPrompts['other'] = [];
  }

  data.prompts.forEach(p => {
    const fId = getFolderForPrompt(p);
    if (groupedPrompts[fId]) {
      groupedPrompts[fId].push(p);
    } else {
      groupedPrompts['other'].push(p);
    }
  });

  return (
    <div className="flex h-full w-full overflow-hidden bg-background-light dark:bg-background-dark select-none">
      
      {/* Left Column: Folders Sidebar */}
      <div className={cn(
        "h-full flex flex-col border-e border-border/40 bg-surface-light dark:bg-surface-dark transition-all duration-300 shrink-0",
        isSidebarCollapsed ? "w-0 border-e-0 overflow-hidden" : "w-[280px]"
      )}>
        <div className="p-4 border-b border-border/40 flex items-center justify-between gap-2 shrink-0">
          <span className="text-[10px] font-black opacity-60 truncate">{lang === 'ar' ? 'مجلدات المفكرة' : 'Notepad Folders'}</span>
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="secondary" 
              className="h-8 px-2 flex items-center gap-1 text-[9px] font-bold cursor-pointer"
              onClick={handleAddFolder}
            >
              <Plus className="w-3 h-3" />
              {lang === 'ar' ? 'مجلد' : 'Folder'}
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              className="h-8 px-2 flex items-center gap-1 text-[9px] font-bold cursor-pointer"
              onClick={() => handleCreatePromptInFolder(activeFolderId)}
            >
              <Plus className="w-3 h-3" />
              {lang === 'ar' ? 'برومبت' : 'Prompt'}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {folders.map((folder) => {
            const isExpanded = expandedFolders[folder.id];
            const promptsInFolder = groupedPrompts[folder.id] || [];
            
            return (
              <div key={folder.id} className="space-y-1">
                {/* Folder Header */}
                <button
                  onClick={() => toggleFolder(folder.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-surface2-light dark:hover:bg-surface2-dark transition-all text-xs font-bold cursor-pointer group/folder",
                    activeFolderId === folder.id ? "bg-surface2-light/60 dark:bg-surface2-dark/60 border border-border/30" : "border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {folder.icon ? (
                      <img src={folder.icon} alt="" className="w-4 h-4 object-contain shrink-0" />
                    ) : isExpanded ? (
                      <FolderOpen className="w-4 h-4 shrink-0" style={{ color: folder.color }} />
                    ) : (
                      <Folder className="w-4 h-4 shrink-0" style={{ color: folder.color }} />
                    )}
                    <span className="text-slate-700 dark:text-slate-200 truncate pe-1">
                      {folder.id === 'other' ? (lang === 'ar' ? 'برومبتات عامة' : 'General Prompts') : folder.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[9px] font-black opacity-45 px-1.5 py-0.5 rounded bg-border/20">{promptsInFolder.length}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 opacity-40 transition-transform", isExpanded ? "" : "-rotate-95")} />
                    
                    {/* Settings Sliders Icon (on hover, except other folder) */}
                    {folder.id !== 'other' && (
                      <span
                        onClick={(e) => startEditFolder(folder, e)}
                        className="opacity-0 group-hover/folder:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-opacity cursor-pointer text-slate-500 dark:text-slate-400"
                        title={lang === 'ar' ? 'تخصيص المجلد' : 'Customize Folder'}
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </button>

                {/* Folder Prompts List */}
                {isExpanded && (
                  <div className="ms-4 ps-2 border-s border-border/30 space-y-0.5 animate-none">
                    {promptsInFolder.map(p => {
                      const isSelected = p.id === selectedPromptId;
                      const isRenaming = renamingPromptId === p.id;
                      
                      return (
                        <div
                          key={p.id}
                          className={cn(
                            "w-full group/item flex items-center justify-between py-1.5 px-2 rounded-lg text-[11px] font-bold text-start transition-all cursor-pointer relative",
                            isSelected 
                              ? "bg-accent/10 text-accent font-black" 
                              : "text-muted-light dark:text-muted-dark hover:bg-surface2-light dark:hover:bg-surface2-dark"
                          )}
                          onClick={() => !isRenaming && setSelectedPromptId(p.id)}
                          onDoubleClick={() => {
                            setRenamingPromptId(p.id);
                            setPromptRenameTitle(p.title);
                          }}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0 pe-1">
                            <FileText className="w-3.5 h-3.5 opacity-55 shrink-0" />
                            {isRenaming ? (
                              <input
                                type="text"
                                value={promptRenameTitle}
                                onChange={e => setPromptRenameTitle(e.target.value)}
                                onBlur={() => savePromptRename(p.id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') savePromptRename(p.id);
                                  if (e.key === 'Escape') setRenamingPromptId(null);
                                }}
                                autoFocus
                                className="flex-1 bg-white dark:bg-surface-dark border border-accent/40 rounded px-1.5 py-0.5 text-[11px] outline-none font-bold text-slate-800 dark:text-slate-100"
                                onClick={e => e.stopPropagation()}
                              />
                            ) : (
                              <span className="truncate flex-1">{p.title}</span>
                            )}
                          </div>

                          {/* Delete Prompt trash can icon */}
                          {!isRenaming && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePrompt(p.id);
                              }}
                              className="opacity-0 group-hover/item:opacity-100 p-1 rounded hover:bg-danger/10 text-danger transition-opacity shrink-0 cursor-pointer ms-1 animate-none"
                              title={t('notepad.deleteTooltip')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {promptsInFolder.length === 0 && (
                      <div className="py-2.5 px-3 border border-dashed border-border/30 rounded-lg text-center opacity-50 text-[9px] italic font-medium my-1">
                        {lang === 'ar' ? 'مجلد فارغ...' : 'Empty folder...'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer: Quick Settings Access */}
        <div className="p-4 border-t border-border/30 bg-surface-light dark:bg-surface-dark shrink-0 select-none">
          <button
            onClick={() => {
              setAppViewMode('detailed');
              navigate('/settings');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-surface2-dark hover:bg-slate-100 dark:hover:bg-surface2-dark/80 border border-border/30 rounded-xl text-xs font-bold hover:text-accent hover:border-accent/30 shadow-3xs hover:shadow-xs transition-all duration-300 cursor-pointer text-slate-600 dark:text-slate-300"
          >
            <Sliders className="w-3.5 h-3.5 text-accent" />
            <span>{lang === 'ar' ? 'الإعدادات السريعة' : 'Quick Settings'}</span>
          </button>
        </div>
      </div>

      {/* Right Column: Notepad Editor Area */}
      <div className="flex-1 h-full flex flex-col bg-slate-50/30 dark:bg-surface2-dark/10 relative">
        {/* Sidebar Collapse/Expand Toggle Button */}
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-6.5 h-6.5 bg-white dark:bg-surface-dark border border-border/30 hover:border-accent/40 rounded-full flex items-center justify-center shadow-md z-40 cursor-pointer text-slate-500 hover:text-accent transition-all duration-300 hover:scale-110",
            lang === 'ar' ? "right-[-12px]" : "left-[-12px]"
          )}
          title={isSidebarCollapsed ? (lang === 'ar' ? 'عرض المجلدات' : 'Show Folders') : (lang === 'ar' ? 'إخفاء المجلدات' : 'Hide Folders')}
        >
          {isSidebarCollapsed ? (
            <ChevronLeft className={cn("w-3.5 h-3.5", lang === 'en' && "rotate-180")} />
          ) : (
            <ChevronRight className={cn("w-3.5 h-3.5", lang === 'en' && "rotate-180")} />
          )}
        </button>
        
        {selectedPrompt ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            
             {/* Top Tab Bar */}
             <div className="h-[44px] bg-slate-100 dark:bg-surface2-dark/20 px-6 border-b border-border/20 flex items-end gap-1.5 overflow-x-auto shrink-0 select-none scrollbar-none">
               {openTabs.map(tId => {
                 const prompt = data.prompts.find(p => p.id === tId);
                 if (!prompt) return null;
                 
                 const folderId = getFolderForPrompt(prompt);
                 const folder = folders.find(f => f.id === folderId) || folders.find(f => f.id === 'other') || folders[4];
                 const isActive = tId === selectedPromptId;
                 
                 return (
                   <div key={tId} className="relative group/tab flex items-center mb-[-1px]">
                     <button
                       onClick={() => setSelectedPromptId(tId)}
                       style={{
                         backgroundColor: isActive ? folder.color : folder.color + '15',
                         color: isActive ? '#ffffff' : folder.color,
                         borderColor: isActive ? 'transparent' : folder.color + '30'
                       }}
                       className={cn(
                         "h-8 ps-4 pe-8 rounded-t-lg text-[10px] font-black flex items-center gap-2 transition-all cursor-pointer relative z-10 border border-b-0",
                         isActive 
                           ? "shadow-sm" 
                           : "hover:bg-surface-light/80 dark:hover:bg-surface-dark/80"
                       )}
                     >
                       <span className="truncate max-w-[100px]">{prompt.title}</span>
                     </button>
                    
                    {/* Close Tab Button */}
                    <button
                      onClick={(e) => closeTab(tId, e)}
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 z-20 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer",
                        lang === 'ar' ? "left-2" : "right-2",
                        isActive ? "text-white/80 hover:text-white" : "text-muted-light/60 hover:text-muted-light"
                      )}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    
                    {/* Speech bubble arrow pointing down */}
                    {isActive && (
                      <div 
                        className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 z-0"
                        style={{ backgroundColor: folder.color }}
                      />
                    )}
                  </div>
                 );
               })}
             </div>

             {/* Rich Editor Toolbar */}
             <div className="min-h-[64px] py-2 border-b border-border/40 bg-white dark:bg-surface-dark px-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 select-none shrink-0 shadow-sm z-10">
               
               {/* Left format/style helpers */}
               <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                 
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
                   <button onClick={() => execFormat('bold')} title={t('editor.tooltipBold')} className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300 transition-colors"><Bold className="w-3.5 h-3.5 opacity-80" /></button>
                   <button onClick={() => execFormat('italic')} title={t('editor.tooltipItalic')} className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300 transition-colors"><Italic className="w-3.5 h-3.5 opacity-80" /></button>
                   
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
                         {PEN_COLORS.map((color, idx) => (
                           <button 
                             key={idx}
                             type="button"
                             onClick={() => insertColorText(color.hex)}
                             className="px-2 py-1 rounded-lg text-[9px] font-bold hover:bg-surface2-light dark:hover:bg-surface2-dark text-start flex items-center gap-2 w-full cursor-pointer text-slate-700 dark:text-slate-200"
                           >
                             <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", color.class)} />
                             <span>{t(`editor.color${color.name}`)}</span>
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
                         {HIGHLIGHT_COLORS.map((color, idx) => (
                           <button 
                             key={idx}
                             type="button"
                             onClick={() => insertHighlightText(color.hex)}
                             className="px-2 py-1 rounded-lg text-[9px] font-bold hover:bg-surface2-light dark:hover:bg-surface2-dark text-start flex items-center gap-2 w-full cursor-pointer text-slate-700 dark:text-slate-200"
                           >
                             <span className={cn("w-2.5 h-2.5 rounded shrink-0", color.class)} />
                             <span>{t(`editor.highlight${color.name}`)}</span>
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

                 {/* Group 5: Lists & Code */}
                 <div className="flex items-center gap-0.5">
                   <button onClick={() => execFormat('insertUnorderedList')} title={t('editor.tooltipList')} className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300 transition-colors"><List className="w-3.5 h-3.5 opacity-80" /></button>
                   <button onClick={() => execFormat('formatBlock', '<pre>')} title={t('editor.tooltipCode')} className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300 transition-colors"><Code className="w-3.5 h-3.5 opacity-80" /></button>
                 </div>

                 <div className="w-[1px] h-4 bg-border/40 mx-1 my-auto shrink-0" />

                 {/* Group 6: Media & Links */}
                 <div className="flex items-center gap-0.5">
                   <button onClick={insertLink} title={t('editor.tooltipLink')} className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300 transition-colors"><LinkIcon className="w-3.5 h-3.5 opacity-80" /></button>
                   <button onClick={handleImageToolbarClick} title={t('editor.tooltipImage')} className="p-1.5 hover:bg-border/20 rounded-lg cursor-pointer text-slate-600 dark:text-slate-300 transition-colors"><Image className="w-3.5 h-3.5 opacity-80" /></button>
                 </div>

                 {/* Group 7: AI Enhance */}
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

               {/* Right View Switcher & AI Enhancer Toolbar */}
               <div className="flex flex-col items-end gap-1.5 shrink-0">
                 <div className="flex p-0.5 bg-surface2-light dark:bg-surface2-dark rounded-xl border border-border/40 select-none">
                   <button
                     onClick={() => setViewMode('edit')}
                     className={cn(
                       "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1.5 cursor-pointer", 
                       viewMode === 'edit' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-45 hover:opacity-100"
                     )}
                   >
                     <Edit className="w-3.5 h-3.5" />
                     {t('notepad.editMode')}
                   </button>
                   <button
                     onClick={() => setViewMode('preview')}
                     className={cn(
                       "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1.5 cursor-pointer", 
                       viewMode === 'preview' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-45 hover:opacity-100"
                     )}
                   >
                     <Eye className="w-3.5 h-3.5" />
                     {t('notepad.previewMode')}
                   </button>
                 </div>
               </div>

             </div>

             {/* Collapsible AI Enhancer Panel */}
             {isAiPanelOpen && viewMode === 'edit' && (
               <div className="p-4 bg-slate-50 dark:bg-surface2-dark/30 border-b border-border/30 space-y-3 transition-all duration-300 px-6">
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

             {/* Note Title & Content Editor */}
             <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full flex flex-col gap-6">
               
               <input id="notepad-image-uploader" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />

               {/* Title Input */}
               <input 
                 type="text"
                 value={selectedPrompt.title}
                 onChange={e => handleTitleChange(e.target.value)}
                 className="w-full bg-transparent border-none outline-none text-2xl font-black text-slate-800 dark:text-slate-100 placeholder-slate-400 py-2 border-b border-border/10 focus:border-accent/30 transition-all text-start"
                 placeholder={t('notepad.titlePlaceholder')}
               />

               {/* Text Editor content */}
               {viewMode === 'edit' ? (
                 <div className={cn(
                   "flex-1 flex flex-col min-h-[150px] relative transition-all duration-500 rounded-xl p-2",
                   aiEnhancing && "animate-pulse",
                   aiEnhancing && aiEnhancingProvider === 'gemini' && "border border-indigo-500/30 bg-indigo-500/[0.01] shadow-[0_0_20px_rgba(99,102,241,0.05)]",
                   aiEnhancing && aiEnhancingProvider === 'openai' && "border border-emerald-500/30 bg-emerald-500/[0.01] shadow-[0_0_20px_rgba(16,185,129,0.05)]",
                   aiEnhancing && aiEnhancingProvider === 'claude' && "border border-orange-500/30 bg-orange-500/[0.01] shadow-[0_0_20px_rgba(249,115,22,0.05)]"
                 )}>

                   <div
                     ref={editorRef}
                     contentEditable
                     onInput={handleEditorInput}
                     onPaste={handlePaste}
                     className={cn(
                       "w-full flex-1 bg-transparent border-none outline-none resize-none leading-loose placeholder-slate-400/50 min-h-[150px] text-start focus:outline-none overflow-y-auto",
                       fontFamily,
                       fontSize
                     )}
                     style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                     {...{ placeholder: t('notepad.contentPlaceholder') }}
                   />
                   <div className="pt-4 border-t border-border/20 text-[10px] font-bold opacity-45 flex items-center justify-between flex-wrap gap-2 select-none">
                     <div className="flex items-center gap-3 flex-wrap">
                       <span>{lang === 'ar' ? `عدد الأحرف: ${selectedPrompt ? selectedPrompt.content.length : 0}` : `Characters: ${selectedPrompt ? selectedPrompt.content.length : 0}`}</span>
                     </div>
                     <span className="flex items-center gap-1 text-success"><Check className="w-3 h-3" /> {t('notepad.promptAutoSaved')}</span>
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
                 <div className={cn(
                   "flex-1 prose prose-sm dark:prose-invert max-w-none leading-loose",
                   fontFamily,
                   fontSize,
                   alignment === 'center' ? 'text-center' : alignment === 'left' ? 'text-left' : alignment === 'justify' ? 'text-justify' : 'text-start'
                 )}>
                   <Markdown rehypePlugins={[rehypeRaw]}>{selectedPrompt.content || (lang === 'ar' ? '_لا توجد نصوص للمعاينة..._' : '_No text to preview..._')}</Markdown>
                 </div>
               )}

             </div>

          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title={lang === 'ar' ? 'المفكرة فارغة' : 'Notepad is empty'}
            description={lang === 'ar' 
              ? 'اختر برومبت من القائمة الجانبية لعرضه وتحريره، أو اضغط على زر الإضافة لإنشاء برومبت جديد في مجلدك.' 
              : 'Select a prompt from the sidebar to view and edit it, or click the add button to create a new prompt in your folder.'}
            actionLabel={t('notepad.newPromptBtn')}
            onAction={() => handleCreatePromptInFolder('gemini')}
          />
        )}
      </div>
 
      {/* Folder Customization Modal */}
      {editingFolder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 select-none">
          <Card className={cn("w-full max-w-md shadow-2xl border border-border/80 bg-surface-light dark:bg-surface-dark overflow-hidden pointer-events-auto", lang === 'ar' ? "text-right" : "text-start")}>
            <CardHeader title={lang === 'ar' ? 'تخصيص المجلد' : 'Customize Folder'} />
            <CardContent className="space-y-4 pt-4">
              {/* Folder Name */}
              <div className="space-y-1 text-start">
                <label className="text-xs font-bold opacity-60">{lang === 'ar' ? 'اسم المجلد' : 'Folder Name'}</label>
                <input
                  type="text"
                  value={folderEditName}
                  onChange={e => setFolderEditName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border/40 bg-surface2-light dark:bg-surface2-dark text-sm outline-none focus:border-accent text-slate-800 dark:text-slate-100 text-start"
                  placeholder={lang === 'ar' ? 'مثال: برومبتات البرمجة...' : 'e.g. Coding Prompts...'}
                />
              </div>

              {/* Folder Color */}
              <div className="space-y-2 text-start">
                <label className="text-xs font-bold opacity-60">{lang === 'ar' ? 'اللون المختار' : 'Selected Color'}</label>
                <div className="flex flex-wrap gap-2">
                  {['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899', '#6B7280'].map(c => (
                    <button
                      key={c}
                      onClick={() => setFolderEditColor(c)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all cursor-pointer",
                        folderEditColor === c ? "border-accent scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  {/* Custom color input */}
                  <input
                    type="color"
                    value={folderEditColor}
                    onChange={e => setFolderEditColor(e.target.value)}
                    className="w-8 h-8 rounded-full border-2 border-transparent cursor-pointer overflow-hidden p-0 bg-transparent"
                  />
                </div>
              </div>

              {/* Folder Icon Upload */}
              <div className="space-y-2 text-start">
                <label className="text-xs font-bold opacity-60 block">{lang === 'ar' ? 'أيقونة المجلد' : 'Folder Icon'}</label>
                <div className="flex items-center gap-3 bg-surface2-light dark:bg-surface2-dark p-3 rounded-xl border border-border/30">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-border/50 bg-white dark:bg-surface-dark shrink-0">
                    {folderEditIcon ? (
                      <img src={folderEditIcon} alt="Icon Preview" className="w-8 h-8 object-contain" />
                    ) : (
                      <Folder className="w-8 h-8 text-slate-400" style={{ color: folderEditColor }} />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1 text-start">
                    <input
                      type="file"
                      accept="image/*"
                      id="folder-icon-uploader"
                      className="hidden"
                      onChange={handleFolderIconUpload}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 text-[10px] font-bold cursor-pointer"
                        onClick={() => document.getElementById('folder-icon-uploader')?.click()}
                      >
                        {lang === 'ar' ? 'رفع صورة' : 'Upload Image'}
                      </Button>
                      {folderEditIcon && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-[10px] font-bold text-danger hover:bg-danger/10 cursor-pointer"
                          onClick={() => setFolderEditIcon('')}
                        >
                          {lang === 'ar' ? 'مسح الأيقونة' : 'Clear Icon'}
                        </Button>
                      )}
                    </div>
                    <span className="text-[9px] opacity-45 font-bold">{lang === 'ar' ? 'يمكنك اختيار أي صورة لتكون أيقونة المجلد.' : 'You can choose any image to be the folder icon.'}</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-4">
                <Button variant="ghost" className="flex-1 text-xs font-bold" onClick={() => setEditingFolder(null)}>{t('common.cancel')}</Button>
                <Button className="flex-1 bg-accent text-white text-xs font-bold shadow-lg shadow-accent/15" onClick={saveFolderEdits}>{t('categories.saveBtn')}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

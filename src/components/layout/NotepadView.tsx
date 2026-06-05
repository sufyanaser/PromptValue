import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../app/app-provider';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Folder, FolderOpen, FileText, Plus, Bold, Italic, List, Code, 
  Link as LinkIcon, Image, Heading, AlignLeft, AlignCenter, AlignRight, 
  AlignJustify, Eye, Edit, ChevronDown, ChevronLeft, Check, X, Undo, Redo, 
  Palette, Highlighter, Trash2, Star, Sliders, Sparkles, Cpu, Brain, RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/cn';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

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
  const { data, updatePrompt, addPrompt, toggleFavorite, addTag, deletePrompt, showToast, confirm } = useApp();
  
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
  const editorRef = useRef<HTMLDivElement>(null);

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
    const url = prompt('أدخل الرابط:');
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
        showToast('تم تحسين البرومبت بنجاح!', 'success');
      }
    }, 20);
  };

  const handleAiEnhance = async (provider: 'gemini' | 'openai' | 'claude') => {
    if (!selectedPrompt) return;
    const textToImprove = getTextFromHtml(selectedPrompt.content);
    if (!textToImprove.trim()) {
      showToast('يرجى كتابة نص البرومبت أولاً ليتمكن المساعد من تحسينه.', 'warning');
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
      showToast(`فشل التحسين: ${error.message || 'حدث خطأ غير معروف'}`, 'danger');
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
              showToast('تم لصق الصورة وإدراجها بنجاح', 'success');
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
      title: 'برومبت جديد غير معنون',
      description: 'تم إنشاؤه عبر المفكرة',
      content: 'اكتب نص البرومبت هنا...',
      categoryId: data.categories[0]?.id || '',
      tags: [newPromptTag],
      variables: [],
      status: 'active' as const,
      isFavorite: false,
      usageCount: 0,
      author: 'أحمد النعيمي',
      source: 'المفكرة الشخصية'
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
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-background-light dark:bg-background-dark select-none">
      
      {/* Left Column: Folders Sidebar */}
      <div className="w-[280px] h-full flex flex-col border-l border-border/40 bg-surface-light dark:bg-surface-dark transition-colors duration-200">
        <div className="p-4 border-b border-border/40 flex items-center justify-between gap-2 shrink-0">
          <span className="text-[10px] font-black opacity-60 truncate">مجلدات المفكرة</span>
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="secondary" 
              className="h-8 px-2 flex items-center gap-1 text-[9px] font-bold cursor-pointer"
              onClick={handleAddFolder}
            >
              <Plus className="w-3 h-3" />
              مجلد
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              className="h-8 px-2 flex items-center gap-1 text-[9px] font-bold cursor-pointer"
              onClick={() => handleCreatePromptInFolder(activeFolderId)}
            >
              <Plus className="w-3 h-3" />
              برومبت
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
                    <span className="text-slate-700 dark:text-slate-200 truncate pr-1">{folder.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[9px] font-black opacity-45 px-1.5 py-0.5 rounded bg-border/20">{promptsInFolder.length}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 opacity-40 transition-transform", isExpanded ? "" : "-rotate-95")} />
                    
                    {/* Settings Sliders Icon (on hover, except other folder) */}
                    {folder.id !== 'other' && (
                      <span
                        onClick={(e) => startEditFolder(folder, e)}
                        className="opacity-0 group-hover/folder:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-opacity cursor-pointer text-slate-500 dark:text-slate-400"
                        title="تخصيص المجلد"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </button>

                {/* Folder Prompts List */}
                {isExpanded && (
                  <div className="mr-4 pr-2 border-r border-border/30 space-y-0.5">
                    {promptsInFolder.map(p => {
                      const isSelected = p.id === selectedPromptId;
                      const isRenaming = renamingPromptId === p.id;
                      
                      return (
                        <div
                          key={p.id}
                          className={cn(
                            "w-full group/item flex items-center justify-between py-1.5 px-2 rounded-lg text-[11px] font-bold text-right transition-all cursor-pointer relative",
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
                          <div className="flex items-center gap-2 flex-1 min-w-0 pr-1">
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
                              className="opacity-0 group-hover/item:opacity-100 p-1 rounded hover:bg-danger/10 text-danger transition-opacity shrink-0 cursor-pointer ml-1"
                              title="حذف البرومبت"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {promptsInFolder.length === 0 && (
                      <p className="text-[10px] opacity-40 italic py-1.5 pr-2">مجلد فارغ...</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Notepad Editor Area */}
      <div className="flex-1 h-full flex flex-col bg-slate-50/30 dark:bg-surface2-dark/10">
        {selectedPrompt ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            
             {/* Top Tab Bar matching mockup */}
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
                         "h-8 pl-8 pr-4 rounded-t-lg text-[10px] font-black flex items-center gap-2 transition-all cursor-pointer relative z-10 border border-b-0",
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
                        "absolute left-2 top-1/2 -translate-y-1/2 z-20 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer",
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

            {/* Rich Editor Toolbar matching mockup */}
            <div className="h-[60px] border-b border-border/40 bg-white dark:bg-surface-dark px-6 flex items-center justify-between gap-4 select-none shrink-0 shadow-sm z-10">
              
              {/* Left format/style helpers */}
              <div className="flex items-center gap-2">
                
                {/* Mock Image Icon */}
                <button 
                  onClick={handleImageToolbarClick} 
                  title="رفع صورة وإدراجها" 
                  className="p-2 hover:bg-border/20 rounded-lg cursor-pointer"
                >
                  <Image className="w-4 h-4 opacity-70" />
                </button>

                <div className="w-[1px] h-5 bg-border mx-1" />

                {/* Undo / Redo */}
                <button 
                  onClick={handleUndo} 
                  title="تراجع" 
                  className="p-2 hover:bg-border/20 rounded-lg cursor-pointer"
                >
                  <Undo className="w-4 h-4 opacity-70" />
                </button>
                <button 
                  onClick={handleRedo} 
                  title="إعادة" 
                  className="p-2 hover:bg-border/20 rounded-lg cursor-pointer"
                >
                  <Redo className="w-4 h-4 opacity-70" />
                </button>

                <div className="w-[1px] h-5 bg-border mx-1" />

                {/* Font Family selector */}
                <select 
                  value={fontFamily}
                  onChange={e => setFontFamily(e.target.value)}
                  className="h-8 px-2 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-lg text-[10px] font-black outline-none cursor-pointer"
                >
                  <option value="font-sans">IBM Plex Sans (عادي)</option>
                  <option value="font-mono">Monospace (كود)</option>
                  <option value="font-serif">Serif (كلاسيك)</option>
                </select>

                {/* Font Size selector */}
                <select 
                  value={fontSize}
                  onChange={e => setFontSize(e.target.value)}
                  className="h-8 px-2 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-lg text-[10px] font-black outline-none cursor-pointer"
                >
                  <option value="text-xs">12px</option>
                  <option value="text-sm">14px</option>
                  <option value="text-base">16px</option>
                  <option value="text-lg">18px</option>
                  <option value="text-xl">20px</option>
                </select>

                <div className="w-[1px] h-5 bg-border mx-1" />

                {/* Text Color Picker (Pen) */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsPenDropdownOpen(!isPenDropdownOpen);
                      setIsHighlighterDropdownOpen(false);
                      setIsHeaderDropdownOpen(false);
                    }}
                    title="لون الخط" 
                    className="p-2 hover:bg-border/20 rounded-lg cursor-pointer flex items-center gap-0.5"
                  >
                    <Palette className="w-4 h-4 opacity-70 text-accent" />
                  </button>
                  {isPenDropdownOpen && (
                    <div className="absolute right-0 top-9 w-28 bg-white dark:bg-surface-dark border border-border/60 rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-0.5 text-right">
                      {PEN_COLORS.map((color, idx) => (
                        <button 
                          key={idx}
                          onClick={() => insertColorText(color.hex)}
                          className="px-2 py-1.5 rounded-lg text-[10px] font-bold hover:bg-surface2-light dark:hover:bg-surface2-dark text-right flex items-center gap-2 w-full cursor-pointer"
                        >
                          <span className={cn("w-3 h-3 rounded-full shrink-0", color.class)} />
                          <span>{color.name}</span>
                        </button>
                      ))}
                      <button 
                        onClick={() => insertColorText('')}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold hover:bg-surface2-light dark:hover:bg-surface2-dark text-right flex items-center gap-2 w-full border-t border-border/30 mt-1 cursor-pointer"
                      >
                        <span className="w-3 h-3 rounded-full shrink-0 bg-transparent border border-border" />
                        <span>مسح التنسيق</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Highlighter Picker */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsHighlighterDropdownOpen(!isHighlighterDropdownOpen);
                      setIsPenDropdownOpen(false);
                      setIsHeaderDropdownOpen(false);
                    }}
                    title="تمييز النص" 
                    className="p-2 hover:bg-border/20 rounded-lg cursor-pointer flex items-center gap-0.5"
                  >
                    <Highlighter className="w-4 h-4 opacity-70 text-warning" />
                  </button>
                  {isHighlighterDropdownOpen && (
                    <div className="absolute right-0 top-9 w-28 bg-white dark:bg-surface-dark border border-border/60 rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-0.5 text-right">
                      {HIGHLIGHT_COLORS.map((color, idx) => (
                        <button 
                          key={idx}
                          onClick={() => insertHighlightText(color.hex)}
                          className="px-2 py-1.5 rounded-lg text-[10px] font-bold hover:bg-surface2-light dark:hover:bg-surface2-dark text-right flex items-center gap-2 w-full cursor-pointer"
                        >
                          <span className={cn("w-3 h-3 rounded shrink-0", color.class)} />
                          <span>{color.name}</span>
                        </button>
                      ))}
                      <button 
                        onClick={() => insertHighlightText('')}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold hover:bg-surface2-light dark:hover:bg-surface2-dark text-right flex items-center gap-2 w-full border-t border-border/30 mt-1 cursor-pointer"
                      >
                        <span className="w-3 h-3 rounded shrink-0 bg-transparent border border-border" />
                        <span>مسح التمييز</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-[1px] h-5 bg-border mx-1" />

                {/* Headers Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsHeaderDropdownOpen(!isHeaderDropdownOpen);
                      setIsPenDropdownOpen(false);
                      setIsHighlighterDropdownOpen(false);
                    }}
                    className="h-8 px-2.5 bg-surface2-light dark:bg-surface2-dark border border-border/30 rounded-lg text-[10px] font-black flex items-center gap-1 hover:bg-border/20 cursor-pointer"
                  >
                    <Heading className="w-3.5 h-3.5 text-accent" />
                    <span>العناوين</span>
                  </button>
                  {isHeaderDropdownOpen && (
                    <div className="absolute right-0 top-9 w-24 bg-white dark:bg-surface-dark border border-border/60 rounded-xl shadow-xl p-1 z-50 flex flex-col gap-0.5 text-right">
                      {['#', '##', '###', '####', '#####', '######'].map((tag, idx) => (
                        <button 
                          key={idx}
                          onClick={() => insertHeader(tag)}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-black hover:bg-surface2-light dark:hover:bg-surface2-dark text-right cursor-pointer"
                        >
                          عنوان H{idx + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-[1px] h-5 bg-border mx-1" />

                {/* Alignment */}
                <div className="flex bg-surface2-light dark:bg-surface2-dark p-0.5 rounded-lg border border-border/30">
                  <button 
                    onClick={() => handleAlignmentChange('right')}
                    className={cn("p-1 rounded-md transition-colors cursor-pointer", alignment === 'right' ? "bg-white dark:bg-surface-dark text-accent shadow-sm" : "opacity-45")}
                    title="محاذاة لليمين"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleAlignmentChange('center')}
                    className={cn("p-1 rounded-md transition-colors cursor-pointer", alignment === 'center' ? "bg-white dark:bg-surface-dark text-accent shadow-sm" : "opacity-45")}
                    title="محاذاة للوسط"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleAlignmentChange('left')}
                    className={cn("p-1 rounded-md transition-colors cursor-pointer", alignment === 'left' ? "bg-white dark:bg-surface-dark text-accent shadow-sm" : "opacity-45")}
                    title="محاذاة لليصار"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleAlignmentChange('justify')}
                    className={cn("p-1 rounded-md transition-colors cursor-pointer", alignment === 'justify' ? "bg-white dark:bg-surface-dark text-accent shadow-sm" : "opacity-45")}
                    title="ضبط النص"
                  >
                    <AlignJustify className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-[1px] h-5 bg-border mx-1" />

                {/* Formatting Helpers */}
                <button onClick={() => execFormat('bold')} title="عريض" className="p-2 hover:bg-border/20 rounded-lg cursor-pointer"><Bold className="w-3.5 h-3.5 opacity-60" /></button>
                <button onClick={() => execFormat('italic')} title="مائل" className="p-2 hover:bg-border/20 rounded-lg cursor-pointer"><Italic className="w-3.5 h-3.5 opacity-60" /></button>
                <button onClick={() => execFormat('insertUnorderedList')} title="قائمة" className="p-2 hover:bg-border/20 rounded-lg cursor-pointer"><List className="w-3.5 h-3.5 opacity-60" /></button>
                <button onClick={() => execFormat('formatBlock', '<pre>')} title="كود" className="p-2 hover:bg-border/20 rounded-lg cursor-pointer"><Code className="w-3.5 h-3.5 opacity-60" /></button>
                <button onClick={insertLink} title="رابط" className="p-2 hover:bg-border/20 rounded-lg cursor-pointer"><LinkIcon className="w-3.5 h-3.5 opacity-60" /></button>
                <button onClick={handleImageToolbarClick} title="صورة" className="p-2 hover:bg-border/20 rounded-lg cursor-pointer"><Image className="w-3.5 h-3.5 opacity-60" /></button>

              </div>

              {/* Right View Switcher: Edit / Preview */}
              <div className="flex p-0.5 bg-surface2-light dark:bg-surface2-dark rounded-xl border border-border/40 select-none shrink-0">
                <button
                  onClick={() => setViewMode('edit')}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1.5 cursor-pointer", 
                    viewMode === 'edit' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-45 hover:opacity-100"
                  )}
                >
                  <Edit className="w-3.5 h-3.5" />
                  تحرير
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1.5 cursor-pointer", 
                    viewMode === 'preview' ? "bg-white dark:bg-surface-dark shadow text-accent" : "opacity-45 hover:opacity-100"
                  )}
                >
                  <Eye className="w-3.5 h-3.5" />
                  معاينة
                </button>
              </div>

            </div>

            {/* Note Title & Content Editor */}
            <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full flex flex-col gap-6">
              
              <input id="notepad-image-uploader" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />

              {/* Title Input */}
              <input 
                type="text"
                value={selectedPrompt.title}
                onChange={e => handleTitleChange(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-2xl font-black text-slate-800 dark:text-slate-100 placeholder-slate-400 py-2 border-b border-border/10 focus:border-accent/30 transition-all"
                placeholder="عنوان الملاحظة..."
              />

              {/* Text Editor content */}
              {viewMode === 'edit' ? (
                <div className={cn(
                  "flex-1 flex flex-col min-h-[400px] relative transition-all duration-500 rounded-xl p-2",
                  aiEnhancing && "animate-pulse",
                  aiEnhancing && aiEnhancingProvider === 'gemini' && "border border-indigo-500/30 bg-indigo-500/[0.01] shadow-[0_0_20px_rgba(99,102,241,0.05)]",
                  aiEnhancing && aiEnhancingProvider === 'openai' && "border border-emerald-500/30 bg-emerald-500/[0.01] shadow-[0_0_20px_rgba(16,185,129,0.05)]",
                  aiEnhancing && aiEnhancingProvider === 'claude' && "border border-orange-500/30 bg-orange-500/[0.01] shadow-[0_0_20px_rgba(249,115,22,0.05)]"
                )}>
                  {/* Floating AI Enhancer Buttons */}
                  {hasAnyAi && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 p-1.5 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border border-border/30 rounded-full shadow-lg z-30 transition-all duration-300 select-none group/pill hover:border-accent/30 shadow-black/5 hover:shadow-black/10">
                       {isGeminiActive && (
                         <button
                           type="button"
                           onClick={() => handleAiEnhance('gemini')}
                           disabled={aiEnhancing}
                           className={cn(
                             "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 relative group cursor-pointer border border-transparent",
                             aiEnhancingProvider === 'gemini' 
                               ? "bg-indigo-500/20 text-indigo-500 border-indigo-500/30 shadow-indigo-500/20 shadow-md animate-pulse" 
                               : "bg-surface2-light dark:bg-surface2-dark text-slate-500 hover:text-indigo-500 hover:bg-indigo-500/10 hover:border-indigo-500/20 hover:scale-110"
                           )}
                         >
                           <Sparkles className={cn("w-4 h-4", aiEnhancingProvider === 'gemini' && "animate-spin text-indigo-500")} />
                           <span className="absolute bottom-full mb-2.5 hidden group-hover:block text-[9px] font-black bg-slate-950/90 dark:bg-slate-900/95 text-white px-2 py-1 rounded-lg border border-border/10 shadow-md whitespace-nowrap z-50">
                             تحسين صياغة البرومبت عبر Gemini
                           </span>
                         </button>
                       )}
                       {isOpenAIActive && (
                         <button
                           type="button"
                           onClick={() => handleAiEnhance('openai')}
                           disabled={aiEnhancing}
                           className={cn(
                             "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 relative group cursor-pointer border border-transparent",
                             aiEnhancingProvider === 'openai' 
                               ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30 shadow-emerald-500/20 shadow-md animate-pulse" 
                               : "bg-surface2-light dark:bg-surface2-dark text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:scale-110"
                           )}
                         >
                           <Cpu className={cn("w-4 h-4", aiEnhancingProvider === 'openai' && "animate-spin text-emerald-500")} />
                           <span className="absolute bottom-full mb-2.5 hidden group-hover:block text-[9px] font-black bg-slate-950/90 dark:bg-slate-900/95 text-white px-2 py-1 rounded-lg border border-border/10 shadow-md whitespace-nowrap z-50">
                             تحسين صياغة البرومبت عبر OpenAI
                           </span>
                         </button>
                       )}
                       {isClaudeActive && (
                         <button
                           type="button"
                           onClick={() => handleAiEnhance('claude')}
                           disabled={aiEnhancing}
                           className={cn(
                             "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 relative group cursor-pointer border border-transparent",
                             aiEnhancingProvider === 'claude' 
                               ? "bg-orange-500/20 text-orange-500 border-orange-500/30 shadow-orange-500/20 shadow-md animate-pulse" 
                               : "bg-surface2-light dark:bg-surface2-dark text-slate-500 hover:text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/20 hover:scale-110"
                           )}
                         >
                           <Brain className={cn("w-4 h-4", aiEnhancingProvider === 'claude' && "animate-spin text-orange-500")} />
                           <span className="absolute bottom-full mb-2.5 hidden group-hover:block text-[9px] font-black bg-slate-950/90 dark:bg-slate-900/95 text-white px-2 py-1 rounded-lg border border-border/10 shadow-md whitespace-nowrap z-50">
                             تحسين صياغة البرومبت عبر Claude
                           </span>
                         </button>
                       )}
                    </div>
                  )}

                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleEditorInput}
                    onPaste={handlePaste}
                    className={cn(
                      "w-full flex-1 bg-transparent border-none outline-none resize-none leading-loose placeholder-slate-400/50 min-h-[400px] text-right focus:outline-none overflow-y-auto",
                      fontFamily,
                      fontSize
                    )}
                    style={{ direction: 'rtl' }}
                    placeholder="اكتب البرومبت هنا..."
                  />
                  <div className="pt-4 border-t border-border/20 text-[10px] font-bold opacity-45 flex items-center justify-between">
                    <span>عدد الأحرف: {selectedPrompt ? selectedPrompt.content.length : 0}</span>
                    <span className="flex items-center gap-1 text-success"><Check className="w-3 h-3" /> تم الحفظ تلقائياً في المتصفح</span>
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
                        <span className="text-xs font-black">جاري تحسين الصياغة بالذكاء الاصطناعي...</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={cn(
                  "flex-1 prose prose-sm dark:prose-invert max-w-none leading-loose",
                  fontFamily,
                  fontSize,
                  alignment === 'center' ? 'text-center' : alignment === 'left' ? 'text-left' : alignment === 'justify' ? 'text-justify' : 'text-right'
                )}>
                  <Markdown rehypePlugins={[rehypeRaw]}>{selectedPrompt.content || '_لا توجد نصوص للمعاينة..._'}</Markdown>
                </div>
              )}

            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center select-none py-20">
            <FileText className="w-16 h-16 text-accent opacity-20" />
            <h3 className="text-base font-black">المفكرة فارغة</h3>
            <p className="text-xs font-medium opacity-50 max-w-xs leading-relaxed">اختر برومبت من القائمة الجانبية أو اضغط على زر "جديد" لإنشاء برومبت في مجلدك.</p>
            <Button onClick={() => handleCreatePromptInFolder('gemini')}>إنشاء برومبت جديد</Button>
          </div>
        )}
      </div>
 
      {/* Folder Customization Modal */}
      {editingFolder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 select-none">
          <Card className="w-full max-w-md shadow-2xl border border-border/80 bg-surface-light dark:bg-surface-dark overflow-hidden text-right pointer-events-auto">
            <CardHeader title="تخصيص المجلد" />
            <CardContent className="space-y-4 pt-4">
              {/* Folder Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold opacity-60">اسم المجلد</label>
                <input
                  type="text"
                  value={folderEditName}
                  onChange={e => setFolderEditName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-border/40 bg-surface2-light dark:bg-surface2-dark text-sm outline-none focus:border-accent text-slate-800 dark:text-slate-100"
                  placeholder="مثال: برومبتات البرمجة..."
                />
              </div>

              {/* Folder Color */}
              <div className="space-y-2">
                <label className="text-xs font-bold opacity-60">اللون المختار</label>
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
              <div className="space-y-2">
                <label className="text-xs font-bold opacity-60 block">أيقونة المجلد</label>
                <div className="flex items-center gap-3 bg-surface2-light dark:bg-surface2-dark p-3 rounded-xl border border-border/30">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-border/50 bg-white dark:bg-surface-dark shrink-0">
                    {folderEditIcon ? (
                      <img src={folderEditIcon} alt="Icon Preview" className="w-8 h-8 object-contain" />
                    ) : (
                      <Folder className="w-8 h-8 text-slate-400" style={{ color: folderEditColor }} />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
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
                        رفع صورة
                      </Button>
                      {folderEditIcon && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-[10px] font-bold text-danger hover:bg-danger/10 cursor-pointer"
                          onClick={() => setFolderEditIcon('')}
                        >
                          مسح الأيقونة
                        </Button>
                      )}
                    </div>
                    <span className="text-[9px] opacity-45 font-bold">يمكنك اختيار أي صورة لتكون أيقونة المجلد.</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-4">
                <Button variant="ghost" className="flex-1 text-xs font-bold" onClick={() => setEditingFolder(null)}>إلغاء</Button>
                <Button className="flex-1 bg-accent text-white text-xs font-bold shadow-lg shadow-accent/15" onClick={saveFolderEdits}>حفظ التغييرات</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Type, 
  Minus 
} from 'lucide-react';
import { cn } from '../../lib/cn';

interface MarkdownToolbarProps {
  onInsert: (prefix: string, suffix?: string) => void;
  className?: string;
}

export function MarkdownToolbar({ onInsert, className }: MarkdownToolbarProps) {
  const tools = [
    { icon: Bold, label: 'Bold', action: () => onInsert('**', '**'), tooltip: 'خط عريض' },
    { icon: Italic, label: 'Italic', action: () => onInsert('_', '_'), tooltip: 'خط مائل' },
    { icon: Type, label: 'Heading', action: () => onInsert('### '), tooltip: 'عنوان' },
    { icon: LinkIcon, label: 'Link', action: () => onInsert('[', '](url)'), tooltip: 'رابط' },
    { icon: Code, label: 'Code', action: () => onInsert('`', '`'), tooltip: 'كود' },
    { icon: Quote, label: 'Quote', action: () => onInsert('> '), tooltip: 'اقتباس' },
    { icon: List, label: 'Unordered List', action: () => onInsert('- '), tooltip: 'قائمة' },
    { icon: ListOrdered, label: 'Ordered List', action: () => onInsert('1. '), tooltip: 'قائمة مرقمة' },
    { icon: Minus, label: 'Divider', action: () => onInsert('\n---\n'), tooltip: 'فاصل' },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-1 p-2 bg-surface2-light/50 dark:bg-surface2-dark/50 border-b border-border/40", className)}>
      {tools.map((tool, idx) => (
        <button
          key={idx}
          onClick={(e) => {
            e.preventDefault();
            tool.action();
          }}
          className="p-2 rounded-lg hover:bg-surface2-light dark:hover:bg-surface-dark text-muted-light dark:text-muted-dark hover:text-accent transition-all group relative"
          title={tool.tooltip}
        >
          <tool.icon className="w-4 h-4" />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
            {tool.tooltip}
          </span>
        </button>
      ))}
    </div>
  );
}

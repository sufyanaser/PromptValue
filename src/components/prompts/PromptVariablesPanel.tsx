import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Copy, Check, RefreshCw } from 'lucide-react';

interface PromptVariablesPanelProps {
  content: string;
  variables: string[];
  onCopy: (finalContent: string) => void;
}

export function PromptVariablesPanel({ content, variables, onCopy }: PromptVariablesPanelProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // Extract unique variables
  const uniqueVars = Array.from(new Set(variables));

  const getFinalContent = () => {
    let final = content;
    Object.entries(values).forEach(([key, val]) => {
      final = final.replace(new RegExp(`\\{${key}\\}`, 'g'), val || `{${key}}`);
    });
    return final;
  };

  const handleCopy = () => {
    const final = getFinalContent();
    navigator.clipboard.writeText(final);
    setCopied(true);
    onCopy(final);
    setTimeout(() => setCopied(false), 2000);
  };

  if (uniqueVars.length === 0) return null;

  return (
    <Card variant="surface" className="border-accent/30">
      <CardHeader 
        title="تعبئة المتغيرات" 
        subtitle="املأ القيم أدناه لتخصيص البرومبت قبل النسخ"
      />
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {uniqueVars.map(variable => (
            <Input
              key={variable}
              label={variable}
              placeholder={`أدخل ${variable}...`}
              value={values[variable] || ''}
              onChange={e => setValues({ ...values, [variable]: e.target.value })}
            />
          ))}
        </div>
        
        <div className="pt-4 flex flex-col gap-3">
          <div className="p-4 bg-white dark:bg-surface2-dark rounded-xl border border-border/40 text-xs font-mono whitespace-pre-wrap opacity-60 max-h-32 overflow-y-auto">
            {getFinalContent()}
          </div>
          
          <Button onClick={handleCopy} className="w-full">
            {copied ? <Check className="w-4 h-4 ml-2" /> : <Copy className="w-4 h-4 ml-2" />}
            {copied ? 'تم النسخ!' : 'نسخ النص النهائي'}
          </Button>
          
          <Button variant="ghost" size="sm" onClick={() => setValues({})} className="text-[10px]">
             <RefreshCw className="w-3 h-3 ml-1" />
             إعادة تعيين القيم
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

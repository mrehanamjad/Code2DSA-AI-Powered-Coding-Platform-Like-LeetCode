import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export function CodeEditor({ 
  value, 
  onChange, 
  placeholder = "// Enter code here...",
  className,
  rows = 12
}: CodeEditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={cn(
        "code-editor resize-none font-mono text-sm leading-relaxed",
        className
      )}
      spellCheck={false}
    />
  );
}
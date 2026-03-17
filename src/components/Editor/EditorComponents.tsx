import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  AlertOctagon, Check, ChevronDown, ChevronUp,  
  Code2, Copy, Loader2, Play, RotateCcw,  Send, 
  Terminal, Beaker, FileCheck
} from "lucide-react";
import { useState } from "react";
import {  TabType } from "./types";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setCurrentCodeLanguageIS } from "@/lib/redux/features/codeSlice";

// --- 1. TOOLBAR ---
interface ToolbarProps {
  language: string;
  setLanguage: (lang: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
}

export function EditorToolbar({ language, setLanguage, onRun, onSubmit, onReset, isRunning,isSubmitting }: ToolbarProps) {
  const dispatch = useAppDispatch();

  const onLanguageChange = (lang: string) => {
    dispatch(setCurrentCodeLanguageIS(lang));
    setLanguage(lang);
  };

  return (
    <div className="flex items-center justify-between p-3 border-b bg-card">
      <Select value={language} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-[160px] h-8 bg-muted/50">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="javascript">JavaScript</SelectItem>
          <SelectItem value="python">Python</SelectItem>
          <SelectItem value="java">Java</SelectItem>
          <SelectItem value="cpp">C++</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onReset} disabled={isRunning} className="h-8">
          <RotateCcw className="h-4 w-4 mr-2" />
        </Button>
        <Button variant="secondary" size="sm" onClick={onRun} disabled={isRunning} className="h-8">
          {isRunning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2 fill-current" />} Run
        </Button>
        <Button size="sm" onClick={onSubmit} disabled={isSubmitting} className="h-8 bg-green-600 hover:bg-green-700 text-white">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />} Submit
        </Button>
      </div>
    </div>
  );
}

// --- 2. CONSOLE HEADER ---
interface ConsoleHeaderProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
}

export function ConsoleHeader({ isOpen, setIsOpen, activeTab, setActiveTab }: ConsoleHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 h-[40px] bg-muted/30 border-b cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex gap-4 h-full">
        {[
          { id: 'testcase', icon: Terminal, label: 'Test Cases' },
          { id: 'result', icon: Beaker, label: 'Test Result' },
          { id: 'submission', icon: FileCheck, label: 'Submission Result' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={(e) => { e.stopPropagation(); setActiveTab(tab.id as TabType); setIsOpen(true); }} 
            className={cn(
              "text-xs font-medium border-b-2 h-full flex items-center gap-2 px-2 transition-colors", 
              activeTab === tab.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" /> {tab.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
         {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </div>
    </div>
  );
}

// --- 3. ERROR VIEW ---
export function ErrorView({ error, title }: { error: string, title: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold">
        <AlertOctagon className="h-5 w-5" />
        <span>{title}</span>
      </div>
      <div className="bg-white dark:bg-black/20 p-3 rounded-md border border-red-100 dark:border-red-900/50 overflow-auto max-h-[250px]">
         <pre className="text-xs font-mono text-red-700 dark:text-red-300 whitespace-pre-wrap leading-relaxed">
           {error}
         </pre>
      </div>
    </div>
  );
}

// --- 4. EXPANDABLE CODE BLOCK ---
export function ExpandableCodeBlock({ code, language }: { code: string, language: string }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border bg-zinc-950/80 overflow-hidden shadow-sm group animate-in fade-in slide-in-from-bottom-2 delay-75">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800">
          <span className="text-xs text-muted-foreground font-mono flex items-center gap-2">
              <Code2 className="h-3 w-3" /> Code | {language}
          </span>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white" onClick={handleCopy}>
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
      </div>
      <div className="relative">
          <pre className={cn("p-4 font-mono text-xs md:text-sm text-zinc-300 overflow-hidden transition-all duration-300", !expanded ? "max-h-[100px]" : "h-auto")}>
              {code.split('\n').map((line, i) => (
                  <div key={i} className="table-row">
                      <span className="table-cell select-none text-zinc-600 text-right pr-4 w-8">{i+1}</span>
                      <span className="table-cell whitespace-pre-wrap">{line}</span>
                  </div>
              ))}
          </pre>
          {!expanded && <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />}
          <div className={cn("absolute bottom-0 left-0 w-full flex justify-center pb-2 pt-8", !expanded && "bg-gradient-to-t from-zinc-950 to-transparent")}>
              <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 backdrop-blur-sm px-3 py-1 rounded-full transition-colors border border-zinc-700">
                  {expanded ? "Show less" : "View more"} {expanded ? <ChevronUp className="h-3 w-3"/> : <ChevronDown className="h-3 w-3"/>}
              </button>
          </div>
      </div>
    </div>
  );
}

// --- 5. TEST CASE DETAIL RENDERER ---
export function TestCaseDetail({inputs,output, expected,isPassed,error ,paramNames }: { inputs: unknown[]; output?: unknown; expected: unknown; isPassed: boolean;error?: string; paramNames: string[] }) {
  if (!output && !error) return null;
  return (
    <div className="space-y-4 font-mono text-sm animate-in fade-in duration-300">
      {inputs && (
        <div className="grid gap-1">
          <span className="text-xs text-muted-foreground">Input</span>
          <div className="p-3 bg-muted/30 rounded-md border text-xs">
            {inputs.map((inp, i: number) => (
               <div key={i} className="mb-1 last:mb-0">
                  <span className="text-blue-500 mr-2">{paramNames[i]} =</span>
                  {JSON.stringify(inp)}
               </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-4">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Output</span>
          <div className={cn("p-3 rounded-md border text-xs overflow-auto", isPassed ? "bg-green-500/10 border-green-500/20 text-green-700" : "bg-red-500/10 border-red-500/20 text-red-700")}>
            {JSON.stringify(output)}
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Expected</span>
          <div className="p-3 bg-muted/30 border text-muted-foreground rounded-md text-xs overflow-auto">
            {JSON.stringify(expected)}
          </div>
        </div>
      </div>
      {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-600 text-xs">
            {error}
          </div>
      )}
    </div>
  );
}
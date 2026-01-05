"use client";

import React, { useState, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import {
  Play,
  Settings2,
  Terminal,
  Moon,
  Sun,
  Monitor,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  Loader2,
  Command,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

// --- Configuration ---

const BOILERPLATES = {
  javascript: `console.log("Welcome to Code2DSA");\n// Write your code here...`,
  typescript: `console.log("Welcome to Code2DSA");\n// Write your code here...`,
  python: `print("Welcome to Code2DSA")\n# Write your code here...`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Welcome to Code2DSA");\n    }\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Welcome to Code2DSA" << endl;\n    return 0;\n}`,
  csharp: `using System;\n\npublic class Program {\n    public static void Main() {\n        Console.WriteLine("Welcome to Code2DSA");\n    }\n}`,
  go: `package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Welcome to Code2DSA")\n}`,
  rust: `fn main() {\n    println!("Welcome to Code2DSA");\n}`,
  php: `<?php\necho "Welcome to Code2DSA";\n?>`,
};

const LANGUAGES = [
  { id: "javascript", name: "JavaScript", version: "18.15.0", icon: "devicon-javascript-plain colored" },
  { id: "typescript", name: "TypeScript", version: "5.0.3", icon: "devicon-typescript-plain colored" },
  { id: "python", name: "Python", version: "3.10.0", icon: "devicon-python-plain colored" },
  { id: "java", name: "Java", version: "15.0.2", icon: "devicon-java-plain colored" },
  { id: "cpp", name: "C++ (GCC)", version: "10.2.0", icon: "devicon-cplusplus-plain colored" },
  { id: "csharp", name: "C#", version: "6.12.0", icon: "devicon-csharp-plain colored" },
  { id: "go", name: "Go", version: "1.16.2", icon: "devicon-go-original-wordmark colored" },
  { id: "rust", name: "Rust", version: "1.68.2", icon: "devicon-rust-plain text-white" }, // Rust icon usually needs white in dark mode
  { id: "php", name: "PHP", version: "8.2.3", icon: "devicon-php-plain colored" },
];

const THEMES = [
  { id: "vs-dark", name: "Dark" },
  { id: "light", name: "Light" },
  { id: "hc-black", name: "High Contrast" },
];

export const LANGUAGE_VERSIONS: Record<string, string> = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
  cpp: "10.2.0", // gcc
  go: "1.16.2",
  rust: "1.68.2",
};

export const executeCode = async (language: string, sourceCode: string, stdin: string = "") => {
  const version = LANGUAGE_VERSIONS[language] || "*";
  
  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version,
        files: [{ content: sourceCode }],
        stdin: stdin, // Pass user input here
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Piston API Error:", error);
    throw error;
  }
};

export default function CodeCompiler() {
  // --- State ---
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(BOILERPLATES.javascript); 
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [minimap, setMinimap] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [stdInput, setStdInput] = useState("");
  const [executionTime, setExecutionTime] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const editorRef = useRef<unknown>(null);

  // --- Handlers ---
  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleLanguageChange = (langId: string) => {
    const selectedLang = LANGUAGES.find((l) => l.id === langId);
    if (selectedLang) {
      setLanguage(selectedLang);
      // @ts-expect-error there can be a ts error
      setCode(BOILERPLATES[langId] || "// Code here");
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput(null);
    setIsError(false);
    setExecutionTime(null);

    const startTime = performance.now();

    try {
      const result = await executeCode(language.id, code, stdInput);
      const endTime = performance.now();
      setExecutionTime(((endTime - startTime) / 1000).toFixed(2));

      if (result.run) {
        setOutput(result.run.output);
        setIsError(result.run.stderr.length > 0);
      } else {
        setOutput("Error: Execution failed. Please try again.");
        setIsError(true);
      }
    } catch (error) {
        console.log(error)
      setOutput("Network Error: Failed to connect to compiler service.");
      setIsError(true);
    } finally {
      setIsRunning(false);
    }
  };

  // --- Sub-components ---
  const LanguageList = () => (
    <div className="flex flex-col gap-1 p-2">
      <div className="text-xs font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-wider">
        Languages
      </div>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.id}
          onClick={() => handleLanguageChange(lang.id)}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-all duration-200 border border-transparent group",
            language.id === lang.id
              ? "bg-primary/10 border-primary/20 text-primary font-medium"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          {/* DevIcon Icon */}
          <i className={cn(lang.icon, "text-lg transition-transform group-hover:scale-110")}></i>
          
          <span className="flex-1 text-left">{lang.name}</span>
          
          {language.id === lang.id && (
            <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary))] animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] w-full max-w-[1600px] mx-auto border rounded-xl overflow-hidden shadow-2xl bg-background">
      
      {/* 1. Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 bg-muted/20 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Separator orientation="vertical" className="h-6 hidden md:block" />
          
          {/* Active Language Display (Mobile/Desktop) */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
             <i className={cn(language.icon, "text-lg")}></i>
             <span className="font-mono text-xs hidden sm:inline">{language.version}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">            
          {/* Settings Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                <Settings2 className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-5 mr-4" align="end">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium leading-none">Editor Preferences</h4>
                </div>
                <Separator />
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {THEMES.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            <div className="flex items-center gap-2">
                              {t.id.includes("dark") ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                              {t.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label>Font Size</Label>
                      <span className="text-xs text-muted-foreground font-mono">{fontSize}px</span>
                    </div>
                    <Slider
                      value={[fontSize]}
                      min={10}
                      max={24}
                      step={1}
                      onValueChange={(v) => setFontSize(v[0])}
                      className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 cursor-pointer" htmlFor="minimap">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      Minimap
                    </Label>
                    <Switch id="minimap" checked={minimap} onCheckedChange={setMinimap} />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Run Button */}
          <Button
            onClick={runCode}
            disabled={isRunning}
            className="min-w-[100px] bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm transition-all"
            size="sm"
          >
            {isRunning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4 fill-current" />
            )}
            Run
          </Button>

          {/* Mobile Language Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                <PanelLeftOpen className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 pt-10">
              <ScrollArea className="h-full">
                <LanguageList />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* 2. Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: Language Sidebar (Desktop Only) */}
        <div 
          className={cn(
            "hidden lg:flex flex-col border-r bg-muted/10 transition-all duration-300",
            sidebarOpen ? "w-64" : "w-16 items-center"
          )}
        >
          <div className="flex items-center justify-between p-2 h-10 border-b w-full">
            {sidebarOpen && <span className="text-xs font-semibold px-2 uppercase text-muted-foreground">Explorer</span>}
            <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-6 w-6", sidebarOpen ? "ml-auto" : "")}
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </Button>
          </div>

          <ScrollArea className="flex-1 w-full">
            {sidebarOpen ? (
                <LanguageList />
            ) : (
                 <div className="flex flex-col items-center gap-4 py-4">
                    {LANGUAGES.map(lang => (
                        <div key={lang.id} className="relative group">
                            <button
                                onClick={() => handleLanguageChange(lang.id)}
                                className={cn(
                                    "p-2 rounded-md transition-colors",
                                    language.id === lang.id ? "bg-primary/10" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <i className={cn(lang.icon, "text-xl")}></i>
                            </button>
                            {/* Tooltip for collapsed state */}
                            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                {lang.name}
                            </div>
                        </div>
                    ))}
                 </div>
            )}
          </ScrollArea>
        </div>

        {/* RIGHT: Editor & Console Split */}
        <div className="flex-1 flex flex-col min-w-0">
          <ResizablePanelGroup direction="vertical" className="h-full">
            
            {/* Top: Editor */}
            <ResizablePanel defaultSize={70} minSize={30}>
              <div className="h-full relative bg-editor-bg">
                <Editor
                  height="100%"
                  language={language.id === "csharp" ? "csharp" : language.id}
                  value={code}
                  theme={theme}
                  onChange={(val) => setCode(val || "")}
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: minimap },
                    fontSize: fontSize,
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 },
                    fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                    fontLigatures: true,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    lineNumbersMinChars: 3,
                  }}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Bottom: Console (Split Input / Output) */}
            <ResizablePanel defaultSize={30} minSize={10}>
              <div className="h-full flex flex-col bg-zinc-950 text-zinc-300 border-t border-zinc-800">
                {/* Console Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-xs select-none">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-zinc-100 font-medium">
                      <Terminal className="h-3.5 w-3.5" />
                      Console
                    </div>
                    {executionTime && (
                      <span className="text-zinc-500">
                        Process finished in {executionTime}s
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"
                    onClick={() => {
                        setOutput(null); 
                        setIsError(false);
                    }}
                    title="Clear Console"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Console Body: Split View */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                  
                  {/* Left: Input */}
                  <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-zinc-800 relative bg-zinc-900/30">
                     
                     {/* Input Hint */}
                     <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800/50 bg-zinc-900/50">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Input</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-600">
                            <Info className="h-3 w-3" />
                            <span>Split multiple inputs with new lines</span>
                        </div>
                     </div>
                     
                    <textarea
                      className="flex-1 w-full bg-transparent p-3 font-mono text-sm resize-none focus:outline-none placeholder:text-zinc-700 text-zinc-300"
                      placeholder="Split multiple inputs with new lines"
                      spellCheck={false}
                      value={stdInput}
                      onChange={(e) => setStdInput(e.target.value)}
                    />
                  </div>

                  {/* Right: Output */}
                  <div className="flex-[1.5] flex flex-col relative bg-zinc-950">
                     <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800/50 bg-zinc-900/50">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Output</span>
                     </div>
                     
                     <div className="flex-1 p-3 font-mono text-sm overflow-auto">
                        {!output && !isError && (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-800">
                                <Command className="h-6 w-6 mb-2 opacity-20" />
                                <p className="text-xs opacity-50">Run code to see output</p>
                            </div>
                        )}
                        <div className={cn("whitespace-pre-wrap break-all", isError ? "text-red-400" : "text-green-400")}>
                            {output}
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </ResizablePanel>

          </ResizablePanelGroup>
        </div>

      </div>

      {/* Footer Status Bar */}
      <div className="h-6 bg-primary/5 border-t flex items-center justify-between px-3 text-[10px] text-muted-foreground select-none">
        <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
                <div className={cn("h-1.5 w-1.5 rounded-full", isRunning ? "bg-yellow-500 animate-pulse" : "bg-green-500")} />
                {isRunning ? "Compiling..." : "Ready"}
            </span>
        </div>
        <span>Ln {code.split('\n').length}, Col 1</span>
      </div>
    </div>
  );
}
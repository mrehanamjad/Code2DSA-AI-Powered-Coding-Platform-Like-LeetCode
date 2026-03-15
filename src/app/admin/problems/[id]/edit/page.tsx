"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Plus, Trash2, ArrowLeft, Save, FileJson, 
  FormInput, Loader2, RotateCcw, Wand2
} from "lucide-react";

// Components
import { FormSection } from "@/components/admin/FormSection";
import { TagInput } from "@/components/admin/TagInput";
import { CodeEditor } from "@/components/admin/CodeEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Data & Types
import { 
  ProblemI, ExampleI, StarterCodeI, Difficulty,
  SupportedLanguage 
} from "@/types/adminProb"
import { generateStarterCode, getDefaultStarterCode } from "@/lib/starterCodeGenerator";

type InputMode = "form" | "json";

export default function EditProblem() {
  const router = useRouter();
  const params_route = useParams();
  const paramProblemId = params_route.id as string;

  // Loading & UI State
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>("javascript");
  const [inputMode, setInputMode] = useState<InputMode>("form");
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Form state
  const [problemId, setProblemId] = useState("");
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [topics, setTopics] = useState<string[]>([]);
  const [functionName, setFunctionName] = useState("");
  const [params, setParams] = useState<string[]>([""]);
  const [description, setDescription] = useState("");
  const [examples, setExamples] = useState<ExampleI[]>([{ input: "", output: "", explanation: "" }]);
  const [constraints, setConstraints] = useState<string[]>([""]);
  const [starterCode, setStarterCode] = useState<StarterCodeI>(getDefaultStarterCode());

  // Load problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/problems/${paramProblemId}`);
        if (!res.ok) throw new Error("Problem not found");
        
        const data = await res.json();
        const problem: ProblemI = data.problem; // GET /api/problems/[id] returns { problem, testCases }
        
        if (!problem) throw new Error("Problem data is missing");

        setProblemId(problem.problemId);
        setTitle(problem.title);
        setDifficulty(problem.difficulty);
        setTopics(problem.topics || []);
        setFunctionName(problem.function.name);
        setParams(problem.function.params.length > 0 ? problem.function.params : [""]);
        setDescription(problem.description);
        setExamples(problem.examples.length > 0 ? problem.examples : [{ input: "", output: "", explanation: "" }]);
        setConstraints(problem.constraints.length > 0 ? problem.constraints : [""]);
        setStarterCode(problem.starterCode || getDefaultStarterCode());
        setJsonInput(JSON.stringify(problem, null, 2));

      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load problem data.");
        router.push("/admin/problems");
      } finally {
        setIsLoading(false);
      }
    };

    if (paramProblemId) fetchProblem();
  }, [paramProblemId, router]);

  useEffect(() => {
    if (functionName.trim() && !isLoading) {
      const validParams = params.filter(p => p.trim() !== "");
      setStarterCode((prev: StarterCodeI) => ({
        ...prev,
        ...generateStarterCode(functionName, validParams)
      }));
    }
  }, [functionName, params, isLoading]);

  useEffect(() => {
    if (inputMode === "form" && !isLoading) {
       const problemData = buildProblemFromForm();
       setJsonInput(JSON.stringify(problemData, null, 2));
    }
  }, [
    problemId, title, difficulty, topics, 
    functionName, params, description, 
    examples, constraints, starterCode, inputMode, isLoading
  ]);

  // JSON to Form Auto-Sync (Debounced)
  useEffect(() => {
    if (inputMode === "json") {
       const timer = setTimeout(() => {
          try {
            const parsed = JSON.parse(jsonInput) as ProblemI;
            if (!parsed.problemId || !parsed.title || !parsed.function?.name) return;

            setProblemId(parsed.problemId);
            setTitle(parsed.title);
            setDifficulty(parsed.difficulty || "Easy");
            setTopics(parsed.topics || []);
            setFunctionName(parsed.function.name);
            setParams(parsed.function.params?.length ? parsed.function.params : [""]);
            setDescription(parsed.description);
            setExamples(parsed.examples?.length ? parsed.examples : [{ input: "", output: "", explanation: "" }]);
            setConstraints(parsed.constraints?.length ? parsed.constraints : [""]);
            setStarterCode(parsed.starterCode || generateStarterCode(parsed.function.name, parsed.function.params || []));
            setJsonError(null);
          } catch (e: any) {
            setJsonError("Invalid JSON format while typing...");
          }
       }, 500);
       return () => clearTimeout(timer);
    }
  }, [jsonInput, inputMode]);

  // Handler Logic (Dynamic Lists)
  const updateList = (setter: any, index: number, value: any) => {
    setter((prev: any[]) => {
      const newList = [...prev];
      newList[index] = value;
      return newList;
    });
  };

  const removeItem = (setter: any, index: number, minLength = 1) => {
    setter((prev: any[]) => prev.length > minLength ? prev.filter((_, i) => i !== index) : prev);
  };

  const buildProblemFromForm = (): ProblemI => ({
    problemId, title, difficulty, topics,
    function: { name: functionName, params: params.filter(p => p.trim() !== "") },
    description,
    examples: examples.filter(e => e.input && e.output),
    constraints: constraints.filter(c => c.trim() !== ""),
    starterCode,
  }) as ProblemI;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const problem = buildProblemFromForm();
      const res = await fetch(`/api/problems/${paramProblemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(problem),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }

      toast.success("Problem updated successfully!");
      router.push("/admin/problems");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update problem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Fetching problem details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
        
        {/* Top Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.push("/admin/problems")} className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Modify Challenge</h1>
              <p className="text-muted-foreground">Adjust requirements for <code className="text-primary">{problemId}</code></p>
            </div>
          </div>

          <div className="flex items-center bg-muted p-1 rounded-xl w-fit">
            <Button 
              variant={inputMode === "form" ? "secondary" : "ghost"} 
              size="sm" onClick={() => setInputMode("form")} className="rounded-lg"
            >
              <FormInput className="mr-2 h-4 w-4" /> Form
            </Button>
            <Button 
              variant={inputMode === "json" ? "secondary" : "ghost"} 
              size="sm" onClick={() => setInputMode("json")} className="rounded-lg"
            >
              <FileJson className="mr-2 h-4 w-4" /> JSON
            </Button>
          </div>
        </div>

        {inputMode === "json" ? (
          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
            <Label className="block text-lg font-semibold">Bulk Export/Import</Label>
            <Textarea 
              value={jsonInput} 
              onChange={e => setJsonInput(e.target.value)} 
              className="min-h-[500px] font-mono text-sm bg-muted/20" 
            />
            {jsonError && <p className="text-destructive text-sm mt-2">{jsonError}</p>}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 space-y-8">
                <FormSection title="Problem Narrative" description="Title and detailed description">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Problem Slug (Unique ID)</Label>
                        <Input value={problemId} onChange={e => setProblemId(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Display Title</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description (Markdown)</Label>
                      <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={10} className="resize-none" />
                    </div>
                  </div>
                </FormSection>

                <FormSection title="Function & Logic" description="Define the problem signature and generated code">
                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Method Name</Label>
                          <Input value={functionName} onChange={e => setFunctionName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Params</Label>
                          {params.map((p, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                              <Input value={p} onChange={e => updateList(setParams, i, e.target.value)} />
                              <Button size="icon" variant="ghost" onClick={() => removeItem(setParams, i)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          ))}
                          <Button variant="link" size="sm" onClick={() => setParams([...params, ""])} className="p-0 h-auto">+ Add Param</Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Generated Starter Code</Label>
                        <CodeEditor 
                        //   language={activeLanguage} 
                          value={starterCode[activeLanguage]} 
                          onChange={(val: string) => setStarterCode((prev: StarterCodeI) => ({...prev, [activeLanguage]: val}))}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                           {(Object.keys(starterCode) as SupportedLanguage[]).map(lang => (
                             <Badge 
                                key={lang} 
                                variant={activeLanguage === lang ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => setActiveLanguage(lang)}
                             >
                               {lang}
                             </Badge>
                           ))}
                        </div>
                      </div>
                   </div>
                </FormSection>

                <FormSection title="Constraints" description="Add rule-sets for the problem">
                    <div className="space-y-3">
                      {constraints.map((c, i) => (
                        <div key={i} className="flex gap-2">
                          <Input value={c} onChange={e => updateList(setConstraints, i, e.target.value)} placeholder="e.g. 2 <= n <= 10^5" />
                          <Button size="icon" variant="ghost" onClick={() => removeItem(setConstraints, i)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => setConstraints([...constraints, ""])} className="w-full border-dashed">
                        <Plus className="mr-2 h-4 w-4" /> Add Constraint
                      </Button>
                    </div>
                </FormSection>

                <FormSection title="Examples & Test Cases" description="Help users understand the expected behavior">
                  <div className="space-y-4">
                    {examples.map((ex, i) => (
                      <div key={i} className="p-4 border rounded-xl bg-muted/20 space-y-3 relative group">
                        <Button 
                          type="button" variant="ghost" size="icon" 
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeItem(setExamples, i)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <div className="grid grid-cols-2 gap-4">
                          <Input value={ex.input} onChange={e => updateList(setExamples, i, {...ex, input: e.target.value})} placeholder="Input" />
                          <Input value={ex.output} onChange={e => updateList(setExamples, i, {...ex, output: e.target.value})} placeholder="Output" />
                        </div>
                        <Input value={ex.explanation} onChange={e => updateList(setExamples, i, {...ex, explanation: e.target.value})} placeholder="Explanation" />
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => setExamples([...examples, {input: "", output: "", explanation: ""}])} className="w-full border-dashed">
                      <Plus className="mr-2 h-4 w-4" /> Add Example Case
                    </Button>
                  </div>
                </FormSection>
              </div>

              <div className="space-y-8">
                <FormSection title="Categorization">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select value={difficulty} onValueChange={v => setDifficulty(v as Difficulty)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                           {["Easy", "Medium", "Hard"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Topic Tags</Label>
                      <TagInput tags={topics} onChange={setTopics} />
                    </div>
                  </div>
                </FormSection>
                
                <div className="rounded-2xl border bg-card p-6 shadow-sm sticky top-6">
                   <h3 className="font-semibold mb-4 flex items-center gap-2">
                     <Wand2 className="h-4 w-4 text-primary" /> Shortcuts
                   </h3>
                   <Button variant="outline" className="w-full justify-start mb-2" onClick={() => {
                      const validParams = params.filter(p => p.trim() !== "");
                      setStarterCode(generateStarterCode(functionName || "solve", validParams));
                      toast.success("Starter code reset to default for all languages.");
                   }}>
                     <RotateCcw className="mr-2 h-4 w-4" /> Reset Starter Code
                   </Button>
                </div>
              </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background/80 backdrop-blur-md shadow-2xl z-50">
               <div className="max-w-5xl mx-auto flex items-center justify-between">
                  <p className="text-xs text-muted-foreground hidden md:block">
                    Editing <code className="bg-muted px-1.5 py-0.5 rounded text-primary">{problemId}</code>
                  </p>
                  <div className="flex gap-4">
                    <Button type="button" variant="ghost" onClick={() => router.push("/admin/problems")}>Discard Changes</Button>
                    <Button type="submit" disabled={isSubmitting} className="min-w-[160px] shadow-lg shadow-primary/20">
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Update Challenge
                    </Button>
                  </div>
               </div>
            </div>
          </form>
        )}
    </div>
  );
}
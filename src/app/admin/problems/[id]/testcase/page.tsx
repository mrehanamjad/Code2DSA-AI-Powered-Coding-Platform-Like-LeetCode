"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Eye, EyeOff, Trash2, Plus, Loader2, Beaker } from "lucide-react";

// Components
import { FormSection } from "@/components/admin/FormSection";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Types
import { TestCaseI, ProblemI } from "@/types/adminProb"

export default function AddTestcasePage() {
  const router = useRouter();
  const params_route = useParams();
  const problemId = params_route.id as string;

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [problem, setProblem] = useState<ProblemI | null>(null);
  const [testCases, setTestCases] = useState<TestCaseI[]>([]);
  
  // Form state
  const [input, setInput] = useState("");
  const [expected, setExpected] = useState("");
  const [isHidden, setIsHidden] = useState(false);

  // Fetch problem and existing test cases
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [probRes, tcRes] = await Promise.all([
          fetch(`/api/problems/${problemId}`),
          fetch(`/api/problems/${problemId}/testcases`)
        ]);

        if (probRes.ok) {
           const data = await probRes.json();
           setProblem(data.problem); // Adjusting based on GET /api/problems/[id] returning {problem, testcases}
           // Actually, the above API already returns testcases, but we can refetch if needed or just use those.
           // Let's use the dedicated endpoint for consistency.
        }
        if (tcRes.ok) {
           setTestCases(await tcRes.json());
        }
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };
    if (problemId) fetchData();
  }, [problemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Basic Validation
      if (!input.trim() || !expected.trim()) {
        throw new Error("Please fill in all required fields.");
      }

      // 2. JSON Parsing & Validation
      let parsedInput, parsedExpected;
      try {
        parsedInput = JSON.parse(input);
        if (!Array.isArray(parsedInput)) {
          throw new Error("Input must be a JSON array of arguments.");
        }
      } catch (e) {
        throw new Error("Invalid Input JSON. Must be an array, e.g., [1, 2]");
      }

      try {
        parsedExpected = JSON.parse(expected);
      } catch (e) {
        throw new Error("Invalid Expected Output JSON.");
      }

      // 3. API Call
      const res = await fetch(`/api/problems/${problemId}/testcases`, {
        method: "POST",
        body: JSON.stringify({
          input: parsedInput,
          expected: parsedExpected,
          isHidden,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save test case.");
      }

      const savedTC = await res.json();
      setTestCases((prev) => [...prev, savedTC]);
      
      toast.success("Test case added successfully.");
      
      // Reset Form
      setInput("");
      setExpected("");
      setIsHidden(false);

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/testcases/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }

      setTestCases(testCases.filter(tc => (tc as any)._id !== id));
      toast.success("Test case removed.");
    } catch (err: any) {
      toast.error(err.message || "Could not delete test case.");
    }
  };

  if (!problem) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b pb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.push("/admin/problems")} className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Test Case Manager</h1>
                <Badge variant="outline" className="font-mono text-[10px]">{problemId}</Badge>
              </div>
              <p className="text-muted-foreground">Configuring cases for: <span className="text-foreground font-semibold">{problem.title}</span></p>
            </div>
          </div>
          <Beaker className="h-8 w-8 text-primary/40 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Side */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSubmit} className="sticky top-24">
              <FormSection title="Create Case" description="Define inputs and expected results">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Function Input</Label>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder='[[1, 2], 3]'
                      className="font-mono text-sm bg-muted/30 focus:bg-background transition-colors min-h-[120px]"
                    />
                    <p className="text-[10px] text-muted-foreground italic">Must be an array: [arg1, arg2, ...]</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Expected Output</Label>
                    <Textarea
                      value={expected}
                      onChange={(e) => setExpected(e.target.value)}
                      placeholder="5"
                      className="font-mono text-sm bg-muted/30 focus:bg-background transition-colors min-h-[80px]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border bg-card">
                    <div className="space-y-0.5">
                      <Label htmlFor="hidden-mode">Hidden Mode</Label>
                      <p className="text-[10px] text-muted-foreground">Internal validation only</p>
                    </div>
                    <Switch id="hidden-mode" checked={isHidden} onCheckedChange={setIsHidden} />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full shadow-lg shadow-primary/20">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Add to Test Suite
                  </Button>
                </div>
              </FormSection>
            </form>
          </div>

          {/* Table Side */}
          <div className="lg:col-span-7 space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Active Suite</h3>
                <Badge variant="secondary">{testCases.length} Cases</Badge>
             </div>

             <div className="border rounded-2xl bg-card overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Logic (In/Out)</TableHead>
                      <TableHead className="w-20 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testCases.map((tc: any, idx) => (
                      <TableRow key={tc._id} className="group">
                        <TableCell className="text-muted-foreground font-mono text-xs">{idx + 1}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-background text-[9px] h-4">IN</Badge>
                              <code className="text-[11px] truncate max-w-[200px]">{JSON.stringify(tc.input)}</code>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[9px] h-4">OUT</Badge>
                              <code className="text-[11px] font-bold">{JSON.stringify(tc.expected)}</code>
                            </div>
                          </div>
                          {tc.isHidden && <div className="mt-2 flex items-center gap-1 text-[9px] text-amber-600 font-bold uppercase tracking-tighter"><EyeOff className="h-3 w-3" /> Secret Case</div>}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Permanently delete case?</AlertDialogTitle>
                                <AlertDialogDescription>This will immediately impact code evaluation for all users.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(tc._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                    {testCases.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="h-32 text-center text-muted-foreground text-sm italic">
                          No test cases defined for this problem yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
             </div>
          </div>
        </div>
    </div>
  );
}
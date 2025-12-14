"use client";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Send, Clock } from "lucide-react"; // Only simple icons needed here
import {
  CppWrapper,
  JavaScriptWrapper,
  JavaWrapper,
  PythonWrapper,
} from "@/lib/wrappers";
import { TestCaseI } from "@/models/testcase.model";
import { ProblemI, StarterCodeI } from "@/models/problem.model";
import { SubmissionI } from "@/models/submission.model";
import { apiClient } from "@/lib/apiClient/apiClient";
import { cn } from "@/lib/utils";
import mongoose from "mongoose";

// Import Components & Types
import {
  ExecutionStatus,
  ExecutionResult,
  TabType,
  isCriticalError,
} from "./editor/types";
import {
  EditorToolbar,
  ConsoleHeader,
  ErrorView,
  TestCaseDetail,
} from "./editor/EditorComponents";
import { SubmissionTab } from "./editor/SubmissionTab";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {  useAppSelector } from "@/lib/redux/hooks";
import { toast } from "sonner";

interface EditorPanelProps {
  problem: ProblemI;
  theme: string;
  testCases: TestCaseI[];
  userId?: string;
}

// --- Helpers ---
const languageMap: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  cpp: "cpp",
};


const wrapperMap: Record<string, (userCode: string, functionName: string, testCases: {input: unknown[];expected: unknown;}[]) => string> = {
  javascript: JavaScriptWrapper,
  python: PythonWrapper,
  java: JavaWrapper,
  cpp: CppWrapper,
};

const mapStatusToDb = (status: ExecutionStatus): SubmissionI["status"] => {
  switch (status) {
    case "ACCEPTED":
      return "accepted";
    case "WRONG_ANSWER":
      return "wrongAnswer";
    case "RUNTIME_ERROR":
      return "runtimeError";
    case "COMPILE_ERROR":
      return "compileError";
    case "TLE":
      return "tle";
    default:
      return "runtimeError";
  }
};

export function EditorPanel({
  problem,
  testCases,
  theme,
  userId,
}: EditorPanelProps) {
  const [language, setLanguage] = useState<keyof StarterCodeI>("javascript");
  const [code, setCode] = useState("");
  const [runOutput, setRunOutput] = useState<ExecutionResult | null>(null);
  const [submitOutput, setSubmitOutput] = useState<ExecutionResult | null>(
    null
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("testcase");
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  const { data: session } = useSession();
  const router = useRouter();

  const languageIS = useAppSelector(
    (state) => state.code.currentCodeLanguage
  );

  useEffect(() => {
    if (problem) {
      const savedCode = localStorage.getItem(`code-${problem._id}-${language}`);
      setCode(savedCode || problem.starterCode[language] || "");
    }
    setLanguage(languageIS as keyof StarterCodeI);
  }, [problem?._id, language, problem?.starterCode, languageIS,problem]);

  const handleRunOrSubmit = async (type: "run" | "submit") => {
    if (!problem) return;
    if (problem?.starterCode?.[language] === code) {
      toast.error(
        "You must solve the problem before running or submitting the code."
      );
      return;
    }
    
    setIsSubmitting(type === "submit");
    setIsRunning(type === "run");
    setIsConsoleOpen(true);
    setActiveTab(type === "run" ? "result" : "submission");
    if (type == "submit" && (!session || !session?.user.id)) {
      router.push("/a/login");
    }
    try {
      const wrapperFunction = wrapperMap[language];
      if (!wrapperFunction)
        throw new Error(`Language ${language} not supported yet.`);

      const testCasesToRun =
        type === "submit" ? testCases : testCases.filter((tc) => !tc.isHidden);
      const cleanTestCases = testCasesToRun.map((tc) => ({
        input: tc.input,
        expected: tc.expected,
      }));
      const fullCode = wrapperFunction(
        code,
        problem.function.name,
        cleanTestCases
      );
      const startTime = performance.now();

      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: languageMap[language],
          version: "*",
          files: [{ content: fullCode }],
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      const executionTime = Math.round(performance.now() - startTime);

      // --- Status Logic ---
      let status: ExecutionStatus = "ACCEPTED";
      let errorDetails = "";
      const parsedResults = [];
      let dbSubmissionId = "";

      if (result.compile && result.compile.code !== 0) {
        status = "COMPILE_ERROR";
        errorDetails = result.compile.stderr || result.compile.output;
      } else if (result.run && result.run.signal === "SIGKILL") {
        status = "TLE";
        errorDetails = "Time Limit Exceeded";
      } else if (result.run && result.run.code !== 0) {
        status = "RUNTIME_ERROR";
        errorDetails = result.run.stderr || result.run.output;
      } else if (result.run) {
        const lines = (result.run.stdout || "")
          .split("\n")
          .filter((l: string) => l.trim());
        for (const line of lines) {
          const match = line.match(/Test\s+(\d+):\s+(PASSED|FAILED|ERROR)/i);
          if (!match) continue;
          const testNumber = parseInt(match[1]);
          const st = match[2].toUpperCase();
          if (st === "ERROR") {
            parsedResults.push({
              testNumber,
              passed: false,
              error: line.split("ERROR")[1]?.trim(),
            });
            continue;
          }
          const outMatch = line.match(
            /Output:\s*(.+?)\s*\|\s*Expected:\s*(.+?)$/i
          );
          if (outMatch) {
            let output, expected;
            try {
              output = JSON.parse(outMatch[1]);
            } catch {
              output = outMatch[1];
            }
            try {
              expected = JSON.parse(outMatch[2]);
            } catch {
              expected = outMatch[2];
            }
            parsedResults.push({
              testNumber,
              passed: st === "PASSED",
              output,
              expected,
            });
          }
        }
        status =
          parsedResults.length > 0 && parsedResults.every((t) => t.passed)
            ? "ACCEPTED"
            : "WRONG_ANSWER";
      } else {
        status = "INTERNAL_ERROR";
        errorDetails = "No result returned.";
      }

      // --- Submission Logic ---
      if (type === "submit") {
        const lastFailed = parsedResults.find((r) => !r.passed);
        const submissionPayload: Partial<SubmissionI> = {
          problemId: problem._id as mongoose.Types.ObjectId,
          userId: new mongoose.Types.ObjectId(userId || ""),
          code,
          language,
          totalTestCases: cleanTestCases.length,
          passedTestCases: parsedResults.filter((r) => r.passed).length,
          status: mapStatusToDb(status),
          error: errorDetails,
          lastFailedTestCase: lastFailed
            ? {
                input: JSON.stringify(
                  cleanTestCases[lastFailed.testNumber - 1].input
                ),
                expectedOutput: JSON.stringify(lastFailed.expected),
                actualOutput: JSON.stringify(lastFailed.output),
                error: lastFailed.error,
              }
            : null,
        };
        const saveRes = await apiClient.createSubmission(
          submissionPayload as SubmissionI
        );
        if (saveRes.success && saveRes.data)
          dbSubmissionId = String(saveRes.data._id);
      }

      const dataToSet = {
        status,
        output: result.run?.stdout,
        error: errorDetails,
        executionTime,
        testResults: parsedResults,
        isSubmit: type === "submit",
        submissionId: dbSubmissionId,
        testCasesWithInputs: testCasesToRun,
      } as ExecutionResult;
      if (type === "submit") setSubmitOutput(dataToSet);
      else setRunOutput(dataToSet);
    } catch (error) {
      const errorDataToSet = {
        status: "INTERNAL_ERROR",
        error: error instanceof Error ? error.message : "Execution failed",
      } as ExecutionResult;
      if (type === "submit") setSubmitOutput(errorDataToSet);
      else setRunOutput(errorDataToSet);
    } finally {
      setIsRunning(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border rounded-lg overflow-hidden shadow-sm">
      {/* 1. Toolbar */}
      <EditorToolbar
        language={language}
        setLanguage={(l) => setLanguage(l as keyof StarterCodeI)}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        onRun={() => handleRunOrSubmit("run")}
        onSubmit={() => handleRunOrSubmit("submit")}
        onReset={() => {
          setCode(problem.starterCode[language]);
          // setRunOutput(null);
          // setSubmitOutput(null);
        }}
      />

      {/* 2. Monaco Editor */}
      <div className="flex-1 relative min-h-0">
        <Editor
          height="100%"
          language={language === "cpp" ? "cpp" : language}
          value={code}
          onChange={(v) => {
            setCode(v || "");
            localStorage.setItem(`code-${problem._id}-${language}`, v || "");
          }}
          theme={theme === "dark" ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>

      {/* 3. Console */}
      <div
        className={cn(
          "bg-card border-t transition-all duration-300 ease-in-out flex flex-col",
          isConsoleOpen ? "h-[280px]" : "h-[40px]"
        )}
      >
        <ConsoleHeader
          isOpen={isConsoleOpen}
          setIsOpen={setIsConsoleOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {isConsoleOpen && (
          <div className="flex-1 overflow-hidden p-4 relative">
            {/* Tab A: Test Cases */}
            {activeTab === "testcase" && (
              <div className="h-full flex flex-col">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {testCases
                    .filter((tc) => !tc.isHidden)
                    .map((tc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTestCaseId(idx)}
                        className={cn(
                          "px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
                          activeTestCaseId === idx
                            ? "bg-secondary text-foreground"
                            : "bg-muted/50 border-transparent text-muted-foreground"
                        )}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                </div>
                <div className="space-y-3 font-mono text-sm overflow-y-auto">
                  {testCases
                    .filter((tc) => !tc.isHidden)
                    [activeTestCaseId]?.input.map((val, i) => (
                      <div key={i} className="space-y-1">
                        <div className="text-xs text-muted-foreground">
                          {problem.function.params[i]} =
                        </div>
                        <div className="p-3 bg-muted/50 rounded-md border text-foreground">
                          {JSON.stringify(val)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Tab B: Run Results */}
            {activeTab === "result" && (
              <div className="h-full overflow-y-auto">
                {!runOutput || runOutput.isSubmit ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Play className="h-8 w-8 opacity-20" />
                    <p>Run your code to see results here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {isCriticalError(runOutput.status) ? (
                      <ErrorView
                        error={runOutput.error || ""}
                        title={runOutput.status}
                      />
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "text-lg font-semibold",
                              runOutput.status === "ACCEPTED"
                                ? "text-green-500"
                                : "text-red-500"
                            )}
                          >
                            {runOutput.status.replace("_", " ")}
                          </span>
                          {runOutput.executionTime && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />{" "}
                              {runOutput.executionTime}ms
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 mb-4">
                          {runOutput.testResults?.map((res, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveTestCaseId(idx)}
                              className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs border transition-colors",
                                activeTestCaseId === idx
                                  ? "bg-background border-primary"
                                  : "bg-muted/30 border-transparent"
                              )}
                            >
                              <div
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  res.passed ? "bg-green-500" : "bg-red-500"
                                )}
                              />
                              Case {res.testNumber}
                            </button>
                          ))}
                        </div>
                        <TestCaseDetail
                          output={runOutput.testResults?.[activeTestCaseId].output}
                          expected={
                            runOutput.testResults?.[activeTestCaseId].expected
                          }
                          isPassed={
                            runOutput.testResults?.[activeTestCaseId].passed as boolean
                          }
                          error={
                            runOutput.testResults?.[activeTestCaseId].error
                          }
                          inputs={runOutput.testCasesWithInputs?.[activeTestCaseId].input ?? []}
                          paramNames={problem.function.params}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab C: Submission Result (Componentized) */}
            {activeTab === "submission" && (
              <div className="h-full overflow-y-auto pr-2">
                {!submitOutput || !submitOutput.isSubmit ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Send className="h-8 w-8 opacity-20" />
                    <p>Submit your code to see submission details</p>
                  </div>
                ) : (
                  <SubmissionTab
                    output={submitOutput}
                    code={code}
                    language={language}
                    paramNames={problem.function.params}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

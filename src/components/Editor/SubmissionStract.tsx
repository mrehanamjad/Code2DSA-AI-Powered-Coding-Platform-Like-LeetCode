import React from "react";
import {
  ErrorView,
  ExpandableCodeBlock,
  TestCaseDetail,
} from "./EditorComponents";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MemoryStick,
  PenLine,
  XCircle,
} from "lucide-react";
import Note from "./Note";
import { ExecutionStatus, isCriticalError } from "./types";
import { cn } from "@/lib/utils";
import { SubmissionForProblemI } from "@/lib/apiClient/types";
import AICodeAnalysisModal from "../Ai/AICodeAnalysis";

interface TestDetailI {
  inputs: unknown[];
  output: unknown;
  expected: unknown;
  error?: string;
  isPassed: boolean;
  paramNames: string[];
}

interface SubmissionStractProps {
  status: string | ExecutionStatus;
  error: string;
  passedTestCases: number;
  totalTestCases: number;
  code: string;
  problemStatement: string;
  executionTime?: number | string;
  memoryUsed?: number;
  testDetail?: TestDetailI;
  language: string;
  submissionId?: string;
  note: string;
  setSubmissionsForSubmissionTable?: (
    value: React.SetStateAction<SubmissionForProblemI[]>
  ) => void;
}

function SubmissionStract({
  submissionId,
  status,
  error,
  passedTestCases,
  totalTestCases,
  testDetail,
  code,
  problemStatement,
  executionTime,
  memoryUsed,
  language,
  note,
  setSubmissionsForSubmissionTable,
}: SubmissionStractProps) {
  return (
    <div>
      <div className="space-y-8 pb-10">
        {/* 1. Header */}
        <div className="flex justify-between sm:items-start max-sm:flex-col gap-4">
          <div className="space-y-1 max-sm:mb-3">
            <div className="flex items-center gap-2">
              {isCriticalError(status as ExecutionStatus) ? (
                <AlertOctagon className="h-7 w-7 text-red-500" />
              ) : status === "ACCEPTED" ? (
                <CheckCircle2 className="h-7 w-7 text-green-500" />
              ) : (
                <XCircle className="h-7 w-7 text-red-500" />
              )}

              <h2
                className={cn(
                  "text-2xl font-bold tracking-tight",
                  status === "ACCEPTED" ? "text-green-500" : "text-red-500"
                )}
              >
                {status === "ACCEPTED" ? "Accepted" : status.replace("_", " ")}
              </h2>
            </div>
            <div className="text-sm text-muted-foreground font-medium pl-9">
              {passedTestCases} / {totalTestCases} test cases passed
            </div>
          </div>
          <AICodeAnalysisModal problemStatement={problemStatement} code={code} language={language} />
        </div>

        {/* 2. Big Metrics Grid (LeetCode Style) */}
        {!isCriticalError(status as ExecutionStatus) && (executionTime != null || memoryUsed != null) && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
            {executionTime != null && (
              <div className="bg-muted/40 rounded-xl p-5 border border-border/50 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Runtime</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{executionTime}</span>
                  <span className="text-base font-medium text-muted-foreground">ms</span>
                </div>
              </div>
            )}
            
            {memoryUsed != null && (
              <div className="bg-muted/40 rounded-xl p-5 border border-border/50 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MemoryStick className="w-4 h-4" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Memory</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    {(memoryUsed / 1024).toFixed(1)}
                  </span>
                  <span className="text-base font-medium text-muted-foreground">KB</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Critical Error View */}
        {isCriticalError(status as ExecutionStatus) && error && (
          <ErrorView error={error} title={status.replace("_", " ")} />
        )}

        {/* 4. Failed Test Case View */}
        {!isCriticalError(status as ExecutionStatus) &&
          status === "WRONG_ANSWER" && testDetail && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-3 text-red-500 font-semibold text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Failed Test Case</span>
              </div>
              <TestCaseDetail {...(testDetail as TestDetailI)} />
            </div>
          )}

        {/* 5. Code Block */}
        <ExpandableCodeBlock code={code} language={language} />

        {/* 6. Note Section */}
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <PenLine className="h-4 w-4" /> Notes
          </div>
          <Note
            savedNote={note || ""}
            submissionId={submissionId!}
            setSubmissions={setSubmissionsForSubmissionTable}
          />
        </div>
      </div>
    </div>
  );
}

export default SubmissionStract;
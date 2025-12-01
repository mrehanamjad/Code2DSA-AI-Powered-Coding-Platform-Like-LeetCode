import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, PenLine, CheckCircle2, XCircle, Clock, AlertTriangle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExecutionResult, isCriticalError } from "./types";
import { ErrorView, ExpandableCodeBlock, TestCaseDetail } from "./EditorComponents";
import Note from "./Note";

interface SubmissionTabProps {
  output: ExecutionResult;
  code: string;
  language: string;
  paramNames: string[];
}

export function SubmissionTab({ output, code, language, paramNames }: SubmissionTabProps) {
  const [activeCaseId, setActiveCaseId] = useState(0);

  // Auto-select the first failed case if WRONG_ANSWER
  useEffect(() => {
    if (output.status === "WRONG_ANSWER" && output.testResults) {
        const failedIdx = output.testResults.findIndex(t => !t.passed);
        if (failedIdx !== -1) setActiveCaseId(failedIdx);
    }
  }, [output.status, output.testResults]);


  const passedCount = output.testResults?.filter(t => t.passed).length || 0;
  const totalCount = output.testCasesWithInputs?.length || output.testResults?.length || 0;

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Header & Stats */}
      <div className="space-y-2">
          <div className="flex items-center gap-4">
            {isCriticalError(output.status) ? <AlertOctagon className="h-6 w-6 text-red-500" /> : 
             output.status === "ACCEPTED" ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : 
             <XCircle className="h-6 w-6 text-red-500" />}
            
            <h3 className={cn("text-xl font-bold", output.status === "ACCEPTED" ? "text-green-500" : "text-red-500")}>
                {output.status === "ACCEPTED" ? "Accepted" : output.status.replace("_", " ")}
            </h3>
            {output.executionTime && <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full flex items-center gap-1"><Clock className="h-3 w-3"/> {output.executionTime}ms</span>}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {passedCount} / {totalCount} test cases passed
          </div>
      </div>

      {/* 2. Critical Error View */}
      {isCriticalError(output.status) && output.error && (
        <ErrorView error={output.error} title={output.status.replace("_", " ")} />
      )}

      {/* 3. Failed Test Case View */}
      {!isCriticalError(output.status) && output.status === "WRONG_ANSWER" && (
         <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-3 text-red-500 font-semibold text-sm">
                <AlertTriangle className="h-4 w-4"/>
                <span>Failed Test Case</span>
            </div>
            <TestCaseDetail 
                result={output.testResults?.[activeCaseId]} 
                inputs={output.testCasesWithInputs?.[activeCaseId]} 
                paramNames={paramNames} 
            />
         </div>
      )}

      {/* 4. Code Block */}
      <ExpandableCodeBlock code={code} language={language} />

      {/* 5. Note Section */}
      <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <PenLine className="h-4 w-4" /> Notes
        </div>
        <Note savedNote={output.note || ""} submissionId={output.submissionId!} />
      </div>
    </div>
  );
}
import React from 'react'
import { ErrorView, ExpandableCodeBlock, TestCaseDetail } from './EditorComponents'
import { AlertOctagon, AlertTriangle, CheckCircle2, Clock, PenLine, XCircle } from 'lucide-react'
import Note from './Note'
import { ExecutionStatus, isCriticalError } from './types'
import { cn } from '@/lib/utils'
import { SubmissionForProblemI } from '@/lib/apiClient/types'

interface TestDetailI {
    inputs: any[];
    output: any;
    expected: any;
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
  executionTime?: number | string;
  testDetail?: TestDetailI;
  language: string;
  submissionId?: string;
  note:string;
  setSubmissionsForSubmissionTable?: (value: React.SetStateAction<SubmissionForProblemI[]>) => void;
}

function SubmissionStract({submissionId,status,error,passedTestCases,totalTestCases,testDetail,code,executionTime,language,note,setSubmissionsForSubmissionTable}:SubmissionStractProps) {
  return (
    <div>
        <div className="space-y-6 pb-10">
      {/* 1. Header & Stats */}
      <div className="space-y-2">
          <div className="flex items-center gap-4">
            {isCriticalError(status as ExecutionStatus) ? <AlertOctagon className="h-6 w-6 text-red-500" /> : 
             status === "ACCEPTED" ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : 
             <XCircle className="h-6 w-6 text-red-500" />}
            
            <h3 className={cn("text-xl font-bold", status === "ACCEPTED" ? "text-green-500" : "text-red-500")}>
                {status === "ACCEPTED" ? "Accepted" : status.replace("_", " ")}
            </h3>
            {executionTime && <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full flex items-center gap-1"><Clock className="h-3 w-3"/> {executionTime}ms</span>}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {passedTestCases} / {totalTestCases} test cases passed
          </div>
      </div>

      {/* 2. Critical Error View */}
      {isCriticalError(status as ExecutionStatus) && error && (
        <ErrorView error={error} title={status.replace("_", " ")} />
      )}

      {/* 3. Failed Test Case View */}
      {!isCriticalError(status as ExecutionStatus) && status === "WRONG_ANSWER" && (
         <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-3 text-red-500 font-semibold text-sm">
                <AlertTriangle className="h-4 w-4"/>
                <span>Failed Test Case</span>
            </div>
            <TestCaseDetail 
                // expected={output.testResults?.[activeCaseId]?.expected} 
                // output={output.testResults?.[activeCaseId]?.output} 
                // isPassed={output.testResults?.[activeCaseId]?.passed!} 
                // inputs={output.testCasesWithInputs?.[activeCaseId].input!} 
                // paramNames={paramNames}
                {...testDetail as TestDetailI} 
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
        <Note savedNote={note || ""} submissionId={submissionId!} setSubmissions={setSubmissionsForSubmissionTable} />
      </div>
    </div>
    </div>
  )
}

export default SubmissionStract
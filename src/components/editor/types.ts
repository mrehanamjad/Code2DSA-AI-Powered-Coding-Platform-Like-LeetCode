import { TestCaseI } from "@/models/testcase.model";
import { SubmissionI } from "@/models/submission.model";

export type ExecutionStatus =
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "COMPILE_ERROR"
  | "RUNTIME_ERROR"
  | "TLE"
  | "INTERNAL_ERROR";
export type TabType = "testcase" | "result" | "submission";

interface SubmissionTabProps {
  status: ExecutionStatus;
  submission: SubmissionI;
  testCases: TestCaseI[];
  passedTestCases: number;
  totalTestCases: number;
  error?: string;
  lastFailedTestCase: TestCaseI | null;
  code: string;
  language: string;
  paramNames: string[];
}

export interface ExecutionResult {
  status: ExecutionStatus;
  output?: string;
  error?: string;
  executionTime?: number;
  testResults?: Array<{
    testNumber: number;
    passed: boolean;
    output: any;
    expected: any;
    error?: string;
  }>;
  isSubmit?: boolean;
  submissionId?: string;
  note?: string;
  testCasesWithInputs?: TestCaseI[];
}

export const isCriticalError = (status?: ExecutionStatus) => {
  return ["COMPILE_ERROR", "RUNTIME_ERROR", "TLE", "INTERNAL_ERROR"].includes(
    status || ""
  );
};

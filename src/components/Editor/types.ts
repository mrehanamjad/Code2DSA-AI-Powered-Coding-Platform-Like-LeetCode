import { TestCaseI } from "@/models/testcase.model";

export type ExecutionStatus =
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "COMPILE_ERROR"
  | "RUNTIME_ERROR"
  | "TLE"
  | "INTERNAL_ERROR";
export type TabType = "testcase" | "result" | "submission";


export interface ExecutionResult {
  status: ExecutionStatus;
  output?: string;
  error?: string;
  executionTime?: number;
  memoryUsed?: number;
  testResults?: Array<{
    testNumber: number;
    passed: boolean;
    output: unknown;
    expected: unknown;
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

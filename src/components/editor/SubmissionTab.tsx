import { useState, useEffect } from "react";
import { ExecutionResult } from "./types";
import SubmissionStract from "./SubmissionStract";

interface SubmissionTabProps {
  output: ExecutionResult;
  code: string;
  language: string;
  paramNames: string[];
}

export function SubmissionTab({
  output,
  code,
  language,
  paramNames,
}: SubmissionTabProps) {
  const [activeCaseId, setActiveCaseId] = useState(0);

  // Auto-select the first failed case if WRONG_ANSWER
  useEffect(() => {
    if (output.status === "WRONG_ANSWER" && output.testResults) {
      const failedIdx = output.testResults.findIndex((t) => !t.passed);
      if (failedIdx !== -1) setActiveCaseId(failedIdx);
    }
  }, [output.status, output.testResults]);


  const testResult = output.testResults?.[activeCaseId];
  const testInput = output.testCasesWithInputs?.[activeCaseId];

  const passedTestCases =
    output.testResults?.filter((t) => t.passed).length || 0;
  const totalTestCases =
    output.testCasesWithInputs?.length || output.testResults?.length || 0;

  return (
    <SubmissionStract
      status={output.status}
      error={output.error ?? ""}
      code={code}
      executionTime={output.executionTime}
      language={language}
      passedTestCases={passedTestCases}
      totalTestCases={totalTestCases}
      testDetail={{
        inputs: testInput?.input ?? [],
        output: testResult?.output ?? "",
        expected: testResult?.expected ?? "",
        error: testResult?.error ?? "",
        isPassed: testResult?.passed ?? false,
        paramNames,
      }}
      note={output.note as string}
    />
  );
}

"use client";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Play, RotateCcw, Send, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  CppWrapper,
  JavaScriptWrapper,
  JavaWrapper,
  PythonWrapper,
} from "@/lib/wrappers";
import { TestCaseI } from "@/models/testcase.model";
import { ProblemI, StarterCodeI } from "@/models/problem.model";

interface EditorPanelProps {
  problem: ProblemI;
  theme: string;
  testCases: TestCaseI[];
}

interface ExecutionResult {
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
}

const languageMap: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  cpp: "cpp",
};

const wrapperMap: Record<string, Function> = {
  javascript: JavaScriptWrapper,
  python: PythonWrapper,
  java: JavaWrapper,
  cpp: CppWrapper,
};

type CleanTestCase = {
  input: any[];
  expected: any;
};

function convertTestCases(raw: TestCaseI[]): CleanTestCase[] {
  return raw.map((tc) => ({
    input: tc.input,
    expected: tc.expected,
  }));
}

function compareValues(output: any, expected: any): boolean {
  // Handle null/undefined
  if (output === null || output === undefined) {
    return output === expected;
  }

  // Handle arrays
  if (Array.isArray(expected)) {
    if (!Array.isArray(output)) return false;
    if (output.length !== expected.length) return false;
    return output.every((val, idx) => compareValues(val, expected[idx]));
  }

  // Handle objects
  if (typeof expected === "object" && expected !== null) {
    if (typeof output !== "object" || output === null) return false;
    const expectedKeys = Object.keys(expected);
    const outputKeys = Object.keys(output);
    if (expectedKeys.length !== outputKeys.length) return false;
    return expectedKeys.every((key) =>
      compareValues(output[key], expected[key])
    );
  }

  // Handle primitives with type coercion
  return String(output).trim() === String(expected).trim();
}

function parseTestResults(
  stdout: string,
  testCases: CleanTestCase[]
): Array<{
  testNumber: number;
  passed: boolean;
  output: any;
  expected: any;
  error?: string;
}> {
  console.log("parseTestResult Starts====================\n stdout:", stdout);
  const lines = stdout.split("\n").filter((line) => line.trim());
  const results = [];

  console.log("stdout array", lines);

  for (const line of lines) {
    // Parse format: "Test X: PASSED/FAILED | Output: Y | Expected: Z"
    const testMatch = line.match(/Test\s+(\d+):\s+(PASSED|FAILED|ERROR)/i);
    // 👆 Try to match patterns like: "Test 3: PASSED" (ignores anything after it)
    // The regex breakdown:
    // - Test          → literal word "Test"
    // - \s+           → one or more spaces
    // - (\d+)         → capture the test number (digits)
    // - :             → literal colon
    // - \s+           → one or more spaces
    // - (PASSED|FAILED|ERROR) → capture the status word
    // - /i            → case-insensitive match

    if (!testMatch) continue;

    console.log("test match", testMatch);

    const testNumber = parseInt(testMatch[1]);
    const status = testMatch[2].toUpperCase();

    if (status === "ERROR") {
      const errorMsg =
        line
          .split("ERROR")[1]
          ?.replace(/^\s*\|\s*/, "")
          .trim() || "Unknown error";
      results.push({
        testNumber,
        passed: false,
        output: null,
        expected: testCases[testNumber - 1]?.expected || null,
        error: errorMsg,
      });
      continue;
    }

    // Parse output and expected values
    const outputMatch = line.match(
      /Output:\s*(.+?)\s*\|\s*Expected:\s*(.+?)$/i
    );

    if (outputMatch) {
      console.log("outputMatch:",outputMatch)
      const outputStr = outputMatch[1].trim();
      const expectedStr = outputMatch[2].trim();

      let output, expected;

      try {
        output = JSON.parse(outputStr);
      } catch {
        output = outputStr;
      }

      try {
        expected = JSON.parse(expectedStr);
      } catch {
        expected = expectedStr;
      }
console.log("result obj:",{
        testNumber,
        passed: status === "PASSED",
        output,
        expected,
      })

      results.push({
        testNumber,
        passed: status === "PASSED",
        output,
        expected,
      });
    }
  }

  return results;
}

export function EditorPanel({ problem, testCases, theme }: EditorPanelProps) {
  const [language, setLanguage] = useState<keyof StarterCodeI>("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (problem) {
      const savedCode = localStorage.getItem(`code-${problem.id}-${language}`);
      if (savedCode) {
        setCode(savedCode);
      } else {
        setCode(problem.starterCode[language] || "");
      }
    }
  }, [problem?.id, language, problem?.starterCode]);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      if (problem?.id) {
        localStorage.setItem(`code-${problem.id}-${language}`, value);
      }
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as keyof StarterCodeI);
  };

  const handleReset = () => {
    if (problem) {
      setCode(problem.starterCode[language] || "");
      localStorage.removeItem(`code-${problem.id}-${language}`);
      setOutput(null);
      toast({
        title: "Code Reset",
        description: "Code has been reset to starter template.",
      });
    }
  };

  const handleRun = async (type: "run" | "submit") => {
    if (!problem) {
      toast({
        title: "Error",
        description: "No problem loaded.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setOutput(null);

    try {
      const wrapperFunction = wrapperMap[language];

      if (!wrapperFunction) {
        throw new Error(`No wrapper found for language: ${language}`);
      }

      const testCasesToRun =
        type === "submit"
          ? testCases
          : testCases.filter((testcase) => !testcase.isHidden);

      if (testCasesToRun.length === 0) {
        throw new Error("No test cases available to run.");
      }

      const cleanTestCases = convertTestCases(testCasesToRun);
      const fullCode = wrapperFunction(
        code,
        problem.function.name,
        cleanTestCases
      );

      console.log("Executing code for language:", language);
      console.log("full code to be excicuted: ", fullCode);

      const startTime = performance.now();
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: languageMap[language],
          version: "*",
          files: [
            {
              content: fullCode,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const endTime = performance.now();
      const executionTime = Math.round(endTime - startTime);

      if (result.run) {
        const stdout = result.run.stdout || result.run.output || "";
        const stderr = result.run.stderr || "";

        let testResults;
        if (!stderr && stdout) {
          testResults = parseTestResults(stdout, cleanTestCases);
        }

        setOutput({
          output: stdout,
          error: stderr,
          executionTime,
          testResults,
        });

        if (stderr) {
          toast({
            title: "Execution Error",
            description: "Check the output panel for details.",
            variant: "destructive",
          });
        } else {
          const allPassed = testResults?.every((t) => t.passed) ?? false;
          const passedCount = testResults?.filter((t) => t.passed).length ?? 0;
          const totalCount = testResults?.length ?? 0;

          toast({
            title: allPassed ? "All Tests Passed! ✓" : "Tests Completed",
            description: `${passedCount}/${totalCount} tests passed in ${executionTime}ms`,
            variant: allPassed ? "default" : "destructive",
          });
        }
      } else {
        throw new Error("No execution result returned from server.");
      }
    } catch (error) {
      console.error("Execution error:", error);
      setOutput({
        error:
          error instanceof Error
            ? error.message
            : "Failed to execute code. Please try again.",
      });
      toast({
        title: "Execution Failed",
        description:
          error instanceof Error
            ? error.message
            : "Could not connect to execution service.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    await handleRun("submit");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-border gap-2">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2"
            disabled={isRunning}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRun("run")}
            disabled={isRunning}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            {isRunning ? "Running..." : "Run"}
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            className="gap-2"
            disabled={isRunning}
          >
            <Send className="h-4 w-4" />
            Submit
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language === "cpp" ? "cpp" : language}
          value={code}
          onChange={handleCodeChange}
          theme={theme === "dark" ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
          }}
        />
      </div>

      {output && (
        <Card className="m-3 p-3 bg-card max-h-[300px] overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">Output</h3>
            {output.executionTime && (
              <span className="text-xs text-muted-foreground">
                {output.executionTime}ms
              </span>
            )}
          </div>

          {output.error ? (
            <pre className="text-xs whitespace-pre-wrap font-mono text-red-500">
              {output.error}
            </pre>
          ) : output.testResults ? (
            <div className="space-y-2">
              {output.testResults.map((result) => (
                <div
                  key={result.testNumber}
                  className={`p-2 rounded border ${
                    result.passed
                      ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                      : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                    <span className="text-xs font-semibold">
                      Test {result.testNumber}
                    </span>
                  </div>
                  {result.error ? (
                    <pre className="text-xs text-red-600 dark:text-red-400">
                      {result.error}
                    </pre>
                  ) : (
                    <div className="text-xs space-y-1">
                      <div>
                        <span className="font-medium">Output: </span>
                        <span className="font-mono">
                          {JSON.stringify(result.output)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Expected: </span>
                        <span className="font-mono">
                          {JSON.stringify(result.expected)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <pre className="text-xs whitespace-pre-wrap font-mono text-foreground">
              {output.output}
            </pre>
          )}
        </Card>
      )}
    </div>
  );
}

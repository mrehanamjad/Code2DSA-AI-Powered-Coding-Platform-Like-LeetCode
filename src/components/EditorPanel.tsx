// "use client";
// import { useState, useEffect } from "react";
// import Editor from "@monaco-editor/react";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card } from "@/components/ui/card";
// import { Play, RotateCcw, Send, CheckCircle, XCircle } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import {
//   CppWrapper,
//   JavaScriptWrapper,
//   JavaWrapper,
//   PythonWrapper,
// } from "@/lib/wrappers";
// import { TestCaseI } from "@/models/testcase.model";
// import { ProblemI, StarterCodeI } from "@/models/problem.model";

// interface EditorPanelProps {
//   problem: ProblemI;
//   theme: string;
//   testCases: TestCaseI[];
// }

// interface ExecutionResult {
//   output?: string;
//   error?: string;
//   executionTime?: number;
//   testResults?: Array<{
//     testNumber: number;
//     passed: boolean;
//     output: any;
//     expected: any;
//     error?: string;
//   }>;
//   isSubmit?: boolean;
//   testCasesWithInputs?: TestCaseI[];
// }

// const languageMap: Record<string, string> = {
//   javascript: "javascript",
//   typescript: "typescript",
//   python: "python",
//   java: "java",
//   cpp: "cpp",
// };

// const wrapperMap: Record<string, Function> = {
//   javascript: JavaScriptWrapper,
//   python: PythonWrapper,
//   java: JavaWrapper,
//   cpp: CppWrapper,
// };

// type CleanTestCase = {
//   input: any[];
//   expected: any;
// };

// function convertTestCases(raw: TestCaseI[]): CleanTestCase[] {
//   return raw.map((tc) => ({
//     input: tc.input,
//     expected: tc.expected,
//   }));
// }

// function compareValues(output: any, expected: any): boolean {
//   // Handle null/undefined
//   if (output === null || output === undefined) {
//     return output === expected;
//   }

//   // Handle arrays
//   if (Array.isArray(expected)) {
//     if (!Array.isArray(output)) return false;
//     if (output.length !== expected.length) return false;
//     return output.every((val, idx) => compareValues(val, expected[idx]));
//   }

//   // Handle objects
//   if (typeof expected === 'object' && expected !== null) {
//     if (typeof output !== 'object' || output === null) return false;
//     const expectedKeys = Object.keys(expected);
//     const outputKeys = Object.keys(output);
//     if (expectedKeys.length !== outputKeys.length) return false;
//     return expectedKeys.every(key => compareValues(output[key], expected[key]));
//   }

//   // Handle primitives with type coercion
//   return String(output).trim() === String(expected).trim();
// }

// function parseTestResults(stdout: string, testCases: CleanTestCase[]): Array<{
//   testNumber: number;
//   passed: boolean;
//   output: any;
//   expected: any;
//   error?: string;
// }> {
//   const lines = stdout.split('\n').filter(line => line.trim());
//   const results = [];

//   for (const line of lines) {
//     // Parse format: "Test X: PASSED/FAILED | Output: Y | Expected: Z"
//     const testMatch = line.match(/Test\s+(\d+):\s+(PASSED|FAILED|ERROR)/i);

//     if (!testMatch) continue;

//     const testNumber = parseInt(testMatch[1]);
//     const status = testMatch[2].toUpperCase();

//     if (status === "ERROR") {
//       const errorMsg = line.split('ERROR')[1]?.replace(/^\s*\|\s*/, '').trim() || "Unknown error";
//       results.push({
//         testNumber,
//         passed: false,
//         output: null,
//         expected: testCases[testNumber - 1]?.expected || null,
//         error: errorMsg,
//       });
//       continue;
//     }

//     // Parse output and expected values
//     const outputMatch = line.match(/Output:\s*(.+?)\s*\|\s*Expected:\s*(.+?)$/i);

//     if (outputMatch) {
//       const outputStr = outputMatch[1].trim();
//       const expectedStr = outputMatch[2].trim();

//       let output, expected;

//       try {
//         output = JSON.parse(outputStr);
//       } catch {
//         output = outputStr;
//       }

//       try {
//         expected = JSON.parse(expectedStr);
//       } catch {
//         expected = expectedStr;
//       }

//       results.push({
//         testNumber,
//         passed: status === "PASSED",
//         output,
//         expected,
//       });
//     }
//   }

//   return results;
// }

// export function EditorPanel({ problem, testCases, theme }: EditorPanelProps) {
//   const [language, setLanguage] = useState<keyof StarterCodeI>("javascript");
//   const [code, setCode] = useState("");
//   const [output, setOutput] = useState<ExecutionResult | null>(null);
//   const [isRunning, setIsRunning] = useState(false);
//   const { toast } = useToast();

//   useEffect(() => {
//     if (problem) {
//       const savedCode = localStorage.getItem(`code-${problem.id}-${language}`);
//       if (savedCode) {
//         setCode(savedCode);
//       } else {
//         setCode(problem.starterCode[language] || "");
//       }
//     }
//   }, [problem?.id, language, problem?.starterCode]);

//   const handleCodeChange = (value: string | undefined) => {
//     if (value !== undefined) {
//       setCode(value);
//       if (problem?.id) {
//         localStorage.setItem(`code-${problem.id}-${language}`, value);
//       }
//     }
//   };

//   const handleLanguageChange = (newLanguage: string) => {
//     setLanguage(newLanguage as keyof StarterCodeI);
//   };

//   const handleReset = () => {
//     if (problem) {
//       setCode(problem.starterCode[language] || "");
//       localStorage.removeItem(`code-${problem.id}-${language}`);
//       setOutput(null);
//       toast({
//         title: "Code Reset",
//         description: "Code has been reset to starter template.",
//       });
//     }
//   };

//   const handleRun = async (type: "run" | "submit") => {
//     if (!problem) {
//       toast({
//         title: "Error",
//         description: "No problem loaded.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsRunning(true);
//     setOutput(null);

//     try {
//       const wrapperFunction = wrapperMap[language];

//       if (!wrapperFunction) {
//         throw new Error(`No wrapper found for language: ${language}`);
//       }

//       const testCasesToRun = type === "submit"
//         ? testCases
//         : testCases.filter((testcase) => !testcase.isHidden);

//       if (testCasesToRun.length === 0) {
//         throw new Error("No test cases available to run.");
//       }

//       const cleanTestCases = convertTestCases(testCasesToRun);
//       const fullCode = wrapperFunction(
//         code,
//         problem.function.name,
//         cleanTestCases
//       );

//       console.log("Executing code for language:", language);

//       const startTime = performance.now();
//       const response = await fetch("https://emkc.org/api/v2/piston/execute", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           language: languageMap[language],
//           version: "*",
//           files: [
//             {
//               content: fullCode,
//             },
//           ],
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       const endTime = performance.now();
//       const executionTime = Math.round(endTime - startTime);

//       if (result.run) {
//         const stdout = result.run.stdout || result.run.output || "";
//         const stderr = result.run.stderr || "";

//         let testResults: any[] | undefined = undefined;
//         if (!stderr && stdout) {
//           testResults = parseTestResults(stdout, cleanTestCases);
//         }

//         setOutput({
//           output: stdout,
//           error: stderr,
//           executionTime,
//           testResults,
//           isSubmit: type === "submit",
//           testCasesWithInputs: testCasesToRun,
//         });

//         if (stderr) {
//           toast({
//             title: "Execution Error",
//             description: "Check the output panel for details.",
//             variant: "destructive",
//           });
//         } else {
//           const allPassed = testResults?.every(t => t.passed) ?? false;
//           const passedCount = testResults?.filter(t => t.passed).length ?? 0;
//           const totalCount = testResults?.length ?? 0;

//           if (type === "submit") {
//             if (allPassed) {
//               toast({
//                 title: "Accepted! 🎉",
//                 description: `All ${totalCount} test cases passed in ${executionTime}ms`,
//               });
//             } else {
//               toast({
//                 title: "Wrong Answer",
//                 description: `${passedCount}/${totalCount} test cases passed`,
//                 variant: "destructive",
//               });
//             }
//           } else {
//             toast({
//               title: allPassed ? "All Tests Passed! ✓" : "Tests Completed",
//               description: `${passedCount}/${totalCount} tests passed in ${executionTime}ms`,
//               variant: allPassed ? "default" : "destructive",
//             });
//           }
//         }
//       } else {
//         throw new Error("No execution result returned from server.");
//       }
//     } catch (error) {
//       console.error("Execution error:", error);
//       setOutput({
//         error: error instanceof Error ? error.message : "Failed to execute code. Please try again.",
//       });
//       toast({
//         title: "Execution Failed",
//         description: error instanceof Error ? error.message : "Could not connect to execution service.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   const handleSubmit = async () => {
//     await handleRun("submit");
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex items-center justify-between p-3 border-b border-border gap-2">
//         <Select value={language} onValueChange={handleLanguageChange}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Select language" />
//           </SelectTrigger>
//           <SelectContent className="bg-popover">
//             <SelectItem value="javascript">JavaScript</SelectItem>
//             <SelectItem value="python">Python</SelectItem>
//             <SelectItem value="java">Java</SelectItem>
//             <SelectItem value="cpp">C++</SelectItem>
//           </SelectContent>
//         </Select>

//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleReset}
//             className="gap-2"
//             disabled={isRunning}
//           >
//             <RotateCcw className="h-4 w-4" />
//             Reset
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleRun('run')}
//             disabled={isRunning}
//             className="gap-2"
//           >
//             <Play className="h-4 w-4" />
//             {isRunning ? "Running..." : "Run"}
//           </Button>
//           <Button
//             size="sm"
//             onClick={handleSubmit}
//             className="gap-2"
//             disabled={isRunning}
//           >
//             <Send className="h-4 w-4" />
//             Submit
//           </Button>
//         </div>
//       </div>

//       <div className="flex-1 min-h-0">
//         <Editor
//           height="100%"
//           language={language === "cpp" ? "cpp" : language}
//           value={code}
//           onChange={handleCodeChange}
//           theme={theme === "dark" ? "vs-dark" : "light"}
//           options={{
//             minimap: { enabled: false },
//             fontSize: 14,
//             lineNumbers: "on",
//             scrollBeyondLastLine: false,
//             automaticLayout: true,
//             tabSize: 2,
//             wordWrap: "on",
//           }}
//         />
//       </div>

//       {output && (
//         <Card className="m-3 p-3 bg-card max-h-[300px] overflow-y-auto">
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="text-sm font-semibold text-foreground">
//               {output.isSubmit ? "Submission Result" : "Test Results"}
//             </h3>
//             {output.executionTime && (
//               <span className="text-xs text-muted-foreground">
//                 {output.executionTime}ms
//               </span>
//             )}
//           </div>

//           {output.error ? (
//             <pre className="text-xs whitespace-pre-wrap font-mono text-red-500">
//               {output.error}
//             </pre>
//           ) : output.testResults ? (
//             <div className="space-y-2">
//               {output.isSubmit ? (
//                 // Submit mode: Show summary and only FIRST failed test
//                 <>
//                   <div className={`p-3 rounded-lg ${
//                     output.testResults.every(t => t.passed)
//                       ? "bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800"
//                       : "bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800"
//                   }`}>
//                     <div className="flex items-center gap-2 mb-1">
//                       {output.testResults.every(t => t.passed) ? (
//                         <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
//                       ) : (
//                         <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
//                       )}
//                       <span className="font-semibold">
//                         {output.testResults.every(t => t.passed)
//                           ? "Accepted"
//                           : "Wrong Answer"}
//                       </span>
//                     </div>
//                     <div className="text-sm">
//                       {output.testResults.filter(t => t.passed).length}/{output.testResults.length} test cases passed
//                     </div>
//                   </div>

//                   {/* Show only FIRST failed test case with inputs */}
//                   {(() => {
//                     const firstFailed = output.testResults.find(t => !t.passed);
//                     if (!firstFailed) return null;

//                     const testCase = output.testCasesWithInputs?.[firstFailed.testNumber - 1];
//                     return (
//                       <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800">
//                         <div className="flex items-center gap-2 mb-2">
//                           <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
//                           <span className="text-sm font-semibold">
//                             Test Case {firstFailed.testNumber}
//                           </span>
//                         </div>
//                         {firstFailed.error ? (
//                           <pre className="text-xs text-red-600 dark:text-red-400 mb-2">
//                             {firstFailed.error}
//                           </pre>
//                         ) : (
//                           <div className="text-xs space-y-2">
//                             {testCase && (
//                               <div className="p-2 bg-background/50 rounded">
//                                 <div className="font-medium mb-1 text-muted-foreground">Input:</div>
//                                 {testCase.input.map((inp, idx) => (
//                                   <div key={idx} className="font-mono text-foreground">
//                                     <span className="text-blue-600 dark:text-blue-400">
//                                       {problem?.function?.params?.[idx] || `arg${idx}`}
//                                     </span>
//                                     {' = '}
//                                     <span>{JSON.stringify(inp)}</span>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                             <div>
//                               <span className="font-medium text-muted-foreground">Your Output: </span>
//                               <span className="font-mono text-red-600 dark:text-red-400">
//                                 {JSON.stringify(firstFailed.output)}
//                               </span>
//                             </div>
//                             <div>
//                               <span className="font-medium text-muted-foreground">Expected: </span>
//                               <span className="font-mono text-green-600 dark:text-green-400">
//                                 {JSON.stringify(firstFailed.expected)}
//                               </span>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })()}
//                 </>
//               ) : (
//                 // Run mode: Show all test cases with inputs
//                 output.testResults.map((result) => {
//                   const testCase = output.testCasesWithInputs?.[result.testNumber - 1];
//                   return (
//                     <div
//                       key={result.testNumber}
//                       className={`p-3 rounded-lg border ${
//                         result.passed
//                           ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
//                           : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
//                       }`}
//                     >
//                       <div className="flex items-center gap-2 mb-2">
//                         {result.passed ? (
//                           <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
//                         ) : (
//                           <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
//                         )}
//                         <span className="text-sm font-semibold">
//                           Test Case {result.testNumber}
//                         </span>
//                       </div>
//                       {result.error ? (
//                         <pre className="text-xs text-red-600 dark:text-red-400">
//                           {result.error}
//                         </pre>
//                       ) : (
//                         <div className="text-xs space-y-2">
//                           {testCase && (
//                             <div className="p-2 bg-background/50 rounded">
//                               <div className="font-medium mb-1 text-muted-foreground">Input:</div>
//                               {testCase.input.map((inp, idx) => (
//                                 <div key={idx} className="font-mono text-foreground">
//                                   <span className="text-blue-600 dark:text-blue-400">
//                                     {problem?.function?.params?.[idx] || `arg${idx}`}
//                                   </span>
//                                   {' = '}
//                                   <span>{JSON.stringify(inp)}</span>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                           <div>
//                             <span className="font-medium text-muted-foreground">Output: </span>
//                             <span className={`font-mono ${
//                               result.passed
//                                 ? "text-green-600 dark:text-green-400"
//                                 : "text-red-600 dark:text-red-400"
//                             }`}>
//                               {JSON.stringify(result.output)}
//                             </span>
//                           </div>
//                           <div>
//                             <span className="font-medium text-muted-foreground">Expected: </span>
//                             <span className="font-mono text-green-600 dark:text-green-400">
//                               {JSON.stringify(result.expected)}
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           ) : (
//             <pre className="text-xs whitespace-pre-wrap font-mono text-foreground">
//               {output.output}
//             </pre>
//           )}
//         </Card>
//       )}
//     </div>
//   );
// }

// with better error handling
// "use client";
// import { useState, useEffect } from "react";
// import Editor from "@monaco-editor/react";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card } from "@/components/ui/card";
// import { Play, RotateCcw, Send, CheckCircle, XCircle } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import {
//   CppWrapper,
//   JavaScriptWrapper,
//   JavaWrapper,
//   PythonWrapper,
// } from "@/lib/wrappers";
// import { TestCaseI } from "@/models/testcase.model";
// import { ProblemI, StarterCodeI } from "@/models/problem.model";

// interface EditorPanelProps {
//   problem: ProblemI;
//   theme: string;
//   testCases: TestCaseI[];
// }

// interface ExecutionResult {
//   output?: string;
//   error?: string;
//   executionTime?: number;
//   testResults?: Array<{
//     testNumber: number;
//     passed: boolean;
//     output: any;
//     expected: any;
//     error?: string;
//   }>;
//   isSubmit?: boolean;
//   testCasesWithInputs?: TestCaseI[];
//   errorType?: "compileError" | "runtimeError" | "tle" | "executionError";
// }

// const languageMap: Record<string, string> = {
//   javascript: "javascript",
//   typescript: "typescript",
//   python: "python",
//   java: "java",
//   cpp: "cpp",
// };

// const wrapperMap: Record<string, Function> = {
//   javascript: JavaScriptWrapper,
//   python: PythonWrapper,
//   java: JavaWrapper,
//   cpp: CppWrapper,
// };

// type CleanTestCase = {
//   input: any[];
//   expected: any;
// };

// function convertTestCases(raw: TestCaseI[]): CleanTestCase[] {
//   return raw.map((tc) => ({
//     input: tc.input,
//     expected: tc.expected,
//   }));
// }

// function compareValues(output: any, expected: any): boolean {
//   // Handle null/undefined
//   if (output === null || output === undefined) {
//     return output === expected;
//   }

//   // Handle arrays
//   if (Array.isArray(expected)) {
//     if (!Array.isArray(output)) return false;
//     if (output.length !== expected.length) return false;
//     return output.every((val, idx) => compareValues(val, expected[idx]));
//   }

//   // Handle objects
//   if (typeof expected === 'object' && expected !== null) {
//     if (typeof output !== 'object' || output === null) return false;
//     const expectedKeys = Object.keys(expected);
//     const outputKeys = Object.keys(output);
//     if (expectedKeys.length !== outputKeys.length) return false;
//     return expectedKeys.every(key => compareValues(output[key], expected[key]));
//   }

//   // Handle primitives with type coercion
//   return String(output).trim() === String(expected).trim();
// }

// function parseTestResults(stdout: string, testCases: CleanTestCase[]): Array<{
//   testNumber: number;
//   passed: boolean;
//   output: any;
//   expected: any;
//   error?: string;
// }> {
//   const lines = stdout.split('\n').filter(line => line.trim());
//   const results = [];

//   for (const line of lines) {
//     // Parse format: "Test X: PASSED/FAILED | Output: Y | Expected: Z"
//     const testMatch = line.match(/Test\s+(\d+):\s+(PASSED|FAILED|ERROR)/i);

//     if (!testMatch) continue;

//     const testNumber = parseInt(testMatch[1]);
//     const status = testMatch[2].toUpperCase();

//     if (status === "ERROR") {
//       const errorMsg = line.split('ERROR')[1]?.replace(/^\s*\|\s*/, '').trim() || "Unknown error";
//       results.push({
//         testNumber,
//         passed: false,
//         output: null,
//         expected: testCases[testNumber - 1]?.expected || null,
//         error: errorMsg,
//       });
//       continue;
//     }

//     // Parse output and expected values
//     const outputMatch = line.match(/Output:\s*(.+?)\s*\|\s*Expected:\s*(.+?)$/i);

//     if (outputMatch) {
//       const outputStr = outputMatch[1].trim();
//       const expectedStr = outputMatch[2].trim();

//       let output, expected;

//       try {
//         output = JSON.parse(outputStr);
//       } catch {
//         output = outputStr;
//       }

//       try {
//         expected = JSON.parse(expectedStr);
//       } catch {
//         expected = expectedStr;
//       }

//       results.push({
//         testNumber,
//         passed: status === "PASSED",
//         output,
//         expected,
//       });
//     }
//   }

//   return results;
// }

// export function EditorPanel({ problem, testCases, theme }: EditorPanelProps) {
//   const [language, setLanguage] = useState<keyof StarterCodeI>("javascript");
//   const [code, setCode] = useState("");
//   const [output, setOutput] = useState<ExecutionResult | null>(null);
//   const [isRunning, setIsRunning] = useState(false);
//   const { toast } = useToast();

//   useEffect(() => {
//     if (problem) {
//       const savedCode = localStorage.getItem(`code-${problem.id}-${language}`);
//       if (savedCode) {
//         setCode(savedCode);
//       } else {
//         setCode(problem.starterCode[language] || "");
//       }
//     }
//   }, [problem?.id, language, problem?.starterCode]);

//   const handleCodeChange = (value: string | undefined) => {
//     if (value !== undefined) {
//       setCode(value);
//       if (problem?.id) {
//         localStorage.setItem(`code-${problem.id}-${language}`, value);
//       }
//     }
//   };

//   const handleLanguageChange = (newLanguage: string) => {
//     setLanguage(newLanguage as keyof StarterCodeI);
//   };

//   const handleReset = () => {
//     if (problem) {
//       setCode(problem.starterCode[language] || "");
//       localStorage.removeItem(`code-${problem.id}-${language}`);
//       setOutput(null);
//       toast({
//         title: "Code Reset",
//         description: "Code has been reset to starter template.",
//       });
//     }
//   };

//   const handleRun = async (type: "run" | "submit") => {
//     if (!problem) {
//       toast({
//         title: "Error",
//         description: "No problem loaded.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsRunning(true);
//     setOutput(null);

//     try {
//       const wrapperFunction = wrapperMap[language];

//       if (!wrapperFunction) {
//         throw new Error(`No wrapper found for language: ${language}`);
//       }

//       const testCasesToRun = type === "submit"
//         ? testCases
//         : testCases.filter((testcase) => !testcase.isHidden);

//       if (testCasesToRun.length === 0) {
//         throw new Error("No test cases available to run.");
//       }

//       const cleanTestCases = convertTestCases(testCasesToRun);
//       const fullCode = wrapperFunction(
//         code,
//         problem.function.name,
//         cleanTestCases
//       );

//       console.log("Executing code for language:", language);

//       const startTime = performance.now();
//       const response = await fetch("https://emkc.org/api/v2/piston/execute", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           language: languageMap[language],
//           version: "*",
//           files: [
//             {
//               content: fullCode,
//             },
//           ],
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       const endTime = performance.now();
//       const executionTime = Math.round(endTime - startTime);

//       if (result.run) {
//         const stdout = result.run.stdout || result.run.output || "";
//         const stderr = result.run.stderr || "";
//         const signal = result.run.signal;

//         // Determine error type
//         let errorType: "compileError" | "runtimeError" | "tle" | "executionError" | undefined;

//         if (stderr) {
//           // Check for compilation errors
//           if (
//             stderr.includes("error:") ||
//             stderr.includes("SyntaxError") ||
//             stderr.includes("compilation terminated") ||
//             stderr.includes("cannot find symbol") ||
//             stderr.includes("expected") ||
//             stderr.match(/\d+ error/)
//           ) {
//             errorType = "compileError";
//           }
//           // Check for runtime errors
//           else if (
//             stderr.includes("Exception") ||
//             stderr.includes("Error") ||
//             stderr.includes("Traceback") ||
//             stderr.includes("Segmentation fault") ||
//             stderr.includes("core dumped")
//           ) {
//             errorType = "runtimeError";
//           } else {
//             errorType = "executionError";
//           }
//         }

//         // Check for TLE (Time Limit Exceeded) - if execution took too long
//         if (signal === "SIGTERM" || signal === "SIGKILL" || executionTime > 10000) {
//           errorType = "tle";
//         }

//         let testResults: any[] | undefined = undefined;
//         if (!stderr && stdout) {
//           testResults = parseTestResults(stdout, cleanTestCases);
//         }

//         setOutput({
//           output: stdout,
//           error: stderr,
//           executionTime,
//           testResults,
//           isSubmit: type === "submit",
//           testCasesWithInputs: testCasesToRun,
//           errorType,
//         });

//         if (stderr) {
//           const errorTitle =
//             errorType === "compileError" ? "Compile Error" :
//             errorType === "runtimeError" ? "Runtime Error" :
//             errorType === "tle" ? "Time Limit Exceeded" :
//             "Execution Error";

//           toast({
//             title: errorTitle,
//             description: "Check the output panel for details.",
//             variant: "destructive",
//           });
//         } else {
//           const allPassed = testResults?.every(t => t.passed) ?? false;
//           const passedCount = testResults?.filter(t => t.passed).length ?? 0;
//           const totalCount = testResults?.length ?? 0;

//           if (type === "submit") {
//             if (allPassed) {
//               toast({
//                 title: "Accepted! 🎉",
//                 description: `All ${totalCount} test cases passed in ${executionTime}ms`,
//               });
//             } else {
//               toast({
//                 title: "Wrong Answer",
//                 description: `${passedCount}/${totalCount} test cases passed`,
//                 variant: "destructive",
//               });
//             }
//           } else {
//             toast({
//               title: allPassed ? "All Tests Passed! ✓" : "Tests Completed",
//               description: `${passedCount}/${totalCount} tests passed in ${executionTime}ms`,
//               variant: allPassed ? "default" : "destructive",
//             });
//           }
//         }
//       } else {
//         throw new Error("No execution result returned from server.");
//       }
//     } catch (error) {
//       console.error("Execution error:", error);
//       setOutput({
//         error: error instanceof Error ? error.message : "Failed to execute code. Please try again.",
//       });
//       toast({
//         title: "Execution Failed",
//         description: error instanceof Error ? error.message : "Could not connect to execution service.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   const handleSubmit = async () => {
//     await handleRun("submit");
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex items-center justify-between p-3 border-b border-border gap-2">
//         <Select value={language} onValueChange={handleLanguageChange}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Select language" />
//           </SelectTrigger>
//           <SelectContent className="bg-popover">
//             <SelectItem value="javascript">JavaScript</SelectItem>
//             <SelectItem value="python">Python</SelectItem>
//             <SelectItem value="java">Java</SelectItem>
//             <SelectItem value="cpp">C++</SelectItem>
//           </SelectContent>
//         </Select>

//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleReset}
//             className="gap-2"
//             disabled={isRunning}
//           >
//             <RotateCcw className="h-4 w-4" />
//             Reset
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleRun('run')}
//             disabled={isRunning}
//             className="gap-2"
//           >
//             <Play className="h-4 w-4" />
//             {isRunning ? "Running..." : "Run"}
//           </Button>
//           <Button
//             size="sm"
//             onClick={handleSubmit}
//             className="gap-2"
//             disabled={isRunning}
//           >
//             <Send className="h-4 w-4" />
//             Submit
//           </Button>
//         </div>
//       </div>

//       <div className="flex-1 min-h-0">
//         <Editor
//           height="100%"
//           language={language === "cpp" ? "cpp" : language}
//           value={code}
//           onChange={handleCodeChange}
//           theme={theme === "dark" ? "vs-dark" : "light"}
//           options={{
//             minimap: { enabled: false },
//             fontSize: 14,
//             lineNumbers: "on",
//             scrollBeyondLastLine: false,
//             automaticLayout: true,
//             tabSize: 2,
//             wordWrap: "on",
//           }}
//         />
//       </div>

//       {output && (
//         <Card className="m-3 p-3 bg-card max-h-[300px] overflow-y-auto">
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="text-sm font-semibold text-foreground">
//               {output.isSubmit ? "Submission Result" : "Test Results"}
//             </h3>
//             {output.executionTime && (
//               <span className="text-xs text-muted-foreground">
//                 {output.executionTime}ms
//               </span>
//             )}
//           </div>

//           {output.error ? (
//             <div className="space-y-2">
//               {/* Error Type Banner */}
//               <div className={`p-3 rounded-lg border ${
//                 output.errorType === "compileError"
//                   ? "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800"
//                   : output.errorType === "tle"
//                   ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
//                   : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
//               }`}>
//                 <div className="flex items-center gap-2 mb-1">
//                   <XCircle className={`h-5 w-5 ${
//                     output.errorType === "compileError"
//                       ? "text-orange-600 dark:text-orange-400"
//                       : output.errorType === "tle"
//                       ? "text-yellow-600 dark:text-yellow-400"
//                       : "text-red-600 dark:text-red-400"
//                   }`} />
//                   <span className="font-semibold">
//                     {output.errorType === "compileError" && "Compile Error"}
//                     {output.errorType === "runtimeError" && "Runtime Error"}
//                     {output.errorType === "tle" && "Time Limit Exceeded"}
//                     {output.errorType === "executionError" && "Execution Error"}
//                     {!output.errorType && "Error"}
//                   </span>
//                 </div>
//                 {output.errorType === "tle" && (
//                   <div className="text-sm text-muted-foreground">
//                     Your code took too long to execute. Try to optimize your solution.
//                   </div>
//                 )}
//               </div>

//               {/* Error Details */}
//               <div className="p-3 bg-background/50 rounded-lg">
//                 <div className="text-xs font-medium text-muted-foreground mb-1">
//                   Error Details:
//                 </div>
//                 <pre className="text-xs whitespace-pre-wrap font-mono text-red-600 dark:text-red-400">
//                   {output.error}
//                 </pre>
//               </div>
//             </div>
//           ) : output.testResults ? (
//             <div className="space-y-2">
//               {output.isSubmit ? (
//                 // Submit mode: Show summary and only FIRST failed test
//                 <>
//                   <div className={`p-3 rounded-lg ${
//                     output.testResults.every(t => t.passed)
//                       ? "bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800"
//                       : "bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800"
//                   }`}>
//                     <div className="flex items-center gap-2 mb-1">
//                       {output.testResults.every(t => t.passed) ? (
//                         <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
//                       ) : (
//                         <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
//                       )}
//                       <span className="font-semibold">
//                         {output.testResults.every(t => t.passed)
//                           ? "Accepted"
//                           : "Wrong Answer"}
//                       </span>
//                     </div>
//                     <div className="text-sm">
//                       {output.testResults.filter(t => t.passed).length}/{output.testResults.length} test cases passed
//                     </div>
//                   </div>

//                   {/* Show only FIRST failed test case with inputs */}
//                   {(() => {
//                     const firstFailed = output.testResults.find(t => !t.passed);
//                     if (!firstFailed) return null;

//                     const testCase = output.testCasesWithInputs?.[firstFailed.testNumber - 1];
//                     return (
//                       <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800">
//                         <div className="flex items-center gap-2 mb-2">
//                           <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
//                           <span className="text-sm font-semibold">
//                             Test Case {firstFailed.testNumber}
//                           </span>
//                         </div>
//                         {firstFailed.error ? (
//                           <div className="space-y-2">
//                             {testCase && (
//                               <div className="p-2 bg-background/50 rounded">
//                                 <div className="font-medium mb-1 text-xs text-muted-foreground">Input:</div>
//                                 {testCase.input.map((inp, idx) => (
//                                   <div key={idx} className="font-mono text-xs text-foreground">
//                                     <span className="text-blue-600 dark:text-blue-400">
//                                       {problem?.function?.params?.[idx] || `arg${idx}`}
//                                     </span>
//                                     {' = '}
//                                     <span>{JSON.stringify(inp)}</span>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                             <div className="text-xs">
//                               <span className="font-medium text-muted-foreground">Error: </span>
//                               <pre className="text-xs text-red-600 dark:text-red-400 mt-1">
//                                 {firstFailed.error}
//                               </pre>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="text-xs space-y-2">
//                             {testCase && (
//                               <div className="p-2 bg-background/50 rounded">
//                                 <div className="font-medium mb-1 text-muted-foreground">Input:</div>
//                                 {testCase.input.map((inp, idx) => (
//                                   <div key={idx} className="font-mono text-foreground">
//                                     <span className="text-blue-600 dark:text-blue-400">
//                                       {problem?.function?.params?.[idx] || `arg${idx}`}
//                                     </span>
//                                     {' = '}
//                                     <span>{JSON.stringify(inp)}</span>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                             <div>
//                               <span className="font-medium text-muted-foreground">Your Output: </span>
//                               <span className="font-mono text-red-600 dark:text-red-400">
//                                 {JSON.stringify(firstFailed.output)}
//                               </span>
//                             </div>
//                             <div>
//                               <span className="font-medium text-muted-foreground">Expected: </span>
//                               <span className="font-mono text-green-600 dark:text-green-400">
//                                 {JSON.stringify(firstFailed.expected)}
//                               </span>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })()}
//                 </>
//               ) : (
//                 // Run mode: Show all test cases with inputs
//                 output.testResults.map((result) => {
//                   const testCase = output.testCasesWithInputs?.[result.testNumber - 1];
//                   return (
//                     <div
//                       key={result.testNumber}
//                       className={`p-3 rounded-lg border ${
//                         result.passed
//                           ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
//                           : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
//                       }`}
//                     >
//                       <div className="flex items-center gap-2 mb-2">
//                         {result.passed ? (
//                           <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
//                         ) : (
//                           <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
//                         )}
//                         <span className="text-sm font-semibold">
//                           Test Case {result.testNumber}
//                         </span>
//                       </div>
//                       {result.error ? (
//                         <div className="space-y-2">
//                           {testCase && (
//                             <div className="p-2 bg-background/50 rounded">
//                               <div className="font-medium mb-1 text-xs text-muted-foreground">Input:</div>
//                               {testCase.input.map((inp, idx) => (
//                                 <div key={idx} className="font-mono text-xs text-foreground">
//                                   <span className="text-blue-600 dark:text-blue-400">
//                                     {problem?.function?.params?.[idx] || `arg${idx}`}
//                                   </span>
//                                   {' = '}
//                                   <span>{JSON.stringify(inp)}</span>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                           <div className="text-xs">
//                             <span className="font-medium text-muted-foreground">Error: </span>
//                             <pre className="text-xs text-red-600 dark:text-red-400 mt-1">
//                               {result.error}
//                             </pre>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="text-xs space-y-2">
//                           {testCase && (
//                             <div className="p-2 bg-background/50 rounded">
//                               <div className="font-medium mb-1 text-muted-foreground">Input:</div>
//                               {testCase.input.map((inp, idx) => (
//                                 <div key={idx} className="font-mono text-foreground">
//                                   <span className="text-blue-600 dark:text-blue-400">
//                                     {problem?.function?.params?.[idx] || `arg${idx}`}
//                                   </span>
//                                   {' = '}
//                                   <span>{JSON.stringify(inp)}</span>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                           <div>
//                             <span className="font-medium text-muted-foreground">Output: </span>
//                             <span className={`font-mono ${
//                               result.passed
//                                 ? "text-green-600 dark:text-green-400"
//                                 : "text-red-600 dark:text-red-400"
//                             }`}>
//                               {JSON.stringify(result.output)}
//                             </span>
//                           </div>
//                           <div>
//                             <span className="font-medium text-muted-foreground">Expected: </span>
//                             <span className="font-mono text-green-600 dark:text-green-400">
//                               {JSON.stringify(result.expected)}
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           ) : (
//             <pre className="text-xs whitespace-pre-wrap font-mono text-foreground">
//               {output.output}
//             </pre>
//           )}
//         </Card>
//       )}
//     </div>
//   );
// }

// gemini:
// "use client";
// import { useState, useEffect } from "react";
// import Editor from "@monaco-editor/react";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card } from "@/components/ui/card";
// import {
//   Play,
//   RotateCcw,
//   Send,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Clock,
//   Terminal
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import {
//   CppWrapper,
//   JavaScriptWrapper,
//   JavaWrapper,
//   PythonWrapper,
// } from "@/lib/wrappers";
// import { TestCaseI } from "@/models/testcase.model";
// import { ProblemI, StarterCodeI } from "@/models/problem.model";

// // --- Interfaces ---

// interface EditorPanelProps {
//   problem: ProblemI;
//   theme: string;
//   testCases: TestCaseI[];
// }

// type ExecutionStatus = "ACCEPTED" | "WRONG_ANSWER" | "COMPILE_ERROR" | "RUNTIME_ERROR" | "TLE" | "INTERNAL_ERROR";

// interface ExecutionResult {
//   status: ExecutionStatus;
//   output?: string;
//   error?: string;
//   executionTime?: number;
//   testResults?: Array<{
//     testNumber: number;
//     passed: boolean;
//     output: any;
//     expected: any;
//     error?: string;
//   }>;
//   isSubmit?: boolean;
//   testCasesWithInputs?: TestCaseI[];
// }

// type CleanTestCase = {
//   input: any[];
//   expected: any;
// };

// // --- Constants & Helpers ---

// const languageMap: Record<string, string> = {
//   javascript: "javascript",
//   typescript: "typescript",
//   python: "python",
//   java: "java",
//   cpp: "cpp",
// };

// const wrapperMap: Record<string, Function> = {
//   javascript: JavaScriptWrapper,
//   python: PythonWrapper,
//   java: JavaWrapper,
//   cpp: CppWrapper,
// };

// function convertTestCases(raw: TestCaseI[]): CleanTestCase[] {
//   return raw.map((tc) => ({
//     input: tc.input,
//     expected: tc.expected,
//   }));
// }

// function parseTestResults(stdout: string, testCases: CleanTestCase[]): Array<{
//   testNumber: number;
//   passed: boolean;
//   output: any;
//   expected: any;
//   error?: string;
// }> {
//   const lines = stdout.split('\n').filter(line => line.trim());
//   const results = [];

//   for (const line of lines) {
//     // Parse format: "Test X: PASSED/FAILED | Output: Y | Expected: Z"
//     const testMatch = line.match(/Test\s+(\d+):\s+(PASSED|FAILED|ERROR)/i);

//     if (!testMatch) continue;

//     const testNumber = parseInt(testMatch[1]);
//     const status = testMatch[2].toUpperCase();

//     if (status === "ERROR") {
//       const errorMsg = line.split('ERROR')[1]?.replace(/^\s*\|\s*/, '').trim() || "Unknown error";
//       results.push({
//         testNumber,
//         passed: false,
//         output: null,
//         expected: testCases[testNumber - 1]?.expected || null,
//         error: errorMsg,
//       });
//       continue;
//     }

//     // Parse output and expected values
//     const outputMatch = line.match(/Output:\s*(.+?)\s*\|\s*Expected:\s*(.+?)$/i);

//     if (outputMatch) {
//       const outputStr = outputMatch[1].trim();
//       const expectedStr = outputMatch[2].trim();

//       let output, expected;

//       try {
//         output = JSON.parse(outputStr);
//       } catch {
//         output = outputStr;
//       }

//       try {
//         expected = JSON.parse(expectedStr);
//       } catch {
//         expected = expectedStr;
//       }

//       results.push({
//         testNumber,
//         passed: status === "PASSED",
//         output,
//         expected,
//       });
//     }
//   }

//   return results;
// }

// // --- Main Component ---

// export function EditorPanel({ problem, testCases, theme }: EditorPanelProps) {
//   const [language, setLanguage] = useState<keyof StarterCodeI>("javascript");
//   const [code, setCode] = useState("");
//   const [output, setOutput] = useState<ExecutionResult | null>(null);
//   const [isRunning, setIsRunning] = useState(false);
//   const { toast } = useToast();

//   useEffect(() => {
//     if (problem) {
//       const savedCode = localStorage.getItem(`code-${problem.id}-${language}`);
//       if (savedCode) {
//         setCode(savedCode);
//       } else {
//         setCode(problem.starterCode[language] || "");
//       }
//     }
//   }, [problem?.id, language, problem?.starterCode]);

//   const handleCodeChange = (value: string | undefined) => {
//     if (value !== undefined) {
//       setCode(value);
//       if (problem?.id) {
//         localStorage.setItem(`code-${problem.id}-${language}`, value);
//       }
//     }
//   };

//   const handleLanguageChange = (newLanguage: string) => {
//     setLanguage(newLanguage as keyof StarterCodeI);
//   };

//   const handleReset = () => {
//     if (problem) {
//       setCode(problem.starterCode[language] || "");
//       localStorage.removeItem(`code-${problem.id}-${language}`);
//       setOutput(null);
//       toast({
//         title: "Code Reset",
//         description: "Code has been reset to starter template.",
//       });
//     }
//   };

//   const handleRun = async (type: "run" | "submit") => {
//     if (!problem) {
//       toast({
//         title: "Error",
//         description: "No problem loaded.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsRunning(true);
//     setOutput(null);

//     try {
//       const wrapperFunction = wrapperMap[language];

//       if (!wrapperFunction) {
//         throw new Error(`No wrapper found for language: ${language}`);
//       }

//       const testCasesToRun = type === "submit"
//         ? testCases
//         : testCases.filter((testcase) => !testcase.isHidden);

//       if (testCasesToRun.length === 0) {
//         throw new Error("No test cases available to run.");
//       }

//       const cleanTestCases = convertTestCases(testCasesToRun);
//       const fullCode = wrapperFunction(
//         code,
//         problem.function.name,
//         cleanTestCases
//       );

//       const startTime = performance.now();

//       // Piston API Call
//       const response = await fetch("https://emkc.org/api/v2/piston/execute", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           language: languageMap[language],
//           version: "*",
//           files: [
//             {
//               content: fullCode,
//             },
//           ],
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       const endTime = performance.now();
//       const executionTime = Math.round(endTime - startTime);

//       let status: ExecutionStatus = "ACCEPTED";
//       let errorDetails = "";
//       let stdout = "";
//       let parsedResults: any[] = [];

//       // --- LOGIC TO DETECT ERRORS ---

//       // 1. Compile Error
//       if (result.compile && result.compile.code !== 0) {
//         status = "COMPILE_ERROR";
//         errorDetails = result.compile.stderr;
//       }
//       // 2. Time Limit Exceeded (TLE)
//       else if (result.run && result.run.signal === "SIGKILL") {
//         status = "TLE";
//         errorDetails = "Time Limit Exceeded: The code took too long to execute.";
//       }
//       // 3. Runtime Error (Non-zero exit code + Not TLE)
//       else if (result.run && result.run.code !== 0) {
//         status = "RUNTIME_ERROR";
//         errorDetails = result.run.stderr;
//       }
//       // 4. Successful Execution (Check Test Cases)
//       else if (result.run) {
//         stdout = result.run.stdout || "";
//         parsedResults = parseTestResults(stdout, cleanTestCases);

//         // Determine if Accepted or Wrong Answer based on parsed results
//         const allPassed = parsedResults.length > 0 && parsedResults.every(t => t.passed);
//         status = allPassed ? "ACCEPTED" : "WRONG_ANSWER";
//       } else {
//         status = "INTERNAL_ERROR";
//         errorDetails = "No execution result returned.";
//       }

//       // --- SETTING OUTPUT STATE ---

//       setOutput({
//         status,
//         output: stdout,
//         error: errorDetails,
//         executionTime,
//         testResults: parsedResults,
//         isSubmit: type === "submit",
//         testCasesWithInputs: testCasesToRun,
//       });

//       // --- TOAST NOTIFICATIONS ---

//       if (status === "ACCEPTED") {
//         toast({
//           title: type === "submit" ? "Accepted! 🎉" : "All Tests Passed! ✓",
//           description: `Executed in ${executionTime}ms`,
//         });
//       } else if (status === "WRONG_ANSWER") {
//         toast({
//           title: "Wrong Answer",
//           description: `${parsedResults.filter(t => t.passed).length}/${parsedResults.length} test cases passed`,
//           variant: "destructive",
//         });
//       } else {
//         // Covers Compile Error, Runtime Error, TLE
//         toast({
//           title: status.replace("_", " "),
//           description: "Check the output panel for details.",
//           variant: "destructive",
//         });
//       }

//     } catch (error) {
//       console.error("Execution error:", error);
//       setOutput({
//         status: "INTERNAL_ERROR",
//         error: error instanceof Error ? error.message : "Failed to execute code.",
//       });
//       toast({
//         title: "Execution Failed",
//         description: "Could not connect to execution service.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   const handleSubmit = async () => {
//     await handleRun("submit");
//   };

//   // --- Helpers for UI Rendering ---

//   const getStatusColor = (status: ExecutionStatus) => {
//     switch (status) {
//       case "ACCEPTED": return "text-green-500";
//       case "WRONG_ANSWER": return "text-red-500";
//       case "COMPILE_ERROR": return "text-yellow-500";
//       case "RUNTIME_ERROR": return "text-orange-500";
//       case "TLE": return "text-purple-500";
//       default: return "text-red-500";
//     }
//   };

//   const getStatusIcon = (status: ExecutionStatus) => {
//     switch (status) {
//       case "ACCEPTED": return <CheckCircle className="h-5 w-5 text-green-500" />;
//       case "WRONG_ANSWER": return <XCircle className="h-5 w-5 text-red-500" />;
//       case "COMPILE_ERROR": return <Terminal className="h-5 w-5 text-yellow-500" />; // Or specific compile icon
//       case "RUNTIME_ERROR": return <AlertTriangle className="h-5 w-5 text-orange-500" />;
//       case "TLE": return <Clock className="h-5 w-5 text-purple-500" />;
//       default: return <XCircle className="h-5 w-5 text-gray-500" />;
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex items-center justify-between p-3 border-b border-border gap-2">
//         <Select value={language} onValueChange={handleLanguageChange}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Select language" />
//           </SelectTrigger>
//           <SelectContent className="bg-popover">
//             <SelectItem value="javascript">JavaScript</SelectItem>
//             <SelectItem value="python">Python</SelectItem>
//             <SelectItem value="java">Java</SelectItem>
//             <SelectItem value="cpp">C++</SelectItem>
//           </SelectContent>
//         </Select>

//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleReset}
//             className="gap-2"
//             disabled={isRunning}
//           >
//             <RotateCcw className="h-4 w-4" />
//             Reset
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleRun('run')}
//             disabled={isRunning}
//             className="gap-2"
//           >
//             <Play className="h-4 w-4" />
//             {isRunning ? "Running..." : "Run"}
//           </Button>
//           <Button
//             size="sm"
//             onClick={handleSubmit}
//             className="gap-2"
//             disabled={isRunning}
//           >
//             <Send className="h-4 w-4" />
//             Submit
//           </Button>
//         </div>
//       </div>

//       <div className="flex-1 min-h-0">
//         <Editor
//           height="100%"
//           language={language === "cpp" ? "cpp" : language}
//           value={code}
//           onChange={handleCodeChange}
//           theme={theme === "dark" ? "vs-dark" : "light"}
//           options={{
//             minimap: { enabled: false },
//             fontSize: 14,
//             lineNumbers: "on",
//             scrollBeyondLastLine: false,
//             automaticLayout: true,
//             tabSize: 2,
//             wordWrap: "on",
//           }}
//         />
//       </div>

//       {output && (
//         <Card className="m-3 p-3 bg-card max-h-[300px] overflow-y-auto">
//           <div className="flex items-center justify-between mb-2 sticky top-0 bg-card z-10">
//             <div className="flex items-center gap-2">
//               {getStatusIcon(output.status)}
//               <h3 className={`text-sm font-semibold ${getStatusColor(output.status)}`}>
//                 {output.status.replace("_", " ")}
//               </h3>
//             </div>
//             {output.executionTime && (
//               <span className="text-xs text-muted-foreground">
//                 {output.executionTime}ms
//               </span>
//             )}
//           </div>

//           {/* LOGIC TO RENDER DIFFERENT ERROR TYPES */}

//           {/* 1. Compile Error / Runtime Error / TLE (Raw Error Message) */}
//           {(output.status === "COMPILE_ERROR" || output.status === "RUNTIME_ERROR" || output.status === "TLE" || output.status === "INTERNAL_ERROR") ? (
//              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-md border border-red-200 dark:border-red-900">
//                 <div className="text-xs font-mono whitespace-pre-wrap text-red-600 dark:text-red-400">
//                   {output.error || "Unknown Error Occurred"}
//                 </div>
//              </div>
//           ) : (

//           /* 2. Test Case Results (Accepted / Wrong Answer) */
//           output.testResults && (
//             <div className="space-y-2">
//               {output.isSubmit ? (
//                 // Submit mode: Show summary and only FIRST failed test
//                 <>
//                    <div className={`p-3 rounded-lg border ${
//                      output.status === "ACCEPTED"
//                        ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"
//                        : "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800"
//                    }`}>
//                     <div className="text-sm">
//                       {output.testResults.filter(t => t.passed).length}/{output.testResults.length} test cases passed
//                     </div>
//                   </div>

//                   {/* Show only FIRST failed test case with inputs */}
//                   {(() => {
//                     const firstFailed = output.testResults.find(t => !t.passed);
//                     if (!firstFailed) return null;

//                     const testCase = output.testCasesWithInputs?.[firstFailed.testNumber - 1];
//                     return (
//                       <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800">
//                         <div className="flex items-center gap-2 mb-2">
//                           <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
//                           <span className="text-sm font-semibold">
//                             Test Case {firstFailed.testNumber}
//                           </span>
//                         </div>
//                         {firstFailed.error ? (
//                           <pre className="text-xs text-red-600 dark:text-red-400 mb-2 whitespace-pre-wrap">
//                             {firstFailed.error}
//                           </pre>
//                         ) : (
//                           <div className="text-xs space-y-2">
//                             {testCase && (
//                               <div className="p-2 bg-background/50 rounded">
//                                 <div className="font-medium mb-1 text-muted-foreground">Input:</div>
//                                 {testCase.input.map((inp, idx) => (
//                                   <div key={idx} className="font-mono text-foreground">
//                                     <span className="text-blue-600 dark:text-blue-400">
//                                       {problem?.function?.params?.[idx] || `arg${idx}`}
//                                     </span>
//                                     {' = '}
//                                     <span>{JSON.stringify(inp)}</span>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                             <div>
//                               <span className="font-medium text-muted-foreground">Your Output: </span>
//                               <span className="font-mono text-red-600 dark:text-red-400">
//                                 {JSON.stringify(firstFailed.output)}
//                               </span>
//                             </div>
//                             <div>
//                               <span className="font-medium text-muted-foreground">Expected: </span>
//                               <span className="font-mono text-green-600 dark:text-green-400">
//                                 {JSON.stringify(firstFailed.expected)}
//                               </span>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })()}
//                 </>
//               ) : (
//                 // Run mode: Show all test cases
//                 output.testResults.map((result) => {
//                   const testCase = output.testCasesWithInputs?.[result.testNumber - 1];
//                   return (
//                     <div
//                       key={result.testNumber}
//                       className={`p-3 rounded-lg border ${
//                         result.passed
//                           ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"
//                           : "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800"
//                       }`}
//                     >
//                       <div className="flex items-center gap-2 mb-2">
//                         {result.passed ? (
//                           <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
//                         ) : (
//                           <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
//                         )}
//                         <span className="text-sm font-semibold">
//                           Test Case {result.testNumber}
//                         </span>
//                       </div>
//                       {result.error ? (
//                         <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap">
//                           {result.error}
//                         </pre>
//                       ) : (
//                         <div className="text-xs space-y-2">
//                           {testCase && (
//                             <div className="p-2 bg-background/50 rounded">
//                               <div className="font-medium mb-1 text-muted-foreground">Input:</div>
//                               {testCase.input.map((inp, idx) => (
//                                 <div key={idx} className="font-mono text-foreground">
//                                   <span className="text-blue-600 dark:text-blue-400">
//                                     {problem?.function?.params?.[idx] || `arg${idx}`}
//                                   </span>
//                                   {' = '}
//                                   <span>{JSON.stringify(inp)}</span>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                           <div>
//                             <span className="font-medium text-muted-foreground">Output: </span>
//                             <span className={`font-mono ${
//                               result.passed
//                                 ? "text-green-600 dark:text-green-400"
//                                 : "text-red-600 dark:text-red-400"
//                             }`}>
//                               {JSON.stringify(result.output)}
//                             </span>
//                           </div>
//                           {!result.passed && (
//                             <div>
//                                 <span className="font-medium text-muted-foreground">Expected: </span>
//                                 <span className="font-mono text-green-600 dark:text-green-400">
//                                 {JSON.stringify(result.expected)}
//                                 </span>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           ))}
//         </Card>
//       )}
//     </div>
//   );
// }

// cloude makes better the gemini ui
// "use client";
// import { useState, useEffect } from "react";
// import Editor from "@monaco-editor/react";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Loader2,
//   Play,
//   RotateCcw,
//   Send,
//   CheckCircle2,
//   XCircle,
//   AlertTriangle,
//   Clock,
//   Terminal,
//   ChevronUp,
//   ChevronDown,
//   AlertOctagon
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import {
//   CppWrapper,
//   JavaScriptWrapper,
//   JavaWrapper,
//   PythonWrapper,
// } from "@/lib/wrappers";
// import { TestCaseI } from "@/models/testcase.model";
// import { ProblemI, StarterCodeI } from "@/models/problem.model";
// import { cn } from "@/lib/utils";

// // --- Interfaces ---

// interface EditorPanelProps {
//   problem: ProblemI;
//   theme: string;
//   testCases: TestCaseI[];
// }

// type ExecutionStatus = "ACCEPTED" | "WRONG_ANSWER" | "COMPILE_ERROR" | "RUNTIME_ERROR" | "TLE" | "INTERNAL_ERROR";

// interface ExecutionResult {
//   status: ExecutionStatus;
//   output?: string;
//   error?: string;
//   executionTime?: number;
//   testResults?: Array<{
//     testNumber: number;
//     passed: boolean;
//     output: any;
//     expected: any;
//     error?: string;
//   }>;
//   isSubmit?: boolean;
//   testCasesWithInputs?: TestCaseI[];
// }

// type CleanTestCase = {
//   input: any[];
//   expected: any;
// };

// // --- Constants & Helpers ---

// const languageMap: Record<string, string> = {
//   javascript: "javascript",
//   typescript: "typescript",
//   python: "python",
//   java: "java",
//   cpp: "cpp",
// };

// const wrapperMap: Record<string, Function> = {
//   javascript: JavaScriptWrapper,
//   python: PythonWrapper,
//   java: JavaWrapper,
//   cpp: CppWrapper,
// };

// function convertTestCases(raw: TestCaseI[]): CleanTestCase[] {
//   return raw.map((tc) => ({
//     input: tc.input,
//     expected: tc.expected,
//   }));
// }

// function parseTestResults(stdout: string, testCases: CleanTestCase[]): Array<{
//   testNumber: number;
//   passed: boolean;
//   output: any;
//   expected: any;
//   error?: string;
// }> {
//   const lines = stdout.split('\n').filter(line => line.trim());
//   const results = [];

//   for (const line of lines) {
//     const testMatch = line.match(/Test\s+(\d+):\s+(PASSED|FAILED|ERROR)/i);
//     if (!testMatch) continue;

//     const testNumber = parseInt(testMatch[1]);
//     const status = testMatch[2].toUpperCase();

//     if (status === "ERROR") {
//       const errorMsg = line.split('ERROR')[1]?.replace(/^\s*\|\s*/, '').trim() || "Unknown error";
//       results.push({
//         testNumber,
//         passed: false,
//         output: null,
//         expected: testCases[testNumber - 1]?.expected || null,
//         error: errorMsg,
//       });
//       continue;
//     }

//     const outputMatch = line.match(/Output:\s*(.+?)\s*\|\s*Expected:\s*(.+?)$/i);
//     if (outputMatch) {
//       const outputStr = outputMatch[1].trim();
//       const expectedStr = outputMatch[2].trim();
//       let output, expected;
//       try { output = JSON.parse(outputStr); } catch { output = outputStr; }
//       try { expected = JSON.parse(expectedStr); } catch { expected = expectedStr; }

//       results.push({
//         testNumber,
//         passed: status === "PASSED",
//         output,
//         expected,
//       });
//     }
//   }
//   return results;
// }

// // --- Main Component ---

// export function EditorPanel({ problem, testCases, theme }: EditorPanelProps) {
//   const [language, setLanguage] = useState<keyof StarterCodeI>("javascript");
//   const [code, setCode] = useState("");
//   const [output, setOutput] = useState<ExecutionResult | null>(null);
//   const [isRunning, setIsRunning] = useState(false);
//   const [activeTab, setActiveTab] = useState<"input" | "output">("input");
//   const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
//   const [isConsoleOpen, setIsConsoleOpen] = useState(true);

//   const { toast } = useToast();

//   useEffect(() => {
//     if (problem) {
//       const savedCode = localStorage.getItem(`code-${problem.id}-${language}`);
//       setCode(savedCode || problem.starterCode[language] || "");
//     }
//   }, [problem?.id, language, problem?.starterCode]);

//   const handleCodeChange = (value: string | undefined) => {
//     if (value !== undefined) {
//       setCode(value);
//       if (problem?.id) {
//         localStorage.setItem(`code-${problem.id}-${language}`, value);
//       }
//     }
//   };

//   const handleLanguageChange = (newLanguage: string) => {
//     setLanguage(newLanguage as keyof StarterCodeI);
//   };

//   const handleReset = () => {
//     if (problem) {
//       setCode(problem.starterCode[language] || "");
//       localStorage.removeItem(`code-${problem.id}-${language}`);
//       setOutput(null);
//       toast({ title: "Reset", description: "Code reset to default." });
//     }
//   };

//   const handleRun = async (type: "run" | "submit") => {
//     if (!problem) return;
//     setIsRunning(true);
//     setIsConsoleOpen(true);
//     setActiveTab("output"); // Auto switch to output

//     try {
//       const wrapperFunction = wrapperMap[language];
//       if (!wrapperFunction) throw new Error(`Language ${language} not supported yet.`);

//       const testCasesToRun = type === "submit" ? testCases : testCases.filter((tc) => !tc.isHidden);
//       const cleanTestCases = convertTestCases(testCasesToRun);
//       const fullCode = wrapperFunction(code, problem.function.name, cleanTestCases);

//       const startTime = performance.now();

//       const response = await fetch("https://emkc.org/api/v2/piston/execute", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           language: languageMap[language],
//           version: "*",
//           files: [{ content: fullCode }],
//         }),
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const result = await response.json();
//       const executionTime = Math.round(performance.now() - startTime);

//       let status: ExecutionStatus = "ACCEPTED";
//       let errorDetails = "";
//       let stdout = "";
//       let parsedResults: any[] = [];

//       // 1. Critical Errors Check
//       if (result.compile && result.compile.code !== 0) {
//         status = "COMPILE_ERROR";
//         errorDetails = result.compile.stderr;
//       } else if (result.run && result.run.signal === "SIGKILL") {
//         status = "TLE";
//         errorDetails = "Time Limit Exceeded: Your code took too long to execute.";
//       } else if (result.run && result.run.code !== 0) {
//         status = "RUNTIME_ERROR";
//         errorDetails = result.run.stderr;
//       } else if (result.run) {
//         stdout = result.run.stdout || "";
//         parsedResults = parseTestResults(stdout, cleanTestCases);
//         const allPassed = parsedResults.length > 0 && parsedResults.every(t => t.passed);
//         status = allPassed ? "ACCEPTED" : "WRONG_ANSWER";
//       } else {
//         status = "INTERNAL_ERROR";
//         errorDetails = "No result returned from execution engine.";
//       }

//       // 2. Logic to determine active case
//       let targetIndex = 0;
//       if (type === "submit" && status === "WRONG_ANSWER") {
//         targetIndex = parsedResults.findIndex(r => !r.passed);
//         if (targetIndex === -1) targetIndex = 0;
//       }
//       setActiveTestCaseId(targetIndex);

//       setOutput({
//         status,
//         output: stdout,
//         error: errorDetails,
//         executionTime,
//         testResults: parsedResults,
//         isSubmit: type === "submit",
//         testCasesWithInputs: testCasesToRun,
//       });

//     } catch (error) {
//       setOutput({
//         status: "INTERNAL_ERROR",
//         error: error instanceof Error ? error.message : "Execution failed",
//       });
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   const renderTestCaseDetail = (index: number) => {
//     if (!output || !output.testResults || !output.testResults[index]) return null;
//     const result = output.testResults[index];
//     const inputs = output.testCasesWithInputs?.[index];

//     return (
//       <div className="space-y-4 font-mono text-sm animate-in fade-in duration-300">
//         {inputs && (
//           <div className="grid gap-1">
//             <span className="text-xs text-muted-foreground">Input</span>
//             <div className="p-3 bg-muted/30 rounded-md border text-xs">
//               {inputs.input.map((inp, i) => (
//                  <div key={i} className="mb-1 last:mb-0">
//                     <span className="text-blue-500 mr-2">{problem.function.params[i]} =</span>
//                     {JSON.stringify(inp)}
//                  </div>
//               ))}
//             </div>
//           </div>
//         )}
//         <div className="grid gap-4">
//           <div className="space-y-1">
//             <span className="text-xs text-muted-foreground">Output</span>
//             <div className={cn(
//               "p-3 rounded-md border text-xs overflow-auto",
//               result.passed
//                 ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400"
//                 : "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400"
//             )}>
//               {JSON.stringify(result.output)}
//             </div>
//           </div>
//           <div className="space-y-1">
//             <span className="text-xs text-muted-foreground">Expected</span>
//             <div className="p-3 bg-muted/30 border text-muted-foreground rounded-md text-xs overflow-auto">
//               {JSON.stringify(result.expected)}
//             </div>
//           </div>
//         </div>
//         {result.error && (
//           <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-600 dark:text-red-400 text-xs">
//             {result.error}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Helper: Is this a critical error?
//   const isCriticalError = (status?: ExecutionStatus) => {
//     return status === "COMPILE_ERROR" || status === "RUNTIME_ERROR" || status === "TLE" || status === "INTERNAL_ERROR";
//   };

//   return (
//     <div className="flex flex-col h-full bg-background border rounded-lg overflow-hidden shadow-sm">
//       {/* --- Toolbar --- */}
//       <div className="flex items-center justify-between p-3 border-b bg-card">
//         <Select value={language} onValueChange={handleLanguageChange}>
//           <SelectTrigger className="w-[160px] h-8 bg-muted/50">
//             <SelectValue placeholder="Language" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="javascript">JavaScript</SelectItem>
//             <SelectItem value="python">Python</SelectItem>
//             <SelectItem value="java">Java</SelectItem>
//             <SelectItem value="cpp">C++</SelectItem>
//           </SelectContent>
//         </Select>

//         <div className="flex gap-2">
//           <Button variant="ghost" size="sm" onClick={handleReset} disabled={isRunning} className="h-8 text-muted-foreground hover:text-foreground">
//             <RotateCcw className="h-4 w-4 mr-2" />
//             Reset
//           </Button>
//           <Button variant="secondary" size="sm" onClick={() => handleRun('run')} disabled={isRunning} className="h-8 bg-muted hover:bg-muted/80">
//             {isRunning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2 fill-current" />}
//             Run
//           </Button>
//           <Button size="sm" onClick={() => handleRun('submit')} disabled={isRunning} className="h-8 bg-green-600 hover:bg-green-700 text-white">
//             {isRunning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
//             Submit
//           </Button>
//         </div>
//       </div>

//       {/* --- Editor Area --- */}
//       <div className="flex-1 relative min-h-0">
//         <Editor
//           height="100%"
//           language={language === "cpp" ? "cpp" : language}
//           value={code}
//           onChange={handleCodeChange}
//           theme={theme === "dark" ? "vs-dark" : "light"}
//           options={{
//             minimap: { enabled: false },
//             fontSize: 14,
//             lineNumbers: "on",
//             scrollBeyondLastLine: false,
//             automaticLayout: true,
//             tabSize: 2,
//             fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
//             padding: { top: 16, bottom: 16 },
//             roundedSelection: true,
//           }}
//         />
//       </div>

//       {/* --- Resizable Console --- */}
//       <div className={cn(
//         "bg-card border-t transition-all duration-300 ease-in-out flex flex-col",
//         isConsoleOpen ? "h-[350px]" : "h-[40px]"
//       )}>
//         {/* Console Header */}
//         <div className="flex items-center justify-between px-4 h-[40px] bg-muted/30 border-b cursor-pointer" onClick={() => setIsConsoleOpen(!isConsoleOpen)}>
//           <div className="flex gap-4 h-full">
//             <button
//               onClick={(e) => { e.stopPropagation(); setActiveTab('input'); setIsConsoleOpen(true); }}
//               className={cn("text-xs font-medium border-b-2 h-full flex items-center gap-2 px-2 transition-colors",
//                 activeTab === 'input' && !isCriticalError(output?.status) ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
//               )}
//             >
//               <Terminal className="h-3.5 w-3.5" /> Test Cases
//             </button>
//             <button
//               onClick={(e) => { e.stopPropagation(); setActiveTab('output'); setIsConsoleOpen(true); }}
//               className={cn("text-xs font-medium border-b-2 h-full flex items-center gap-2 px-2 transition-colors",
//                 activeTab === 'output' || isCriticalError(output?.status) ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
//               )}
//             >
//                {output && output.status !== "ACCEPTED" && output.status !== "INTERNAL_ERROR" ? (
//                  <AlertTriangle className={cn("h-3.5 w-3.5", isCriticalError(output.status) ? "text-red-500" : "text-yellow-500")} />
//                ) : (
//                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
//                )}
//                Test Results
//             </button>
//           </div>
//           <div className="flex items-center gap-2 text-muted-foreground">
//              {isConsoleOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
//           </div>
//         </div>

//         {/* Console Content */}
//         {isConsoleOpen && (
//           <div className="flex-1 overflow-hidden p-4 relative">

//             {/* --- CRITICAL ERROR OVERLAY (Takes Priority) --- */}
//             {output && isCriticalError(output.status) ? (
//               <div className="w-full h-full flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
//                 <div className="flex items-center gap-2 text-red-600 dark:text-red-500 font-semibold text-lg">
//                    <AlertOctagon className="h-5 w-5" />
//                    <span>{output.status.replace("_", " ")}</span>
//                 </div>
//                 <div className="flex-1 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg overflow-auto font-mono text-sm text-red-700 dark:text-red-400 whitespace-pre-wrap leading-relaxed shadow-inner">
//                    {output.error}
//                 </div>
//               </div>
//             ) : (
//               // Standard View (Inputs / Test Results)
//               <>
//                 {/* INPUT TAB */}
//                 {activeTab === 'input' && (
//                   <div className="h-full flex flex-col">
//                     <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
//                       {testCases.filter(tc => !tc.isHidden).map((tc, idx) => (
//                           <button
//                             key={idx}
//                             onClick={() => setActiveTestCaseId(idx)}
//                             className={cn(
//                               "px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap",
//                               activeTestCaseId === idx
//                                 ? "bg-secondary text-foreground"
//                                 : "bg-muted/50 text-muted-foreground hover:bg-muted"
//                             )}
//                           >
//                             Case {idx + 1}
//                           </button>
//                       ))}
//                     </div>
//                     <div className="space-y-3 font-mono text-sm overflow-y-auto">
//                         {(() => {
//                             const tc = testCases.filter(tc => !tc.isHidden)[activeTestCaseId];
//                             if(!tc) return <div className="text-muted-foreground text-sm">No test case selected.</div>
//                             return (
//                               <div className="space-y-4">
//                                 {tc.input.map((inp, idx) => (
//                                   <div key={idx}>
//                                     <div className="text-xs text-muted-foreground mb-1">
//                                       {problem?.function.params[idx] || `Param ${idx+1}`} =
//                                     </div>
//                                     <div className="p-3 bg-muted/50 rounded-md border text-foreground">
//                                       {JSON.stringify(inp)}
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             )
//                         })()}
//                     </div>
//                   </div>
//                 )}

//                 {/* OUTPUT TAB */}
//                 {activeTab === 'output' && (
//                   <div className="h-full overflow-y-auto">
//                     {!output ? (
//                       <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
//                         <p>Run your code to see results</p>
//                       </div>
//                     ) : (
//                       <div className="space-y-4">

//                         {/* Status Header (For Passed/Wrong Answer) */}
//                         <div className="flex items-center gap-3">
//                           <span className={cn("text-lg font-semibold",
//                             output.status === "ACCEPTED" ? "text-green-500" : "text-red-500"
//                           )}>
//                             {output.status.replace("_", " ")}
//                           </span>
//                           {output.executionTime && (
//                             <span className="text-xs text-muted-foreground flex items-center gap-1">
//                               <Clock className="h-3 w-3" /> {output.executionTime}ms
//                             </span>
//                           )}
//                         </div>

//                         <div className="flex flex-col h-full">
//                             {/* A. SUBMIT + ACCEPTED */}
//                             {output.isSubmit && output.status === "ACCEPTED" && (
//                                 <div className="flex flex-col gap-4 p-6 bg-green-500/5 border border-green-500/10 rounded-lg items-center justify-center text-center">
//                                     <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
//                                     <h3 className="text-xl font-bold text-green-600">All Test Cases Passed!</h3>
//                                     <p className="text-muted-foreground">
//                                       {output.testResults?.length} / {output.testResults?.length} test cases passed.
//                                     </p>
//                                 </div>
//                             )}

//                             {/* B. SUBMIT + WRONG ANSWER */}
//                             {output.isSubmit && output.status === "WRONG_ANSWER" && (
//                                 <>
//                                   <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-600 text-sm">
//                                     <XCircle className="h-4 w-4" />
//                                     {output.testResults?.filter(t => t.passed).length} / {output.testResults?.length} test cases passed.
//                                   </div>
//                                   <div className="font-semibold text-sm mb-2">First Failed Case Detail</div>
//                                   {renderTestCaseDetail(activeTestCaseId)}
//                                 </>
//                             )}

//                             {/* C. RUN (Debug) */}
//                             {!output.isSubmit && (
//                                 <>
//                                   <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
//                                     {output.testResults?.map((res, idx) => (
//                                         <button
//                                           key={idx}
//                                           onClick={() => setActiveTestCaseId(idx)}
//                                           className={cn(
//                                             "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap border",
//                                             activeTestCaseId === idx
//                                               ? "bg-background border-primary text-foreground ring-1 ring-primary"
//                                               : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
//                                           )}
//                                         >
//                                           {res.passed ? (
//                                               <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
//                                           ) : (
//                                               <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
//                                           )}
//                                           Case {res.testNumber}
//                                         </button>
//                                     ))}
//                                   </div>
//                                   {renderTestCaseDetail(activeTestCaseId)}
//                                 </>
//                             )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// with create submission api:
// "use client";
// import { useState, useEffect } from "react";
// import Editor from "@monaco-editor/react";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Loader2,
//   Play,
//   RotateCcw,
//   Send,
//   CheckCircle2,
//   XCircle,
//   AlertTriangle,
//   Clock,
//   Terminal,
//   ChevronUp,
//   ChevronDown,
//   AlertOctagon,
//   FileText,
//   Code2
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import {
//   CppWrapper,
//   JavaScriptWrapper,
//   JavaWrapper,
//   PythonWrapper,
// } from "@/lib/wrappers";
// import { TestCaseI } from "@/models/testcase.model";
// import { ProblemI, StarterCodeI } from "@/models/problem.model";
// import { SubmissionI } from "@/models/submission.model"; // Ensure this path is correct
// import { apiClient } from "@/lib/apiClient"; // Ensure this path is correct
// import { cn } from "@/lib/utils";
// import mongoose from "mongoose"

// // --- Interfaces ---

// interface EditorPanelProps {
//   problem: ProblemI;
//   theme: string;
//   testCases: TestCaseI[];
//   userId?: string; // Optional: Pass if available, otherwise backend should handle via token
// }

// type ExecutionStatus = "ACCEPTED" | "WRONG_ANSWER" | "COMPILE_ERROR" | "RUNTIME_ERROR" | "TLE" | "INTERNAL_ERROR";

// interface ExecutionResult {
//   status: ExecutionStatus;
//   output?: string;
//   error?: string;
//   executionTime?: number;
//   testResults?: Array<{
//     testNumber: number;
//     passed: boolean;
//     output: any;
//     expected: any;
//     error?: string;
//   }>;
//   isSubmit?: boolean;
//   submissionId?: string; // ID returned from DB
//   note?: string; // Note attached to submission
//   testCasesWithInputs?: TestCaseI[];
//   totalTestCases?: number;
// }

// type CleanTestCase = {
//   input: any[];
//   expected: any;
// };

// // --- Constants & Helpers ---

// const languageMap: Record<string, string> = {
//   javascript: "javascript",
//   typescript: "typescript",
//   python: "python",
//   java: "java",
//   cpp: "cpp",
// };

// const wrapperMap: Record<string, Function> = {
//   javascript: JavaScriptWrapper,
//   python: PythonWrapper,
//   java: JavaWrapper,
//   cpp: CppWrapper,
// };

// // Map execution status to DB Schema status
// const mapStatusToDb = (status: ExecutionStatus): SubmissionI['status'] => {
//     switch(status) {
//         case "ACCEPTED": return "accepted";
//         case "WRONG_ANSWER": return "wrongAnswer";
//         case "RUNTIME_ERROR": return "runtimeError";
//         case "COMPILE_ERROR": return "compileError";
//         case "TLE": return "tle";
//         default: return "runtimeError";
//     }
// };

// function convertTestCases(raw: TestCaseI[]): CleanTestCase[] {
//   return raw.map((tc) => ({
//     input: tc.input,
//     expected: tc.expected,
//   }));
// }

// function parseTestResults(stdout: string, testCases: CleanTestCase[]): Array<{
//   testNumber: number;
//   passed: boolean;
//   output: any;
//   expected: any;
//   error?: string;
// }> {
//   const lines = stdout.split('\n').filter(line => line.trim());
//   const results = [];

//   for (const line of lines) {
//     const testMatch = line.match(/Test\s+(\d+):\s+(PASSED|FAILED|ERROR)/i);
//     if (!testMatch) continue;

//     const testNumber = parseInt(testMatch[1]);
//     const status = testMatch[2].toUpperCase();

//     if (status === "ERROR") {
//       const errorMsg = line.split('ERROR')[1]?.replace(/^\s*\|\s*/, '').trim() || "Unknown error";
//       results.push({
//         testNumber,
//         passed: false,
//         output: null,
//         expected: testCases[testNumber - 1]?.expected || null,
//         error: errorMsg,
//       });
//       continue;
//     }

//     const outputMatch = line.match(/Output:\s*(.+?)\s*\|\s*Expected:\s*(.+?)$/i);
//     if (outputMatch) {
//       const outputStr = outputMatch[1].trim();
//       const expectedStr = outputMatch[2].trim();
//       let output, expected;
//       try { output = JSON.parse(outputStr); } catch { output = outputStr; }
//       try { expected = JSON.parse(expectedStr); } catch { expected = expectedStr; }

//       results.push({
//         testNumber,
//         passed: status === "PASSED",
//         output,
//         expected,
//       });
//     }
//   }
//   return results;
// }

// // --- Main Component ---

// export function EditorPanel({ problem, testCases, theme, userId }: EditorPanelProps) {
//   const [language, setLanguage] = useState<keyof StarterCodeI>("javascript");
//   const [code, setCode] = useState("");
//   const [output, setOutput] = useState<ExecutionResult | null>(null);
//   const [isRunning, setIsRunning] = useState(false);
//   const [activeTab, setActiveTab] = useState<"input" | "output">("input");
//   const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
//   const [isConsoleOpen, setIsConsoleOpen] = useState(true);
//   const [submissionNote, setSubmissionNote] = useState("");
//   const [isNoteOpen, setIsNoteOpen] = useState(false);

//   const { toast } = useToast();

//   useEffect(() => {
//     if (problem) {
//       const savedCode = localStorage.getItem(`code-${problem._id}-${language}`);
//       setCode(savedCode || problem.starterCode[language] || "");
//     }
//   }, [problem?._id, language, problem?.starterCode]);

//   const handleCodeChange = (value: string | undefined) => {
//     if (value !== undefined) {
//       setCode(value);
//       if (problem?._id) {
//         localStorage.setItem(`code-${problem._id}-${language}`, value);
//       }
//     }
//   };

//   const handleLanguageChange = (newLanguage: string) => {
//     setLanguage(newLanguage as keyof StarterCodeI);
//   };

//   const handleReset = () => {
//     if (problem) {
//       setCode(problem.starterCode[language] || "");
//       localStorage.removeItem(`code-${problem._id}-${language}`);
//       setOutput(null);
//       toast({ title: "Reset", description: "Code reset to default." });
//     }
//   };

//   const handleRun = async (type: "run" | "submit") => {
//     if (!problem) return;
//     setIsRunning(true);
//     setIsConsoleOpen(true);
//     setActiveTab("output");

//     try {
//       const wrapperFunction = wrapperMap[language];
//       if (!wrapperFunction) throw new Error(`Language ${language} not supported yet.`);

//       const testCasesToRun = type === "submit" ? testCases : testCases.filter((tc) => !tc.isHidden);
//       const cleanTestCases = convertTestCases(testCasesToRun);
//       const fullCode = wrapperFunction(code, problem.function.name, cleanTestCases);

//       const startTime = performance.now();

//       // 1. Execute Code via Piston
//       const response = await fetch("https://emkc.org/api/v2/piston/execute", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           language: languageMap[language],
//           version: "*",
//           files: [{ content: fullCode }],
//         }),
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const result = await response.json();
//       const executionTime = Math.round(performance.now() - startTime);

//       let status: ExecutionStatus = "ACCEPTED";
//       let errorDetails = "";
//       let stdout = "";
//       let parsedResults: any[] = [];
//       let dbSubmissionId = "";

//       // 2. Determine Execution Status
//       if (result.compile && result.compile.code !== 0) {
//         status = "COMPILE_ERROR";
//         errorDetails = result.compile.stderr;
//       } else if (result.run && result.run.signal === "SIGKILL") {
//         status = "TLE";
//         errorDetails = "Time Limit Exceeded";
//       } else if (result.run && result.run.code !== 0) {
//         status = "RUNTIME_ERROR";
//         errorDetails = result.run.stderr;
//       } else if (result.run) {
//         stdout = result.run.stdout || "";
//         parsedResults = parseTestResults(stdout, cleanTestCases);
//         const allPassed = parsedResults.length > 0 && parsedResults.every(t => t.passed);
//         status = allPassed ? "ACCEPTED" : "WRONG_ANSWER";
//       } else {
//         status = "INTERNAL_ERROR";
//       }

//       // 3. If Submit, Save to Database
//       if (type === "submit") {
//         const lastFailed = parsedResults.find(r => !r.passed);

//         const submissionPayload: Partial<SubmissionI> = {
//             problemId: problem._id as mongoose.Types.ObjectId,
//             // If your backend pulls userId from Token, this might be optional.
//             // If required by schema validation on request, include it here.
//             userId: userId as any,
//             code: code,
//             language: language,
//             totalTestCases: cleanTestCases.length,
//             passedTestCases: parsedResults.filter(r => r.passed).length,
//             status: mapStatusToDb(status),
//             lastFailedTestCase: lastFailed ? {
//                 input: JSON.stringify(cleanTestCases[lastFailed.testNumber - 1].input),
//                 expectedOutput: JSON.stringify(lastFailed.expected),
//                 actualOutput: JSON.stringify(lastFailed.output),
//                 error: lastFailed.error
//             } : null,
//             note: submissionNote
//         };

//         const saveRes = await apiClient.createSubmission(submissionPayload as SubmissionI);

//         if (saveRes.success && saveRes.data) {
//              dbSubmissionId = String(saveRes.data._id);
//              toast({
//                  title: "Submission Saved",
//                  description: `Result: ${status.replace("_", " ")}`,
//                  variant: status === "ACCEPTED" ? "default" : "destructive"
//              });
//         } else {
//              toast({ title: "Save Failed", description: saveRes.error, variant: "destructive" });
//         }
//       }

//       // 4. Update UI State
//       let targetIndex = 0;
//       if (type === "submit" && status === "WRONG_ANSWER") {
//         targetIndex = parsedResults.findIndex(r => !r.passed);
//         if (targetIndex === -1) targetIndex = 0;
//       }
//       setActiveTestCaseId(targetIndex);

//       setOutput({
//         status,
//         output: stdout,
//         error: errorDetails,
//         executionTime,
//         testResults: parsedResults,
//         isSubmit: type === "submit",
//         submissionId: dbSubmissionId,
//         note: submissionNote,
//         testCasesWithInputs: testCasesToRun,
//       });

//     } catch (error) {
//       setOutput({
//         status: "INTERNAL_ERROR",
//         error: error instanceof Error ? error.message : "Execution failed",
//       });
//       toast({ title: "Error", description: "Something went wrong during execution.", variant: "destructive" });
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   const renderTestCaseDetail = (index: number) => {
//     if (!output || !output.testResults || !output.testResults[index]) return null;
//     const result = output.testResults[index];
//     const inputs = output.testCasesWithInputs?.[index];

//     return (
//       <div className="space-y-4 font-mono text-sm animate-in fade-in duration-300">
//         {inputs && (
//           <div className="grid gap-1">
//             <span className="text-xs text-muted-foreground">Input</span>
//             <div className="p-3 bg-muted/30 rounded-md border text-xs">
//               {inputs.input.map((inp, i) => (
//                  <div key={i} className="mb-1 last:mb-0">
//                     <span className="text-blue-500 mr-2">{problem.function.params[i]} =</span>
//                     {JSON.stringify(inp)}
//                  </div>
//               ))}
//             </div>
//           </div>
//         )}
//         {/* Output and Expected sections... (Same as previous) */}
//          <div className="grid gap-4">
//           <div className="space-y-1">
//             <span className="text-xs text-muted-foreground">Output</span>
//             <div className={cn(
//               "p-3 rounded-md border text-xs overflow-auto",
//               result.passed
//                 ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400"
//                 : "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400"
//             )}>
//               {JSON.stringify(result.output)}
//             </div>
//           </div>
//           <div className="space-y-1">
//             <span className="text-xs text-muted-foreground">Expected</span>
//             <div className="p-3 bg-muted/30 border text-muted-foreground rounded-md text-xs overflow-auto">
//               {JSON.stringify(result.expected)}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const isCriticalError = (status?: ExecutionStatus) => {
//     return status === "COMPILE_ERROR" || status === "RUNTIME_ERROR" || status === "TLE" || status === "INTERNAL_ERROR";
//   };

//   return (
//     <div className="flex flex-col h-full bg-background border rounded-lg overflow-hidden shadow-sm">
//       {/* --- Toolbar --- */}
//       <div className="flex items-center justify-between p-3 border-b bg-card">
//         <Select value={language} onValueChange={handleLanguageChange}>
//           <SelectTrigger className="w-[160px] h-8 bg-muted/50">
//             <SelectValue placeholder="Language" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="javascript">JavaScript</SelectItem>
//             <SelectItem value="python">Python</SelectItem>
//             <SelectItem value="java">Java</SelectItem>
//             <SelectItem value="cpp">C++</SelectItem>
//           </SelectContent>
//         </Select>

//         <div className="flex gap-2">
//             {/* NOTE POPOVER */}
//             <Popover open={isNoteOpen} onOpenChange={setIsNoteOpen}>
//                 <PopoverTrigger asChild>
//                     <Button variant="ghost" size="sm" className={cn("h-8 text-muted-foreground", submissionNote && "text-blue-500")}>
//                         <FileText className="h-4 w-4 mr-2" />
//                         {submissionNote ? "Edit Note" : "Add Note"}
//                     </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-80">
//                     <div className="grid gap-2">
//                         <h4 className="font-medium leading-none">Submission Note</h4>
//                         <p className="text-sm text-muted-foreground">Add a note to recall your approach later.</p>
//                         <Textarea
//                             value={submissionNote}
//                             onChange={(e) => setSubmissionNote(e.target.value)}
//                             placeholder="e.g., Used sliding window approach O(n)"
//                             className="h-24"
//                         />
//                     </div>
//                 </PopoverContent>
//             </Popover>

//           <Button variant="ghost" size="sm" onClick={handleReset} disabled={isRunning} className="h-8 text-muted-foreground hover:text-foreground">
//             <RotateCcw className="h-4 w-4 mr-2" />
//           </Button>
//           <Button variant="secondary" size="sm" onClick={() => handleRun('run')} disabled={isRunning} className="h-8 bg-muted hover:bg-muted/80">
//             {isRunning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2 fill-current" />}
//             Run
//           </Button>
//           <Button size="sm" onClick={() => handleRun('submit')} disabled={isRunning} className="h-8 bg-green-600 hover:bg-green-700 text-white">
//             {isRunning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
//             Submit
//           </Button>
//         </div>
//       </div>

//       {/* --- Editor Area --- */}
//       <div className="flex-1 relative min-h-0">
//         <Editor
//           height="100%"
//           language={language === "cpp" ? "cpp" : language}
//           value={code}
//           onChange={handleCodeChange}
//           theme={theme === "dark" ? "vs-dark" : "light"}
//           options={{
//             minimap: { enabled: false },
//             fontSize: 14,
//             lineNumbers: "on",
//             automaticLayout: true,
//             tabSize: 2,
//             fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
//             padding: { top: 16, bottom: 16 },
//           }}
//         />
//       </div>

//       {/* --- Resizable Console --- */}
//       <div className={cn(
//         "bg-card border-t transition-all duration-300 ease-in-out flex flex-col",
//         isConsoleOpen ? "h-[350px]" : "h-[40px]"
//       )}>
//         {/* Console Header */}
//         <div className="flex items-center justify-between px-4 h-[40px] bg-muted/30 border-b cursor-pointer" onClick={() => setIsConsoleOpen(!isConsoleOpen)}>
//           <div className="flex gap-4 h-full">
//             <button
//               onClick={(e) => { e.stopPropagation(); setActiveTab('input'); setIsConsoleOpen(true); }}
//               className={cn("text-xs font-medium border-b-2 h-full flex items-center gap-2 px-2 transition-colors",
//                 activeTab === 'input' && !isCriticalError(output?.status) ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
//               )}
//             >
//               <Terminal className="h-3.5 w-3.5" /> Test Cases
//             </button>
//             <button
//               onClick={(e) => { e.stopPropagation(); setActiveTab('output'); setIsConsoleOpen(true); }}
//               className={cn("text-xs font-medium border-b-2 h-full flex items-center gap-2 px-2 transition-colors",
//                 activeTab === 'output' || isCriticalError(output?.status) ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
//               )}
//             >
//                {output && output.status !== "ACCEPTED" && output.status !== "INTERNAL_ERROR" ? (
//                  <AlertTriangle className={cn("h-3.5 w-3.5", isCriticalError(output.status) ? "text-red-500" : "text-yellow-500")} />
//                ) : (
//                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
//                )}
//                {output?.isSubmit ? "Submission Result" : "Test Results"}
//             </button>
//           </div>
//           <div className="flex items-center gap-2 text-muted-foreground">
//              {isConsoleOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
//           </div>
//         </div>

//         {/* Console Content */}
//         {isConsoleOpen && (
//           <div className="flex-1 overflow-hidden p-4 relative">
//             {output && isCriticalError(output.status) ? (
//               // Critical Error View
//               <div className="w-full h-full flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
//                 <div className="flex items-center gap-2 text-red-600 font-semibold text-lg">
//                    <AlertOctagon className="h-5 w-5" />
//                    <span>{output.status.replace("_", " ")}</span>
//                 </div>
//                 <div className="flex-1 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg overflow-auto font-mono text-sm text-red-700">
//                    {output.error}
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {/* INPUT TAB */}
//                 {activeTab === 'input' && (
//                   <div className="h-full flex flex-col">
//                     <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
//                        {/* Test case buttons... */}
//                       {testCases.filter(tc => !tc.isHidden).map((tc, idx) => (
//                           <button
//                             key={idx}
//                             onClick={() => setActiveTestCaseId(idx)}
//                             className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors border", activeTestCaseId === idx ? "bg-secondary" : "bg-muted/50 border-transparent")}
//                           >
//                             Case {idx + 1}
//                           </button>
//                       ))}
//                     </div>
//                     {/* Input display logic... (Simplified for brevity as it was in original) */}
//                     <div className="space-y-3 font-mono text-sm overflow-y-auto">
//                         <div className="p-3 bg-muted/50 rounded-md border text-foreground">
//                             {JSON.stringify(testCases.filter(tc => !tc.isHidden)[activeTestCaseId]?.input)}
//                         </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* OUTPUT TAB */}
//                 {activeTab === 'output' && (
//                   <div className="h-full overflow-y-auto">
//                     {!output ? (
//                       <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
//                         <p>Run your code to see results</p>
//                       </div>
//                     ) : (
//                       <div className="space-y-4">

//                         {/* 1. SUBMISSION RECEIPT (LeetCode Style) */}
//                         {output.isSubmit && (
//                             <div className="border rounded-lg bg-card text-card-foreground shadow-sm mb-4">
//                                 <div className="p-6 flex flex-col gap-4">
//                                     <div className="flex items-center justify-between">
//                                         <div className="flex items-center gap-3">
//                                             {output.status === "ACCEPTED" ? (
//                                                 <CheckCircle2 className="h-8 w-8 text-green-500" />
//                                             ) : (
//                                                 <XCircle className="h-8 w-8 text-red-500" />
//                                             )}
//                                             <div>
//                                                 <h3 className={cn("text-xl font-bold", output.status === "ACCEPTED" ? "text-green-500" : "text-red-500")}>
//                                                     {output.status === "ACCEPTED" ? "Accepted" : output.status.replace("_", " ")}
//                                                 </h3>
//                                                 <p className="text-sm text-muted-foreground">
//                                                     {output.testResults?.filter(t => t.passed).length} / {output.totalTestCases || output.testResults?.length} test cases passed
//                                                 </p>
//                                             </div>
//                                         </div>
//                                         <div className="text-right text-xs text-muted-foreground">
//                                             <div className="flex items-center justify-end gap-1 mb-1">
//                                                 <Clock className="h-3 w-3" /> {output.executionTime} ms
//                                             </div>
//                                             <div>Lang: {language}</div>
//                                         </div>
//                                     </div>

//                                     {/* Note Display */}
//                                     {output.note && (
//                                         <div className="bg-muted/50 p-3 rounded-md text-sm italic text-muted-foreground border border-dashed">
//                                             <span className="font-semibold not-italic text-foreground">Note: </span>
//                                             "{output.note}"
//                                         </div>
//                                     )}

//                                     {/* Submitted Code Preview */}
//                                     <div className="space-y-1">
//                                         <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
//                                             <Code2 className="h-3 w-3" /> Submitted Code
//                                         </div>
//                                         <div className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto max-h-32 opacity-80">
//                                             <pre>{code}</pre>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* 2. ERROR / DETAIL VIEW FOR FAILED SUBMISSION */}
//                         {(output.status !== "ACCEPTED" || !output.isSubmit) && (
//                             <>
//                              {!output.isSubmit && (
//                                 <div className="flex gap-2 mb-4">
//                                     {/* Detailed Run Test Buttons */}
//                                     {output.testResults?.map((res, idx) => (
//                                         <button key={idx} onClick={() => setActiveTestCaseId(idx)} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-md text-xs border", activeTestCaseId === idx ? "bg-background border-primary" : "bg-muted/30 border-transparent")}>
//                                           <div className={cn("h-1.5 w-1.5 rounded-full", res.passed ? "bg-green-500" : "bg-red-500")} />
//                                           Case {res.testNumber}
//                                         </button>
//                                     ))}
//                                 </div>
//                              )}
//                               {renderTestCaseDetail(activeTestCaseId)}
//                             </>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// with create submission as well as add note to submission api with better error display and hanling
// "use client";
// import { useState, useEffect } from "react";
// import Editor from "@monaco-editor/react";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Loader2,
//   Play,
//   RotateCcw,
//   Send,
//   CheckCircle2,
//   XCircle,
//   AlertTriangle,
//   Clock,
//   Terminal,
//   ChevronUp,
//   ChevronDown,
//   AlertOctagon,
//   Code2,
//   Save,
//   PenLine,
//   Beaker,
//   FileCheck,
//   Ban
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import {
//   CppWrapper,
//   JavaScriptWrapper,
//   JavaWrapper,
//   PythonWrapper,
// } from "@/lib/wrappers";
// import { TestCaseI } from "@/models/testcase.model";
// import { ProblemI, StarterCodeI } from "@/models/problem.model";
// import { SubmissionI } from "@/models/submission.model";
// import { apiClient } from "@/lib/apiClient";
// import { cn } from "@/lib/utils";
// import  mongoose from 'mongoose';

// // --- Interfaces ---

// interface EditorPanelProps {
//   problem: ProblemI;
//   theme: string;
//   testCases: TestCaseI[];
//   userId?: string;
// }

// type ExecutionStatus = "ACCEPTED" | "WRONG_ANSWER" | "COMPILE_ERROR" | "RUNTIME_ERROR" | "TLE" | "INTERNAL_ERROR";
// type TabType = "testcase" | "result" | "submission";

// interface ExecutionResult {
//   status: ExecutionStatus;
//   output?: string;
//   error?: string;
//   executionTime?: number;
//   testResults?: Array<{
//     testNumber: number;
//     passed: boolean;
//     output: any;
//     expected: any;
//     error?: string;
//   }>;
//   isSubmit?: boolean;
//   submissionId?: string;
//   note?: string;
//   testCasesWithInputs?: TestCaseI[];
// }

// type CleanTestCase = {
//   input: any[];
//   expected: any;
// };

// // --- Constants & Helpers ---

// const languageMap: Record<string, string> = {
//   javascript: "javascript",
//   typescript: "typescript",
//   python: "python",
//   java: "java",
//   cpp: "cpp",
// };

// const wrapperMap: Record<string, Function> = {
//   javascript: JavaScriptWrapper,
//   python: PythonWrapper,
//   java: JavaWrapper,
//   cpp: CppWrapper,
// };

// const mapStatusToDb = (status: ExecutionStatus): SubmissionI['status'] => {
//     switch(status) {
//         case "ACCEPTED": return "accepted";
//         case "WRONG_ANSWER": return "wrongAnswer";
//         case "RUNTIME_ERROR": return "runtimeError";
//         case "COMPILE_ERROR": return "compileError";
//         case "TLE": return "tle";
//         default: return "runtimeError";
//     }
// };

// function convertTestCases(raw: TestCaseI[]): CleanTestCase[] {
//   return raw.map((tc) => ({ input: tc.input, expected: tc.expected }));
// }

// function parseTestResults(stdout: string, testCases: CleanTestCase[]): Array<any> {
//     const lines = stdout.split('\n').filter(line => line.trim());
//     const results = [];
//     for (const line of lines) {
//       const testMatch = line.match(/Test\s+(\d+):\s+(PASSED|FAILED|ERROR)/i);
//       if (!testMatch) continue;
//       const testNumber = parseInt(testMatch[1]);
//       const status = testMatch[2].toUpperCase();
//       if (status === "ERROR") {
//         const errorMsg = line.split('ERROR')[1]?.replace(/^\s*\|\s*/, '').trim() || "Unknown error";
//         results.push({ testNumber, passed: false, output: null, expected: testCases[testNumber - 1]?.expected || null, error: errorMsg });
//         continue;
//       }
//       const outputMatch = line.match(/Output:\s*(.+?)\s*\|\s*Expected:\s*(.+?)$/i);
//       if (outputMatch) {
//         const outputStr = outputMatch[1].trim();
//         const expectedStr = outputMatch[2].trim();
//         let output, expected;
//         try { output = JSON.parse(outputStr); } catch { output = outputStr; }
//         try { expected = JSON.parse(expectedStr); } catch { expected = expectedStr; }
//         results.push({ testNumber, passed: status === "PASSED", output, expected });
//       }
//     }
//     return results;
// }

// // Helper to determine if we should show the full error view
// const isCriticalError = (status?: ExecutionStatus) => {
//   return ["COMPILE_ERROR", "RUNTIME_ERROR", "TLE", "INTERNAL_ERROR"].includes(status || "");
// };

// // --- Main Component ---

// export function EditorPanel({ problem, testCases, theme, userId }: EditorPanelProps) {
//   const [language, setLanguage] = useState<keyof StarterCodeI>("javascript");
//   const [code, setCode] = useState("");
//   const [output, setOutput] = useState<ExecutionResult | null>(null);
//   const [isRunning, setIsRunning] = useState(false);

//   const [activeTab, setActiveTab] = useState<TabType>("testcase");
//   const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
//   const [isConsoleOpen, setIsConsoleOpen] = useState(true);

//   const [submissionNote, setSubmissionNote] = useState("");
//   const [isSavingNote, setIsSavingNote] = useState(false);
//   const [isCodeExpanded, setIsCodeExpanded] = useState(false);

//   const { toast } = useToast();

//   useEffect(() => {
//     if (problem) {
//       const savedCode = localStorage.getItem(`code-${problem._id}-${language}`);
//       setCode(savedCode || problem.starterCode[language] || "");
//     }
//   }, [problem?._id, language, problem?.starterCode]);

//   useEffect(() => {
//     if (output?.isSubmit) {
//         setSubmissionNote(output.note || "");
//         setIsCodeExpanded(false);
//     }
//   }, [output]);

//   const handleCodeChange = (value: string | undefined) => {
//     if (value !== undefined) {
//       setCode(value);
//       if (problem?._id) localStorage.setItem(`code-${problem._id}-${language}`, value);
//     }
//   };

//   const handleLanguageChange = (newLanguage: string) => {
//     setLanguage(newLanguage as keyof StarterCodeI);
//   };

//   const handleReset = () => {
//     if (problem) {
//       setCode(problem.starterCode[language] || "");
//       localStorage.removeItem(`code-${problem._id}-${language}`);
//       setOutput(null);
//       toast({ title: "Reset", description: "Code reset to default." });
//     }
//   };

//   const handleSaveNote = async () => {
//     if (!output?.submissionId) return;
//     setIsSavingNote(true);
//     try {
//         const res = await apiClient.addOrUpdateSubmissionNote(output.submissionId, submissionNote);
//         if(res.success) {
//             toast({ title: "Success", description: "Note saved.", className: "bg-green-600 text-white" });
//         }
//     } catch (e) {
//         toast({ title: "Error", description: "Could not save note.", variant: "destructive" });
//     } finally {
//         setIsSavingNote(false);
//     }
//   };

//   const handleRun = async (type: "run" | "submit") => {
//     if (!problem) return;
//     setIsRunning(true);
//     setIsConsoleOpen(true);

//     if (type === "run") setActiveTab("result");
//     if (type === "submit") setActiveTab("submission");

//     try {
//       const wrapperFunction = wrapperMap[language];
//       if (!wrapperFunction) throw new Error(`Language ${language} not supported yet.`);

//       const testCasesToRun = type === "submit" ? testCases : testCases.filter((tc) => !tc.isHidden);
//       const cleanTestCases = convertTestCases(testCasesToRun);
//       const fullCode = wrapperFunction(code, problem.function.name, cleanTestCases);
//       const startTime = performance.now();

//       const response = await fetch("https://emkc.org/api/v2/piston/execute", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           language: languageMap[language],
//           version: "*",
//           files: [{ content: fullCode }],
//         }),
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const result = await response.json();
//       const executionTime = Math.round(performance.now() - startTime);

//       let status: ExecutionStatus = "ACCEPTED";
//       let errorDetails = "";
//       let stdout = "";
//       let parsedResults: any[] = [];
//       let dbSubmissionId = "";

//       if (result.compile && result.compile.code !== 0) {
//         status = "COMPILE_ERROR";
//         errorDetails = result.compile.stderr || result.compile.output || "Compilation failed";
//       } else if (result.run && result.run.signal === "SIGKILL") {
//         status = "TLE";
//         errorDetails = "Time Limit Exceeded: The code execution exceeded the allowed time limit.";
//       } else if (result.run && result.run.code !== 0) {
//         status = "RUNTIME_ERROR";
//         errorDetails = result.run.stderr || result.run.output || "Runtime Error";
//       } else if (result.run) {
//         stdout = result.run.stdout || "";
//         parsedResults = parseTestResults(stdout, cleanTestCases);
//         const allPassed = parsedResults.length > 0 && parsedResults.every(t => t.passed);
//         status = allPassed ? "ACCEPTED" : "WRONG_ANSWER";
//       } else {
//         status = "INTERNAL_ERROR";
//         errorDetails = "No result returned from execution engine.";
//       }

//       if (type === "submit") {
//         const lastFailed = parsedResults.find(r => !r.passed);
//         const submissionPayload: Partial<SubmissionI> = {
//             problemId: problem._id as mongoose.Types.ObjectId,
//             userId: userId as any,
//             code: code,
//             language: language,
//             totalTestCases: cleanTestCases.length,
//             passedTestCases: parsedResults.filter(r => r.passed).length,
//             status: mapStatusToDb(status),
//             lastFailedTestCase: lastFailed ? {
//                 input: JSON.stringify(cleanTestCases[lastFailed.testNumber - 1].input),
//                 expectedOutput: JSON.stringify(lastFailed.expected),
//                 actualOutput: JSON.stringify(lastFailed.output),
//                 error: lastFailed.error
//             } : null,
//         };
//         const saveRes = await apiClient.createSubmission(submissionPayload as SubmissionI);
//         if (saveRes.success && saveRes.data) {
//              dbSubmissionId = String(saveRes.data._id);
//         }
//       }

//       let targetIndex = 0;
//       if (type === "submit" && status === "WRONG_ANSWER") {
//         targetIndex = parsedResults.findIndex(r => !r.passed);
//         if (targetIndex === -1) targetIndex = 0;
//       }
//       setActiveTestCaseId(targetIndex);

//       setOutput({
//         status,
//         output: stdout,
//         error: errorDetails,
//         executionTime,
//         testResults: parsedResults,
//         isSubmit: type === "submit",
//         submissionId: dbSubmissionId,
//         testCasesWithInputs: testCasesToRun,
//       });

//     } catch (error) {
//       setOutput({
//         status: "INTERNAL_ERROR",
//         error: error instanceof Error ? error.message : "Execution failed",
//       });
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   const renderErrorView = () => {
//     if (!output || !output.error) return null;
//     return (
//       <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2">
//         <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold">
//           <AlertOctagon className="h-5 w-5" />
//           <span>{output.status.replace("_", " ")}</span>
//         </div>
//         <div className="bg-white dark:bg-black/20 p-3 rounded-md border border-red-100 dark:border-red-900/50 overflow-auto max-h-[250px]">
//            <pre className="text-xs font-mono text-red-700 dark:text-red-300 whitespace-pre-wrap leading-relaxed">
//              {output.error}
//            </pre>
//         </div>
//       </div>
//     );
//   };

//   const renderTestCaseDetail = (index: number) => {
//     if (!output || !output.testResults || !output.testResults[index]) return null;
//     const result = output.testResults[index];
//     const inputs = output.testCasesWithInputs?.[index];

//     return (
//       <div className="space-y-4 font-mono text-sm animate-in fade-in duration-300">
//         {inputs && (
//           <div className="grid gap-1">
//             <span className="text-xs text-muted-foreground">Input</span>
//             <div className="p-3 bg-muted/30 rounded-md border text-xs">
//               {inputs.input.map((inp, i) => (
//                  <div key={i} className="mb-1 last:mb-0">
//                     <span className="text-blue-500 mr-2">{problem.function.params[i]} =</span>
//                     {JSON.stringify(inp)}
//                  </div>
//               ))}
//             </div>
//           </div>
//         )}
//         <div className="grid gap-4">
//           <div className="space-y-1">
//             <span className="text-xs text-muted-foreground">Output</span>
//             <div className={cn("p-3 rounded-md border text-xs overflow-auto", result.passed ? "bg-green-500/10 border-green-500/20 text-green-700" : "bg-red-500/10 border-red-500/20 text-red-700")}>
//               {JSON.stringify(result.output)}
//             </div>
//           </div>
//           <div className="space-y-1">
//             <span className="text-xs text-muted-foreground">Expected</span>
//             <div className="p-3 bg-muted/30 border text-muted-foreground rounded-md text-xs overflow-auto">
//               {JSON.stringify(result.expected)}
//             </div>
//           </div>
//         </div>
//         {result.error && (
//             <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-600 text-xs">
//               {result.error}
//             </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="flex flex-col h-full bg-background border rounded-lg overflow-hidden shadow-sm">
//       {/* --- Toolbar --- */}
//       <div className="flex items-center justify-between p-3 border-b bg-card">
//         <Select value={language} onValueChange={handleLanguageChange}>
//           <SelectTrigger className="w-[160px] h-8 bg-muted/50">
//             <SelectValue placeholder="Language" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="javascript">JavaScript</SelectItem>
//             <SelectItem value="python">Python</SelectItem>
//             <SelectItem value="java">Java</SelectItem>
//             <SelectItem value="cpp">C++</SelectItem>
//           </SelectContent>
//         </Select>

//         <div className="flex gap-2">
//           <Button variant="ghost" size="sm" onClick={handleReset} disabled={isRunning} className="h-8">
//             <RotateCcw className="h-4 w-4 mr-2" />
//           </Button>
//           <Button variant="secondary" size="sm" onClick={() => handleRun('run')} disabled={isRunning} className="h-8">
//             {isRunning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2 fill-current" />} Run
//           </Button>
//           <Button size="sm" onClick={() => handleRun('submit')} disabled={isRunning} className="h-8 bg-green-600 hover:bg-green-700 text-white">
//             {isRunning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />} Submit
//           </Button>
//         </div>
//       </div>

//       {/* --- Editor Area --- */}
//       <div className="flex-1 relative min-h-0">
//         <Editor
//           height="100%"
//           language={language === "cpp" ? "cpp" : language}
//           value={code}
//           onChange={handleCodeChange}
//           theme={theme === "dark" ? "vs-dark" : "light"}
//           options={{
//             minimap: { enabled: false },
//             fontSize: 14,
//             lineNumbers: "on",
//             automaticLayout: true,
//             tabSize: 2,
//             fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
//             padding: { top: 16, bottom: 16 },
//           }}
//         />
//       </div>

//       {/* --- Console --- */}
//       <div className={cn("bg-card border-t transition-all duration-300 ease-in-out flex flex-col", isConsoleOpen ? "h-[450px]" : "h-[40px]")}>
//         {/* Console Tabs Header */}
//         <div className="flex items-center justify-between px-4 h-[40px] bg-muted/30 border-b cursor-pointer" onClick={() => setIsConsoleOpen(!isConsoleOpen)}>
//           <div className="flex gap-4 h-full">
//             <button
//                 onClick={(e) => { e.stopPropagation(); setActiveTab('testcase'); setIsConsoleOpen(true); }}
//                 className={cn("text-xs font-medium border-b-2 h-full flex items-center gap-2 px-2 transition-colors", activeTab === 'testcase' ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
//             >
//               <Terminal className="h-3.5 w-3.5" /> Test Cases
//             </button>
//             <button
//                 onClick={(e) => { e.stopPropagation(); setActiveTab('result'); setIsConsoleOpen(true); }}
//                 className={cn("text-xs font-medium border-b-2 h-full flex items-center gap-2 px-2 transition-colors", activeTab === 'result' ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
//             >
//                <Beaker className="h-3.5 w-3.5" /> Test Result
//             </button>
//             <button
//                 onClick={(e) => { e.stopPropagation(); setActiveTab('submission'); setIsConsoleOpen(true); }}
//                 className={cn("text-xs font-medium border-b-2 h-full flex items-center gap-2 px-2 transition-colors", activeTab === 'submission' ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
//             >
//                <FileCheck className="h-3.5 w-3.5" /> Submission Result
//             </button>
//           </div>
//           <div className="flex items-center gap-2 text-muted-foreground">
//              {isConsoleOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
//           </div>
//         </div>

//         {/* Console Body */}
//         {isConsoleOpen && (
//           <div className="flex-1 overflow-hidden p-4 relative">

//              {/* TAB 1: TEST CASES */}
//              {activeTab === 'testcase' && (
//                 <div className="h-full flex flex-col">
//                   <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
//                     {testCases.filter(tc => !tc.isHidden).map((tc, idx) => (
//                         <button key={idx} onClick={() => setActiveTestCaseId(idx)} className={cn("px-3 py-1.5 rounded-md text-xs font-medium border transition-colors", activeTestCaseId === idx ? "bg-secondary text-foreground" : "bg-muted/50 border-transparent text-muted-foreground")}>
//                             Case {idx + 1}
//                         </button>
//                     ))}
//                   </div>
//                   <div className="space-y-3 font-mono text-sm overflow-y-auto">
//                     {(() => {
//                         const tc = testCases.filter(tc => !tc.isHidden)[activeTestCaseId];
//                         if(!tc) return <div className="text-muted-foreground">No test case selected</div>;

//                         return tc.input.map((val, i) => (
//                             <div key={i} className="space-y-1">
//                                 <div className="text-xs text-muted-foreground">{problem.function.params[i]} =</div>
//                                 <div className="p-3 bg-muted/50 rounded-md border text-foreground">{JSON.stringify(val)}</div>
//                             </div>
//                         ));
//                     })()}
//                   </div>
//                 </div>
//               )}

//              {/* TAB 2: TEST RESULT (RUN) */}
//              {activeTab === 'result' && (
//                 <div className="h-full overflow-y-auto">
//                    {!output || output.isSubmit ? (
//                       <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
//                         <Play className="h-8 w-8 opacity-20" />
//                         <p>Run your code to see results here</p>
//                       </div>
//                    ) : (
//                       <div className="space-y-4">
//                          {isCriticalError(output.status) ? (
//                              /* CRITICAL ERROR VIEW */
//                              renderErrorView()
//                          ) : (
//                              /* STANDARD RESULT VIEW */
//                              <>
//                                  <div className="flex items-center gap-3">
//                                     <span className={cn("text-lg font-semibold", output.status === "ACCEPTED" ? "text-green-500" : "text-red-500")}>
//                                         {output.status.replace("_", " ")}
//                                     </span>
//                                     {output.executionTime && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/> {output.executionTime}ms</span>}
//                                  </div>
//                                  <div className="flex gap-2 mb-4">
//                                     {output.testResults?.map((res, idx) => (
//                                         <button key={idx} onClick={() => setActiveTestCaseId(idx)} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-md text-xs border transition-colors", activeTestCaseId === idx ? "bg-background border-primary" : "bg-muted/30 border-transparent")}>
//                                           <div className={cn("h-1.5 w-1.5 rounded-full", res.passed ? "bg-green-500" : "bg-red-500")} />
//                                           Case {res.testNumber}
//                                         </button>
//                                     ))}
//                                  </div>
//                                  {renderTestCaseDetail(activeTestCaseId)}
//                              </>
//                          )}
//                       </div>
//                    )}
//                 </div>
//              )}

//              {/* TAB 3: SUBMISSION RESULT */}
//              {activeTab === 'submission' && (
//                 <div className="h-full overflow-y-auto pr-2">
//                    {!output || !output.isSubmit ? (
//                       <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
//                         <Send className="h-8 w-8 opacity-20" />
//                         <p>Submit your code to see submission details</p>
//                       </div>
//                    ) : (
//                       <div className="space-y-6 pb-10">

//                          {/* Status Header */}
//                          <div className="flex items-center gap-4">
//                              {/* Show different icon based on status */}
//                             {isCriticalError(output.status) ? (
//                                 <AlertOctagon className="h-6 w-6 text-red-500" />
//                             ) : output.status === "ACCEPTED" ? (
//                                 <CheckCircle2 className="h-6 w-6 text-green-500" />
//                             ) : (
//                                 <XCircle className="h-6 w-6 text-red-500" />
//                             )}

//                             <h3 className={cn("text-xl font-bold",
//                                 output.status === "ACCEPTED" ? "text-green-500" : "text-red-500"
//                             )}>
//                                 {output.status === "ACCEPTED" ? "Accepted" : output.status.replace("_", " ")}
//                             </h3>
//                             {output.executionTime && <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full flex items-center gap-1"><Clock className="h-3 w-3"/> {output.executionTime}ms</span>}
//                          </div>

//                          {/* Stats or Critical Error */}
//                          {isCriticalError(output.status) ? (
//                              renderErrorView()
//                          ) : (
//                              <div className="text-sm text-muted-foreground">
//                                 {output.testResults?.filter(t => t.passed).length} / {output.testResults?.length} test cases passed
//                              </div>
//                          )}

//                          {/* Expandable Code Block */}
//                          <div className="rounded-lg border bg-zinc-950/80 overflow-hidden shadow-sm group">
//                             <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800">
//                                 <span className="text-xs text-muted-foreground font-mono flex items-center gap-2">
//                                     <Code2 className="h-3 w-3" /> Code | {language}
//                                 </span>
//                             </div>
//                             <div className="relative">
//                                 <pre className={cn("p-4 font-mono text-xs md:text-sm text-zinc-300 overflow-hidden transition-all duration-300", !isCodeExpanded ? "max-h-[100px]" : "h-auto")}>
//                                     {code.split('\n').map((line, i) => (
//                                         <div key={i} className="table-row">
//                                             <span className="table-cell select-none text-zinc-600 text-right pr-4 w-8">{i+1}</span>
//                                             <span className="table-cell whitespace-pre-wrap">{line}</span>
//                                         </div>
//                                     ))}
//                                 </pre>
//                                 {!isCodeExpanded && <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />}
//                                 <div className={cn("absolute bottom-0 left-0 w-full flex justify-center pb-2 pt-8", !isCodeExpanded && "bg-gradient-to-t from-zinc-950 to-transparent")}>
//                                     <button onClick={() => setIsCodeExpanded(!isCodeExpanded)} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 backdrop-blur-sm px-3 py-1 rounded-full transition-colors border border-zinc-700">
//                                         {isCodeExpanded ? "Show less" : "View more"} {isCodeExpanded ? <ChevronUp className="h-3 w-3"/> : <ChevronDown className="h-3 w-3"/>}
//                                     </button>
//                                 </div>
//                             </div>
//                          </div>

//                          {/* Note Section */}
//                          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
//                             <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
//                                 <PenLine className="h-4 w-4" /> Notes
//                             </div>
//                             <div className="flex flex-col gap-2">
//                                 <Textarea
//                                     placeholder="Add a note (e.g., Time complexity O(n))..."
//                                     value={submissionNote}
//                                     onChange={(e) => setSubmissionNote(e.target.value)}
//                                     className="min-h-[80px] text-sm resize-none bg-muted/20 focus:bg-background"
//                                 />
//                                 <div className="flex justify-end">
//                                     <Button size="sm" onClick={handleSaveNote} disabled={isSavingNote} className="h-8">
//                                         {isSavingNote ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Save className="h-3 w-3 mr-2" />} Save Note
//                                     </Button>
//                                 </div>
//                             </div>
//                          </div>

//                          {/* Failed Case (If not critical error but logic wrong) */}
//                          {output.status === "WRONG_ANSWER" && (
//                             <div className="mt-4 pt-4 border-t">
//                                 <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-red-500">
//                                     <AlertTriangle className="h-4 w-4"/> Last Failed Case
//                                 </h4>
//                                 {renderTestCaseDetail(activeTestCaseId)}
//                             </div>
//                          )}
//                       </div>
//                    )}
//                 </div>
//              )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play, Send, Clock } from "lucide-react"; // Only simple icons needed here
import {
  CppWrapper,
  JavaScriptWrapper,
  JavaWrapper,
  PythonWrapper,
} from "@/lib/wrappers";
import { TestCaseI } from "@/models/testcase.model";
import { ProblemI, StarterCodeI } from "@/models/problem.model";
import { SubmissionI } from "@/models/submission.model";
import { apiClient } from "@/lib/apiClient";
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
const wrapperMap: Record<string, Function> = {
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
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("testcase");
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  const {data:session} =  useSession()
  const router = useRouter()

  useEffect(() => {
    if (problem) {
      const savedCode = localStorage.getItem(`code-${problem._id}-${language}`);
      setCode(savedCode || problem.starterCode[language] || "");
    }
  }, [problem?._id, language, problem?.starterCode]);

  const handleRunOrSubmit = async (type: "run" | "submit") => {
    if (!problem) return;
    setIsRunning(true);
    setIsConsoleOpen(true);
    setActiveTab(type === "run" ? "result" : "submission");
    if(type == "submit" && (!session || !session?.user.id) ) {
      router.push("/a/login")
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
      let parsedResults: any[] = [];
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
        // ... (Parsing logic similar to previous - kept inline for brevity in this view, could be util)
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
          userId: userId as any ,
          code,
          language,
          totalTestCases: cleanTestCases.length,
          passedTestCases: parsedResults.filter((r) => r.passed).length,
          status: mapStatusToDb(status),
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
        console.log(saveRes)
        if (saveRes.success && saveRes.data)
          dbSubmissionId = String(saveRes.data._id);
      }

      setOutput({
        status,
        output: result.run?.stdout,
        error: errorDetails,
        executionTime,
        testResults: parsedResults,
        isSubmit: type === "submit",
        submissionId: dbSubmissionId,
        testCasesWithInputs: testCasesToRun,
      });
    } catch (error) {
      setOutput({
        status: "INTERNAL_ERROR",
        error: error instanceof Error ? error.message : "Execution failed",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border rounded-lg overflow-hidden shadow-sm">
      {/* 1. Toolbar */}
      <EditorToolbar
        language={language}
        setLanguage={(l) => setLanguage(l as any)}
        isRunning={isRunning}
        onRun={() => handleRunOrSubmit("run")}
        onSubmit={() => handleRunOrSubmit("submit")}
        onReset={() => {
          setCode(problem.starterCode[language]);
          setOutput(null);
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
          isConsoleOpen ? "h-[450px]" : "h-[40px]"
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
                {!output || output.isSubmit ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Play className="h-8 w-8 opacity-20" />
                    <p>Run your code to see results here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {isCriticalError(output.status) ? (
                      <ErrorView
                        error={output.error || ""}
                        title={output.status}
                      />
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "text-lg font-semibold",
                              output.status === "ACCEPTED"
                                ? "text-green-500"
                                : "text-red-500"
                            )}
                          >
                            {output.status.replace("_", " ")}
                          </span>
                          {output.executionTime && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />{" "}
                              {output.executionTime}ms
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 mb-4">
                          {output.testResults?.map((res, idx) => (
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
                          result={output.testResults?.[activeTestCaseId]}
                          inputs={
                            output.testCasesWithInputs?.[activeTestCaseId]
                          }
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
                {!output || !output.isSubmit ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Send className="h-8 w-8 opacity-20" />
                    <p>Submit your code to see submission details</p>
                  </div>
                ) : (
                  <SubmissionTab
                    output={output}
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

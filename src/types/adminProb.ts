export interface ExampleI {
  input: string;
  output: string;
  explanation?: string;
}

export interface StarterCodeI {
  javascript: string;
  typescript: string;
  python: string;
  java: string;
  cpp: string;
  c: string;
  csharp: string;
  go: string;
  rust: string;
  ruby: string;
  php: string;
  swift: string;
  kotlin: string;
}

export interface FunctionI {
  name: string;
  params: string[];
}

export interface ProblemI {
  problemId: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  function: FunctionI;
  description: string;
  examples: ExampleI[];
  constraints: string[];
  starterCode: StarterCodeI;
  createdAt?: string;
}

export interface TestCaseI {
  id: string;
  problemId: string;
  input: unknown[];
  expected: unknown;
  isHidden: boolean;
}

export type Difficulty = "Easy" | "Medium" | "Hard";

export const SUPPORTED_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "c",
  "csharp",
  "go",
  "rust",
  "ruby",
  "php",
  "swift",
  "kotlin",
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
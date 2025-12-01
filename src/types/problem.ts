export interface Problem {
  id: string;
  title: string;
  function: {name: string, params: string[]};
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  examples: Example[];
  constraints: string[];
  starterCode: Record<string, string>;
  topics: string[];
  status?: "Not Started" | "Attempted" | "Solved";
  testCases?: TestCase[]
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}


export interface TestCase {
    input: any;
    expected: unknown;
}
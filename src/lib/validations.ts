import { z } from "zod";

export const ExampleSchema = z.object({
  input: z.string().min(1, "Input is required"),
  output: z.string().min(1, "Output is required"),
  explanation: z.string().optional(),
});

export const StarterCodeSchema = z.object({
  javascript: z.string(),
  typescript: z.string(),
  python: z.string(),
  java: z.string(),
  cpp: z.string(),
  c: z.string(),
  csharp: z.string(),
  go: z.string(),
  rust: z.string(),
  ruby: z.string(),
  php: z.string(),
  swift: z.string(),
  kotlin: z.string(),
});

export const ProblemSchema = z.object({
  problemId: z.string().min(1, "Problem ID is required"),
  title: z.string().min(1, "Title is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  topics: z.array(z.string()).min(1, "At least one topic is required"),
  function: z.object({
    name: z.string().min(1, "Function name is required"),
    params: z.array(z.string()),
  }),
  description: z.string().min(1, "Description is required"),
  examples: z.array(ExampleSchema).min(1, "At least one example is required"),
  constraints: z.array(z.string()).min(1, "At least one constraint is required"),
  starterCode: StarterCodeSchema,
});

export const TestCaseSchema = z.object({
  input: z.array(z.any()).min(1, "Input arguments are required"),
  expected: z.any(),
  isHidden: z.boolean().default(false),
});

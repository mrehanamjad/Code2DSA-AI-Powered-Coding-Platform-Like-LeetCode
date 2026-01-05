// In your main application file (e.g., index.ts)
import { OpenAI } from "openai";
import { OpenAIChatCompletionsModel, Agent, Runner } from "@openai/agents";
// import * as dotenv from 'dotenv';

// Load environment variables
// dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY environment variable not set.");
}

const openaiClient = new OpenAI({
  apiKey: geminiApiKey,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const model = new OpenAIChatCompletionsModel(
  openaiClient,
  "gemini-2.5-flash" // Use a Gemini model name
);

const agent = new Agent({
  name: "GeminiHelper",
  instructions:
    "You are a helpful assistant that answers questions accurately.",
  model: model,
});

const runner = new Runner({
  tracingDisabled: false,
});

interface AICodeAnalyzerI {
  tc: string;
  sc: string;
  codeRating: string;
  bugs: string[];
  opt: string[];
  msg: string;
}
export async function aiCodeAnalyzer(code:string,problemStatement:string,language:string): Promise<AICodeAnalyzerI> {
  const prompt = `Analyze ${language} code. Return ONLY JSON.
Schema: {"tc":"BigO","sc":"BigO","codeRating":"10/100","bugs":[str],"opt":[str],"msg":str}
Problem: ${problemStatement}
Code: ${code}`;

  const result = await runner.run(
    agent,
    prompt    
);

  const outputText = result.finalOutput?.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim() as string;
  const outputJson = JSON.parse(outputText);

    return outputJson;
}





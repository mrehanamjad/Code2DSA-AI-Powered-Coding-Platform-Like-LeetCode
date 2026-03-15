import { StarterCodeI, SupportedLanguage } from "@/types/adminProb";

/**
 * Generates starter code templates for all supported languages
 * based on the function name and parameters
 */
export function generateStarterCode(functionName: string, params: string[]): StarterCodeI {
  const cleanParams = params.filter(p => p.trim() !== "");
  const paramsStr = cleanParams.join(", ");
  const fn = functionName || "solution";

  return {
    javascript: `function ${fn}(${paramsStr}) {\n  // Your code here\n}`,
    typescript: `function ${fn}(${paramsStr}): void {\n  // Your code here\n}`,
    python: `def ${fn}(${cleanParams.map(p => p.replace(/\s+/g, "_")).join(", ")}):\n    # Your code here\n    pass`,
    java: `class Solution {\n    public void ${fn}(${cleanParams.map(p => `Object ${p}`).join(", ")}) {\n        // Your code here\n    }\n}`,
    cpp: `class Solution {\npublic:\n    void ${fn}(${cleanParams.map(p => `auto ${p}`).join(", ")}) {\n        // Your code here\n    }\n};`,
    c: `void ${fn}(${cleanParams.map(p => `void* ${p}`).join(", ") || "void"}) {\n    // Your code here\n}`,
    csharp: `public class Solution {\n    public void ${fn}(${cleanParams.map(p => `object ${p}`).join(", ")}) {\n        // Your code here\n    }\n}`,
    go: `func ${fn}(${cleanParams.map(p => `${p} interface{}`).join(", ")}) {\n    // Your code here\n}`,
    rust: `impl Solution {\n    pub fn ${fn.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}(${cleanParams.map(p => `${p}: T`).join(", ")}) {\n        // Your code here\n    }\n}`,
    ruby: `def ${fn.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}(${paramsStr})\n    # Your code here\nend`,
    php: `function ${fn}(${cleanParams.map(p => `$${p}`).join(", ")}) {\n    // Your code here\n}`,
    swift: `class Solution {\n    func ${fn}(${cleanParams.map(p => `_ ${p}: Any`).join(", ")}) {\n        // Your code here\n    }\n}`,
    kotlin: `class Solution {\n    fun ${fn}(${cleanParams.map(p => `${p}: Any`).join(", ")}) {\n        // Your code here\n    }\n}`,
  };
}

/**
 * Returns the default starter code with generic "solution" function
 */
export function getDefaultStarterCode(): StarterCodeI {
  return generateStarterCode("solution", []);
}

export const languageLabels: Record<SupportedLanguage, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
  c: "C",
  csharp: "C#",
  go: "Go",
  rust: "Rust",
  ruby: "Ruby",
  php: "PHP",
  swift: "Swift",
  kotlin: "Kotlin",
};

export const JavaScriptWrapper = (
  userCode: string,
  functionName: string,
  testCases: Array<{ input: unknown[]; expected: unknown }>
) => {
  return `
${userCode}

// Deep comparison function
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (let key of keysA) {
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}

const testCases = ${JSON.stringify(testCases)};

for (let i = 0; i < testCases.length; i++) {
  const { input, expected } = testCases[i];
  try {
    const result = ${functionName}(...input);
    const passed = deepEqual(result, expected);
    console.log("Test " + (i + 1) + ": " + (passed ? "PASSED" : "FAILED") + " | Output:", JSON.stringify(result), "| Expected:", JSON.stringify(expected));
  } catch (err) {
    console.log("Test " + (i + 1) + ": ERROR | " + err.message);
  }
}
`;
};

export const PythonWrapper = (
  userCode: string,
  functionName: string,
  testCases: Array<{ input: unknown[]; expected: unknown }>
) => {
  // Helper function to convert JS values to Python values
  const toPythonValue = (value: unknown): string => {
    if (value === null) return "None";
    if (value === true) return "True";
    if (value === false) return "False";
    if (typeof value === "string") return JSON.stringify(value);
    if (Array.isArray(value)) {
      return `[${value.map(v => toPythonValue(v)).join(", ")}]`;
    }
    if (typeof value === "object") {
      const entries = Object.entries(value).map(([k, v]) => `"${k}": ${toPythonValue(v)}`);
      return `{${entries.join(", ")}}`;
    }
    return String(value);
  };

  const testCode = testCases
    .map((tc, i) => {
      const args = tc.input.map((inp) => toPythonValue(inp)).join(", ");
      const expectedValue = toPythonValue(tc.expected);
      
      return `
# Test ${i + 1}
try:
    result = ${functionName}(${args})
    expected = ${expectedValue}
    passed = result == expected
    status = "PASSED" if passed else "FAILED"
    print(f"Test ${i + 1}: {status} | Output: {result} | Expected: {expected}")
except Exception as e:
    print(f"Test ${i + 1}: ERROR | {str(e)}")
`;
    })
    .join("\n");

  return `
import json
${userCode}

if __name__ == "__main__":
${testCode
  .split("\n")
  .map((line) => "    " + line)
  .join("\n")}
`;
};

export const JavaWrapper = (
  userCode: string,
  functionName: string,
  testCases:Array<{ input: unknown[]; expected: unknown }>
) => {
  // Remove class declaration and closing brace more carefully
  let finalUserCode = userCode.trim();
  
  // Remove class Solution { if present
  finalUserCode = finalUserCode.replace(/^\s*(?:public\s+)?class\s+Solution\s*\{\s*/m, "");
  
  // Remove the final closing brace
  finalUserCode = finalUserCode.replace(/\}\s*$/, "").trim();

  const testCode = testCases
    .map((tc, i) => {
      const args = tc.input
        .map((v) => {
          if (typeof v === "string") {
            return `"${v.replace(/"/g, '\\"')}"`;
          } else if (Array.isArray(v)) {
            return `new int[]{${v.join(", ")}}`;
          } else {
            return String(v);
          }
        })
        .join(", ");

      const expectedValue = tc.expected;
      const expectedCode = Array.isArray(expectedValue)
        ? `new int[]{${expectedValue.join(", ")}}`
        : typeof expectedValue === "string"
        ? `"${expectedValue}"`
        : String(expectedValue);

      return `
        // Test ${i + 1}
        try {
            Object result = new Solution().${functionName}(${args});
            Object expected = ${expectedCode};
            boolean passed = compareResults(result, expected);
            String status = passed ? "PASSED" : "FAILED";
            System.out.println("Test ${i + 1}: " + status + " | Output: " + formatResult(result) + " | Expected: " + formatResult(expected));
        } catch (Exception e) {
            System.out.println("Test ${i + 1}: ERROR | " + e.getMessage());
        }
      `;
    })
    .join("\n");

  return `
import java.util.*;
import java.io.*;
import java.math.*;
import java.util.stream.*;

public class Solution {
${finalUserCode}

    // Helper method to compare results
    private static boolean compareResults(Object result, Object expected) {
        if (result == null && expected == null) return true;
        if (result == null || expected == null) return false;
        
        if (result instanceof int[] && expected instanceof int[]) {
            return Arrays.equals((int[])result, (int[])expected);
        } else if (result instanceof long[] && expected instanceof long[]) {
            return Arrays.equals((long[])result, (long[])expected);
        } else if (result instanceof double[] && expected instanceof double[]) {
            return Arrays.equals((double[])result, (double[])expected);
        } else if (result instanceof String[] && expected instanceof String[]) {
            return Arrays.equals((String[])result, (String[])expected);
        } else if (result instanceof Object[] && expected instanceof Object[]) {
            return Arrays.deepEquals((Object[])result, (Object[])expected);
        } else {
            return result.equals(expected) || result.toString().equals(expected.toString());
        }
    }
    
    // Helper method to format results for display
    private static String formatResult(Object result) {
        if (result == null) return "null";
        if (result instanceof int[]) {
            return Arrays.toString((int[])result);
        } else if (result instanceof long[]) {
            return Arrays.toString((long[])result);
        } else if (result instanceof double[]) {
            return Arrays.toString((double[])result);
        } else if (result instanceof String[]) {
            return Arrays.toString((String[])result);
        } else if (result instanceof Object[]) {
            return Arrays.deepToString((Object[])result);
        } else {
            return result.toString();
        }
    }

    public static void main(String[] args) {
${testCode}
    }
}
`;
};

export const CppWrapper = (
  userCode: string,
  functionName: string,
  testCases:Array<{ input: unknown[]; expected: unknown }>
) => {
  // Clean up the user code - remove class declaration if present
  let finalUserCode = userCode.trim();
  
  // Remove class Solution { public: if present
  finalUserCode = finalUserCode.replace(/^\s*class\s+Solution\s*\{\s*(?:public:)?\s*/m, "");
  
  // Remove the final closing brace(s)
  finalUserCode = finalUserCode.replace(/\}\s*;?\s*$/, "").trim();

  const testCode = testCases
    .map((tc, testIdx) => {
      const inputVars = tc.input
        .map((v, argIdx) => {
          if (Array.isArray(v)) {
            return `    vector<int> arg${testIdx}_${argIdx} = {${v.join(", ")}};`;
          } else if (typeof v === "string") {
            return `    string arg${testIdx}_${argIdx} = "${v.replace(/"/g, '\\"')}";`;
          } else {
            return `    auto arg${testIdx}_${argIdx} = ${v};`;
          }
        })
        .join("\n");

      const args = tc.input.map((_, argIdx) => `arg${testIdx}_${argIdx}`).join(", ");
      
      // Create expected value variable
      let expectedVar = "";
      const exp = tc.expected;
      if (Array.isArray(exp)) {
        if (exp.length > 0 && Array.isArray(exp[0])) {
          // 2D array
          expectedVar = `    vector<vector<int>> expected${testIdx} = {${exp.map(arr => `{${arr.join(",")}}`).join(",")}};`;
        } else {
          // 1D array
          expectedVar = `    vector<int> expected${testIdx} = {${exp.join(",")}};`;
        }
      } else if (typeof exp === "string") {
        expectedVar = `    string expected${testIdx} = "${exp}";`;
      } else {
        expectedVar = `    auto expected${testIdx} = ${exp};`;
      }

      return `
    // Test ${testIdx + 1}
    {
${inputVars}
${expectedVar}
        try {
            auto result = obj.${functionName}(${args});
            bool passed = isEqual(result, expected${testIdx});
            string status = passed ? "PASSED" : "FAILED";
            cout << "Test ${testIdx + 1}: " << status << " | Output: ";
            printResult(result);
            cout << " | Expected: ";
            printResult(expected${testIdx});
            cout << endl;
        } catch (exception& e) {
            cout << "Test ${testIdx + 1}: ERROR | " << e.what() << endl;
        } catch (...) {
            cout << "Test ${testIdx + 1}: ERROR | Unknown error" << endl;
        }
    }
`;
    })
    .join("\n");

  return `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
${finalUserCode}
};

// Helper functions to print results
template <typename T>
void printResult(const T& result) {
    cout << result;
}

template <typename T>
void printResult(const vector<T>& result) {
    cout << "[";
    for (size_t i = 0; i < result.size(); ++i) {
        cout << result[i];
        if (i + 1 < result.size()) cout << ",";
    }
    cout << "]";
}

void printResult(const vector<vector<int>>& result) {
    cout << "[";
    for (size_t i = 0; i < result.size(); ++i) {
        cout << "[";
        for (size_t j = 0; j < result[i].size(); ++j) {
            cout << result[i][j];
            if (j + 1 < result[i].size()) cout << ",";
        }
        cout << "]";
        if (i + 1 < result.size()) cout << ",";
    }
    cout << "]";
}

// Helper functions to check equality
template <typename T>
bool isEqual(const T& a, const T& b) {
    return a == b;
}

template <typename T>
bool isEqual(const vector<T>& a, const vector<T>& b) {
    if (a.size() != b.size()) return false;
    for (size_t i = 0; i < a.size(); ++i) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

bool isEqual(const vector<vector<int>>& a, const vector<vector<int>>& b) {
    if (a.size() != b.size()) return false;
    for (size_t i = 0; i < a.size(); ++i) {
        if (a[i].size() != b[i].size()) return false;
        for (size_t j = 0; j < a[i].size(); ++j) {
            if (a[i][j] != b[i][j]) return false;
        }
    }
    return true;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    Solution obj;
${testCode}

    return 0;
}
`;
};
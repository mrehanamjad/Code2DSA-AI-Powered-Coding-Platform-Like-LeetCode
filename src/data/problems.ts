import { Problem } from "@/types/problem";

export const problems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Array", "Hash Table"],
    status: "Not Started",
    function: { name: "twoSum", params: ["nums", "target"] },
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10⁴",
      "-10⁹ <= nums[i] <= 10⁹",
      "-10⁹ <= target <= 10⁹",
      "Only one valid answer exists.",
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your code here
    
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
    // Write your code here
    
}`,
      python: `def twoSum(nums, target):
    # Write your code here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
    }
};`,
      c: `#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Write your code here
    
}`,
      csharp: `public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`,
      go: `func twoSum(nums []int, target int) []int {
    // Write your code here
    
}`,
      rust: `impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        // Write your code here
        
    }
}`,
      ruby: `def two_sum(nums, target)
    # Write your code here
    
end`,
      php: `<?php
function twoSum($nums, $target) {
    // Write your code here
    
}`,
      swift: `class Solution {
    func twoSum(_ nums: [Int], _ target: Int) -> [Int] {
        // Write your code here
        
    }
}`,
      kotlin: `class Solution {
    fun twoSum(nums: IntArray, target: Int): IntArray {
        // Write your code here
        
    }
}`,
    },
    testCases: [
      {
        input: [[2, 7, 11, 15], 9],
        expected: [0, 1],
      },
      {
        input: [[3, 2, 4], 6],
        expected: [1, 2],
      },
      {
        input: [[3, 3], 6],
        expected: [0, 1],
      },
      {
        input: [[1, 5, 9, 15], 10],
        expected: [0, 2],
      },
      {
        input: [[-1, -2, -3, -4, -5], -8],
        expected: [2, 4],
      },
      {
        input: [[10, 20, 30, 40], 50],
        expected: [1, 2],
      },
      {
        input: [[0, 4, 3, 0], 0],
        expected: [0, 3],
      },
      {
        input: [[-5, 4, 2, 9, 1], 4],
        expected: [0, 3],
      },
      {
        input: [[500000, 500000], 1000000],
        expected: [0, 1],
      },
      {
        input: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 18],
        expected: [7, 9],
      },
      {
        input: [[1, 999999999, 5, 999999998, 2, 8, 1000000000], 1000000000],
        expected: [0, 1],
      },
      {
        input: [[1000000, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 999999], 1000000],
        expected: [1, 11],
      },
    ],
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topics: ["Array", "Dynamic Programming"],
    status: "Not Started",
    function: { name: "maxProfit", params: ["prices"] },
    description:
      "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day. You want to maximize your profit by choosing **exactly one day to buy** and **exactly one day to sell** the stock. Return the maximum profit you can achieve. If you cannot achieve any profit, return 0.",
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation:
          "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "No transaction is done, so profit = 0.",
      },
    ],
    constraints: ["1 <= prices.length <= 10⁵", "0 <= prices[i] <= 10⁴"],
    starterCode: {
      javascript:
        "function maxProfit(prices) {\n    // Write your code here\n}",
      typescript:
        "function maxProfit(prices: number[]): number {\n    // Write your code here\n}",
      python: "def maxProfit(prices):\n    # Write your code here\n    pass",
      java: "class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your code here\n    }\n}",
      cpp: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your code here\n    }\n};",
      c: "#include <stdlib.h>\n\nint maxProfit(int* prices, int pricesSize) {\n    // Write your code here\n}",
      csharp:
        "public class Solution {\n    public int MaxProfit(int[] prices) {\n        // Write your code here\n    }\n}",
      go: "func maxProfit(prices []int) int {\n    // Write your code here\n}",
      rust: "impl Solution {\n    pub fn max_profit(prices: Vec<i32>) -> i32 {\n        // Write your code here\n    }\n}",
      ruby: "def max_profit(prices)\n    # Write your code here\nend",
      php: "<?php\nfunction maxProfit($prices) {\n    // Write your code here\n}",
      swift:
        "class Solution {\n    func maxProfit(_ prices: [Int]) -> Int {\n        // Write your code here\n    }\n}",
      kotlin:
        "class Solution {\n    fun maxProfit(prices: IntArray): Int {\n        // Write your code here\n    }\n}",
    },
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { input: [[7, 6, 4, 3, 1]], expected: 0 },
      { input: [[1, 2, 3, 4, 5]], expected: 4 },
      { input: [[3, 3, 5, 0, 0, 3, 1, 4]], expected: 4 },
      { input: [[1]], expected: 0 },
      { input: [[2, 1, 2, 1, 0, 1, 2]], expected: 2 },
      { input: [[5, 4, 3, 2, 1, 6]], expected: 5 },
      { input: [[3, 1, 4, 8, 7, 2, 5]], expected: 7 },
    ],
  },
  // ...
];

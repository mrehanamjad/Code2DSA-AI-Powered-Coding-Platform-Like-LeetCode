"use client";

import { Card } from "@/components/ui/card";
import { CircleDot, Dot } from "lucide-react";

type Skill = {
  name: string;
  questionSolved: number;
};

type CategorizedSkills = {
  foundational: Skill[];
  intermediate: Skill[];
  advanced: Skill[];
};

function categorizeSkillsByName(skills: Skill[]): CategorizedSkills {
  const foundationalTopics = [
    "Array",
    "String",
    "Two Pointers",
    "Sorting",
    "Searching",
    "Stack",
    "Queue",
    "Matrix",
  ];
  const intermediateTopics = [
    "Hash Table",
    "Math",
    "Recursion",
    "Sliding Window",
    "Greedy",
    "Linked List",
    "Binary Search",
  ];
  const advancedTopics = [
    "Dynamic Programming",
    "Divide and Conquer",
    "Graph",
    "Backtracking",
    "Trie",
    "Segment Tree",
  ];

  const categories: CategorizedSkills = {
    foundational: [],
    intermediate: [],
    advanced: [],
  };

  for (const skill of skills) {
    const name = skill.name;

    if (advancedTopics.includes(name)) {
      categories.advanced.push(skill);
    } else if (intermediateTopics.includes(name)) {
      categories.intermediate.push(skill);
    } else if (foundationalTopics.includes(name)) {
      categories.foundational.push(skill);
    } else {
      // If topic is unknown, you can put it in foundational by default
      categories.foundational.push(skill);
    }
  }

  return categories;
}

const languages = [
  { name: "Python", questioSolved: 20 },
  { name: "Java", questioSolved: 2 },
];

const skills = [
  { name: "Array", questionSolved: 6 },
  { name: "String", questionSolved: 2 },
  { name: "Hash Table", questionSolved: 4 },
  { name: "Linked List", questionSolved: 3 },
  { name: "Stack", questionSolved: 5 },
  { name: "Queue", questionSolved: 3 },
  { name: "Tree", questionSolved: 7 },
  { name: "Graph", questionSolved: 2 },
  { name: "Dynamic Programming", questionSolved: 1 },
  { name: "Recursion", questionSolved: 4 },
  { name: "Sorting", questionSolved: 3 },
  { name: "Searching", questionSolved: 2 },
  { name: "Two Pointers", questionSolved: 5 },
  { name: "Sliding Window", questionSolved: 3 },
  { name: "Greedy", questionSolved: 2 },
  { name: "Binary Search", questionSolved: 4 },
  { name: "Backtracking", questionSolved: 2 },
  { name: "Math", questionSolved: 3 },
  { name: "Bit Manipulation", questionSolved: 1 },
  { name: "Matrix", questionSolved: 3 },
];


const categoriedSkills = categorizeSkillsByName(skills);



export function SkillsAndLang() {
  return (
    <div className="space-y-4 md:sticky md:top-20">
      <Card className="bg-card border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Languages</h2>
        <div className="space-y-3">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="px-3 py-1 text-sm font-medium rounded-lg bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                {lang.name}
              </span>
              <span className="text-sm text-muted-foreground">
                {lang.questioSolved} problems
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-card border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Skills</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium flex items-center gap-1 mb-3">
              <Dot className="text-red-500" size={24} />
              Advanced
            </h3>
            <div className="space-y-2 pl-4">
              {categoriedSkills.advanced.map((skill) => (
                <div
                  key={skill.name}
                  className="flex justify-between items-center gap-3"
                >
                  <span className="px-3 py-1 text-xs font-medium rounded-lg bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200">
                    {skill.name}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    ×{skill.questionSolved}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium flex items-center gap-1 mb-3">
              <Dot className="text-yellow-500" size={24} />
              Intermediate
            </h3>
            <div className="space-y-2 pl-4">
              {categoriedSkills.intermediate.map((skill) => (
                <div
                  key={skill.name}
                  className="flex justify-between items-center gap-3"
                >
                  <span className="px-3 py-1 text-xs font-medium rounded-lg bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
                    {skill.name}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    ×{skill.questionSolved}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium flex items-center gap-1 mb-3">
              <Dot className="text-green-500" size={24} />
              Foundational
            </h3>
            <div className="space-y-2 pl-4">
              {categoriedSkills.foundational.map((skill) => (
                <div
                  key={skill.name}
                  className="flex justify-between items-center gap-3"
                >
                  <span className="px-3 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200">
                    {skill.name}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    ×{skill.questionSolved}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
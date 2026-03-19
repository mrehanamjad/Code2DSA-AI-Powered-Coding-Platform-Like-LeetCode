"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Code2, Zap } from "lucide-react";
import { cn } from "@/lib/utils"; // Standard shadcn utility

type Skill = {
  name: string;
  questionSolved: number;
};

const CATEGORY_CONFIG = {
  advanced: {
    label: "Advanced",
    color: "text-rose-500 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800",
    dot: "bg-rose-500",
    topics: ["Dynamic Programming", "Divide and Conquer", "Graph", "Backtracking", "Trie", "Segment Tree"],
  },
  intermediate: {
    label: "Intermediate",
    color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
    topics: ["Hash Table", "Math", "Recursion", "Sliding Window", "Greedy", "Linked List", "Binary Search"],
  },
  foundational: {
    label: "Foundational",
    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
    topics: ["Array", "String", "Two Pointers", "Sorting", "Searching", "Stack", "Queue", "Matrix"],
  },
};

export function SkillsAndLang({ languages, skills }: {
  languages: Skill[];
  skills: Skill[];
}) {
  // Group skills by category
  const categorized = skills.reduce((acc, skill) => {
    if (CATEGORY_CONFIG.advanced.topics.includes(skill.name)) acc.advanced.push(skill);
    else if (CATEGORY_CONFIG.intermediate.topics.includes(skill.name)) acc.intermediate.push(skill);
    else acc.foundational.push(skill);
    return acc;
  }, { advanced: [], intermediate: [], foundational: [] } as Record<string, Skill[]>);

  const maxSolved = Math.max(...languages.map(l => l.questionSolved), 1);

  return (
    <div className="flex flex-col gap-6 md:sticky md:top-20">
      {/* Languages Card */}
      <Card className="overflow-hidden border-none shadow-sm bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Code2 size={16} /> Languages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {languages.map((lang) => (
            <div key={lang.name} className="group relative">
              <div className="flex justify-between items-center mb-1 relative z-10 px-1">
                <span className="text-sm font-semibold">{lang.name}</span>
                <span className="text-xs font-medium text-muted-foreground">{lang.questionSolved} Solved</span>
              </div>
              {/* Subtle Progress Bar Background */}
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary/40 group-hover:bg-primary/60 transition-all duration-500" 
                  style={{ width: `${(lang.questionSolved / maxSolved) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills Card */}
      <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Zap size={16} /> Technical Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map((key) => {
            const config = CATEGORY_CONFIG[key];
            const items = categorized[key];

            if (items.length === 0) return null;

            return (
              <div key={key} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tight text-muted-foreground/80">
                  <span className={cn("h-2 w-2 rounded-full", config.dot)} />
                  {config.label}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <div
                      key={skill.name}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all hover:scale-105",
                        config.color
                      )}
                    >
                      {skill.name}
                      <span className="opacity-60 font-normal">
                        {skill.questionSolved}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
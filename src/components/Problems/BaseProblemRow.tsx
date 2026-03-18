import React from "react";
import Link from "next/link";
import StatusIcon, { Status } from "@/components/StatusIcon";
import DifficultyBadge, { Difficulty } from "@/components/DifficultyBadge";
import { Badge } from "@/components/ui/badge";

export interface NormalizedProblem {
  _id: string;
  problemId: string;
  title: string;
  difficulty: Difficulty | string;
  topics: string[];
  status?: Status;
}

interface BaseProblemRowProps {
  problem: NormalizedProblem;
  href: string;
  actions?: React.ReactNode;
  dragHandle?: React.ReactNode;
  isDragging?: boolean;
  innerRef?: (node: HTMLElement | null) => void;
  style?: React.CSSProperties;
}

export default function BaseProblemRow({
  problem,
  href,
  actions,
  dragHandle,
  isDragging,
  innerRef,
  style,
}: BaseProblemRowProps) {
  return (
    <div
      ref={innerRef}
      style={style}
      // 1. Changed outer wrapper to `flex items-center`
      className={`flex items-center transition-all bg-card ${
        isDragging
          ? "shadow-md border-primary ring-1 ring-primary z-10 opacity-80"
          : "hover:bg-muted/40 group border-l-2 border-l-transparent hover:border-l-primary"
      }`}
    >
      {/* 2. Drag Handle is now a standard flex item (no absolute positioning) */}
      {dragHandle && (
        <div className="pl-3 sm:pl-4 flex-shrink-0 flex items-center justify-center cursor-grab">
          {dragHandle}
        </div>
      )}

      {/* 3. Main Grid is wrapped in `flex-1` to take up the remaining space */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-3 sm:px-6 py-4 items-center min-w-0">
        
        <Link href={href} className="contents">
          <div className="flex items-center gap-3 col-span-6 lg:col-span-5 min-w-0">
            {/* 4. Removed invalid col-span classes inside flex, used flex-shrink-0 */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <StatusIcon status={problem.status || "Unsolved"} />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {problem.title}
              </span>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <DifficultyBadge difficulty={problem.difficulty as Difficulty} />
          </div>

          <div className="col-span-3 flex flex-wrap gap-1">
            {problem.topics?.slice(0, 2).map((topic) => (
              <Badge key={topic} variant="secondary" className="px-1.5 py-0 text-[10px] font-medium">
                {topic}
              </Badge>
            ))}
            {problem.topics?.length > 2 && (
              <span className="text-[10px] text-muted-foreground font-medium ml-1">
                +{problem.topics.length - 2} more
              </span>
            )}
          </div>
        </Link>

        {/* Slot for specific actions (Edit, Delete, Remove) */}
        <div className="col-span-2 flex items-center justify-end gap-2 relative z-10">
          {actions}
        </div>
      </div>
    </div>
  );
}
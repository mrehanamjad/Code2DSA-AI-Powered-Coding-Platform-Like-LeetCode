import React from "react";
import Link from "next/link";
import StatusIcon from "@/components/StatusIcon";
import DifficultyBadge, { Difficulty } from "@/components/DifficultyBadge";
import { Badge } from "@/components/ui/badge";

// Unified interface to normalize data from both APIs
export interface NormalizedProblem {
  _id: string;
  problemId: string;
  title: string;
  difficulty: Difficulty | string;
  topics: string[];
  status?: string;
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
      className={`relative transition-all bg-card ${
        isDragging
          ? "shadow-md border-primary ring-1 ring-primary z-10 opacity-80"
          : "hover:bg-muted/40 group border-l-2 border-l-transparent hover:border-l-primary"
      }`}
    >
      {/* Slot for DND handle */}
      {dragHandle && (
        <div className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-10">
          {dragHandle}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-3 md:px-6 py-4 items-center">
        {/* Clickable Area: Uses CSS 'contents' to keep grid children aligned */}
        <Link href={href} className="contents">
          <div className={`col-span-1 md:col-span-1 flex items-center md:justify-center ${dragHandle ? "ml-6 md:ml-0" : ""}`}>
            <StatusIcon status={problem.status || "Unsolved"} />
            <span className="md:hidden ml-2 font-medium">Status</span>
          </div>

          <div className="col-span-5 flex flex-col justify-center">
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {problem.title}
            </span>
          </div>

          <div className="col-span-2">
            <DifficultyBadge difficulty={problem.difficulty as Difficulty} />
          </div>

          <div className="col-span-2 flex flex-wrap gap-1">
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
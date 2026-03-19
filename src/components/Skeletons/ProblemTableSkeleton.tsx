import React from "react";

const ProblemRowSkeleton = () => {
  return (
    <div className="flex items-center bg-card border-l-2 border-l-transparent animate-pulse">
      {/* 1. Main Grid - Matching BaseProblemRow columns */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-3 sm:px-6 py-4 items-center">
        
        {/* Title & Status Area */}
        <div className="flex items-center gap-3 col-span-6 lg:col-span-5">
          {/* Status Icon Circle */}
          <div className="h-5 w-5 rounded-full bg-muted flex-shrink-0" />
          {/* Title Text Bar */}
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>

        {/* Difficulty Badge */}
        <div className="col-span-1 lg:col-span-2">
          <div className="h-6 w-16 bg-muted rounded-full" />
        </div>

        {/* Topics Badges */}
        <div className="col-span-3 flex gap-1">
          <div className="h-5 w-12 bg-muted rounded-md" />
          <div className="h-5 w-12 bg-muted rounded-md" />
        </div>

        {/* Action Buttons */}
        <div className="col-span-2 flex justify-end gap-2">
          <div className="h-8 w-8 bg-muted rounded-md" />
          <div className="h-8 w-8 bg-muted rounded-md" />
        </div>
      </div>
    </div>
  );
};

export const ProblemTableSkeleton = ({ rowCount = 5 }: { rowCount?: number }) => {
  return (
    <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">
      <div className="divide-y divide-border">
        {Array.from({ length: rowCount }).map((_, i) => (
          <ProblemRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
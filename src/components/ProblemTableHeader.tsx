import React from "react";

interface ProblemTableHeaderProps {
  hasActions?: boolean;
}

export default function ProblemTableHeader({ hasActions = true }: ProblemTableHeaderProps) {
  return (
    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-muted/30 border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      <div className="col-span-1 text-center">Status</div>
      <div className="col-span-5">Title</div>
      <div className="col-span-2">Difficulty</div>
      <div className="col-span-2">Topics</div>
      {hasActions && <div className="col-span-2 text-right">Actions</div>}
    </div>
  );
}
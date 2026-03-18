import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { PaginatedListProblems } from "@/lib/apiClient/types";
import BaseProblemRow, { NormalizedProblem } from "@/components/Problems/BaseProblemRow";
import { Status } from "../StatusIcon";

type ProblemItem = PaginatedListProblems["docs"][0];

interface SortableProblemRowProps {
  problem: ProblemItem;
  isOwner: boolean;
  onRemove: (e: React.MouseEvent, problemId: string) => void;
}

export default function SortableProblemRow({ problem, isOwner, onRemove }: SortableProblemRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: problem._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  };

  // Map the nested API data to our normalized structure
  const normalizedProblem: NormalizedProblem = {
    ...problem.problemDetails,
    status: problem.problemDetails.status as Status,
  };

  return (
    <BaseProblemRow
      innerRef={setNodeRef}
      style={style}
      isDragging={isDragging}
      problem={normalizedProblem}
      href={`/problems/${normalizedProblem.problemId}`}
      dragHandle={
        isOwner ? (
          <div
            className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-foreground p-1"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </div>
        ) : undefined
      }
      actions={
        isOwner ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              onRemove(e, normalizedProblem._id);
            }}
            className="p-1.5 ml-2 rounded-md hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-all flex items-center gap-1 text-xs font-medium"
            title="Remove from list"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : undefined
      }
    />
  );
}
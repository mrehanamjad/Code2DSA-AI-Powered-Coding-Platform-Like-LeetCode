import { Badge } from "@/components/ui/badge";
import DifficultyBadge from "./DifficultyBadge";
import StatusIcon from "./StatusIcon";
import Link from "next/link";
import { ProblemI } from "@/models/problem.model";

interface ProblemTableProps {
  problems: ProblemI[];
}

const ProblemTable = ({ problems }: ProblemTableProps) => {
  return (
    <div className="bg-card rounded-lg border shadow-custom-sm overflow-hidden">
      {/* Table Header - Hidden on mobile */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-muted/50 border-b text-sm font-medium text-muted-foreground">
        <div className="col-span-1">Status</div>
        <div className="col-span-5">Title</div>
        <div className="col-span-2">Difficulty</div>
        <div className="col-span-2">Acceptance</div>
        <div className="col-span-2">Topics</div>
      </div>

      {/* Table Body */}
      <div className="divide-y">
        {problems.map((problem) => (
          <Link
            key={problem.problemId}
            href={`/problems/${problem.problemId}`}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 transition-smooth hover:bg-muted/50 group"
          >
            {/* Mobile: Title first */}
            <div className="md:hidden col-span-1 mb-2">
              <h3 className="font-medium group-hover:text-primary transition-smooth">
               {problem.title}
              </h3>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 md:col-span-1">
              <StatusIcon status={problem.status} />
              <span className="md:hidden text-xs text-muted-foreground capitalize">
                {problem.status}
              </span>
            </div>

            {/* Title - Desktop only */}
            <div className="hidden md:flex items-center md:col-span-5">
              <h3 className="font-medium group-hover:text-primary transition-smooth">
                {problem.title}
              </h3>
            </div>

            {/* Difficulty */}
            <div className="flex items-center md:col-span-2">
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>

            {/* Acceptance */}
            <div className="flex items-center md:col-span-2">
              <span className="text-sm text-muted-foreground">
                <span className="md:hidden mr-1">Acceptance:</span>
                {Math.floor(Math.random() * 101)}%
              </span>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1 md:col-span-2 flex-wrap">
              {problem?.topics?.slice(0, 2).map((topic) => (
                <Badge key={topic} variant="secondary" className="text-xs">
                  {topic}
                </Badge>
              ))}
              {problem?.topics?.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{problem?.topics?.length - 2}
                </Badge>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProblemTable;

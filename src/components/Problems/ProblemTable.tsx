
"use client";

import React from "react";
import BaseProblemRow, { NormalizedProblem } from "./BaseProblemRow"; // Adjust import path
import ProblemTableHeader from "./ProblemTableHeader"; // Adjust import path
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient/apiClient";
import AddToListModal from "../Lists/AddToListModal";
import { Difficulty } from "../DifficultyBadge";

export interface ProblemForTableI {
  _id: string;
  problemId: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  status?: string ;
}

interface ProblemTableProps {
  problems: ProblemForTableI[];
  admin?: boolean;
  onDelete?: (problemId: string) => void;
}

const ProblemTable = ({ problems, admin = false, onDelete }: ProblemTableProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = admin && session?.user.role === "admin";

  const handleDelete = async (problemId: string) => {
    if (!isAdmin) return;
    if (onDelete) return onDelete(problemId);
    if (!window.confirm("Are you sure you want to delete this problem?")) return;

    try {
      const res = await apiClient.deleteProblem(problemId);
      if (!res.success) throw new Error("Failed to delete");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error deleting problem.");
    }
  };

  return (
    <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">
      <ProblemTableHeader hasActions={true} />
      
      <div className="divide-y divide-border">
        {problems.map((problem) => (
          <BaseProblemRow
            key={problem.problemId}
            problem={problem as NormalizedProblem}
            href={`/problems/${problem.problemId}`}
            actions={
              <>
                {problem._id && (
                  <AddToListModal problemId={String(problem._id)} triggerVariant="icon" />
                )}
                {isAdmin && (
                  <>
                    <Link href={`/admin/problems/${problem.problemId}/testcase`} className="p-1.5 rounded-md hover:bg-background border border-transparent hover:border-border transition-all">
                      <PlusCircle className="w-4 h-4 text-muted-foreground" />
                    </Link>
                    <Link href={`/admin/problems/${problem.problemId}/edit`} className="p-1.5 rounded-md hover:bg-background border border-transparent hover:border-border transition-all">
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </Link>
                    <button onClick={() => handleDelete(String(problem.problemId))} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ProblemTable;
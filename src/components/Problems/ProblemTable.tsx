"use client";

import React, { useState } from "react";
import BaseProblemRow, { NormalizedProblem } from "./BaseProblemRow";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit2, PlusCircle, Trash2, BookmarkPlus } from "lucide-react";
import { apiClient } from "@/lib/apiClient/apiClient";
import AddToListModal from "../Lists/AddToListModal";
import { Difficulty } from "../DifficultyBadge";
import { Status } from "../StatusIcon";
import { toast } from "sonner"; // Assuming you use sonner based on previous code

export interface ProblemForTableI {
  _id: string;
  problemId: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  status?: Status;
}

interface ProblemTableProps {
  problems: ProblemForTableI[];
  admin?: boolean;
  onDelete?: (problemId: string) => void;
}

const ProblemTable = ({ problems, admin = false, onDelete }: ProblemTableProps) => {
  const { status, data: session } = useSession();
  const router = useRouter();
  const isAdmin = admin && session?.user?.role === "admin";

  // STATE: Track which problem the user wants to add to a list
  const [activeListProblemId, setActiveListProblemId] = useState<string | null>(null);

  const handleDelete = async (problemId: string) => {
    if (!isAdmin) return;
    
    // If parent provides a custom delete handler, use that and exit
    if (onDelete) {
      onDelete(problemId);
      return;
    }

    // Better to use a UI dialog, but window.confirm is okay for now
    if (!window.confirm("Are you sure you want to delete this problem?")) return;

    try {
      const res = await apiClient.deleteProblem(problemId);
      if (!res.success) throw new Error(res.error || "Failed to delete");
      
      toast.success("Problem deleted");
      router.refresh(); 
    } catch (error) {
      console.error(error);
      toast.error("Error deleting problem.");
    }
  };

  const handleOpenListModal = (problemId: string) => {
    if (status !== "authenticated") {
      toast.info("Please sign in to save to your lists.");
      return;
    }
    setActiveListProblemId(problemId);
  };

  return (
    <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden relative">
      <div className="divide-y divide-border">
        {problems.map((problem) => (
          <BaseProblemRow
            key={problem.problemId}
            problem={problem as unknown as NormalizedProblem} // Safer cast
            href={`/problems/${problem.problemId}`}
            actions={
              <>
                {problem._id && (
                  // Just a lightweight native button instead of a full Modal component
                  <button
                    onClick={() => handleOpenListModal(problem._id)}
                    className="p-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                    title="Save to List"
                    type="button"
                  >
                    <BookmarkPlus className="h-4 w-4" />
                  </button>
                )}

                {isAdmin && (
                  <>
                    <Link 
                      href={`/admin/problems/${problem.problemId}/testcase`} 
                      className="p-1.5 rounded-md hover:bg-background border border-transparent hover:border-border transition-all"
                    >
                      <PlusCircle className="w-4 h-4 text-muted-foreground" />
                    </Link>
                    <Link 
                      href={`/admin/problems/${problem.problemId}/edit`} 
                      className="p-1.5 rounded-md hover:bg-background border border-transparent hover:border-border transition-all"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(problem.problemId)} 
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </>
            }
          />
        ))}
      </div>
      {activeListProblemId && (
        <AddToListModal
          problemId={activeListProblemId}
          isOpen={true} 
          onClose={() => setActiveListProblemId(null)}
        />
      )}
    </div>
  );
};

export default ProblemTable;
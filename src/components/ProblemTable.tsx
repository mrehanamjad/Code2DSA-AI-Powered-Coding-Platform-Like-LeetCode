//  "use client";

// import React from "react";
// import { Badge } from "@/components/ui/badge";
// import DifficultyBadge from "./DifficultyBadge";
// import StatusIcon from "./StatusIcon";
// import Link from "next/link";
// import { ProblemI } from "@/models/problem.model";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// interface ProblemTableProps {
//   problems: ProblemI[];
// }

// const ProblemTable = ({ problems }: ProblemTableProps) => {
//   const { data: session } = useSession();
//   const router = useRouter();

//   const isAdmin = session?.user.role === "admin";

//   console.log(session);

//   const handleDelete = async (
//     e: React.MouseEvent<HTMLButtonElement>,
//     problemId: string
//   ) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this problem?"
//     );
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(`/api/problems/${problemId}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(data.error || "Failed to delete problem");
//       }

//       router.refresh();
//     } catch (error) {
//       console.error(error);
//       alert(
//         error instanceof Error
//           ? error.message
//           : "Something went wrong while deleting the problem."
//       );
//     }
//   };

//   return (
//     <div className="bg-card rounded-lg border shadow-custom-sm overflow-hidden">
//       {/* Table Header - Hidden on mobile */}
//       <div className="hidden md:grid md:grid-cols-11 gap-4 p-4 bg-muted/50 border-b text-sm font-medium text-muted-foreground">
//         <div className="col-span-1">Status</div>
//         <div className="col-span-5">Title</div>
//         <div className="col-span-2">Difficulty</div>
//         {/* <div className="col-span-2">Acceptance</div> */}
//         <div className="col-span-3 flex items-center justify-between">
//           <span>Topics</span>
//           {isAdmin && <span className="text-xs text-muted-foreground">Admin</span>}
//         </div>
//       </div>

//       {/* Table Body */}
//       <div className="divide-y">
//         {problems.map((problem) => (
//           <Link
//             key={problem.problemId}
//             href={`/problems/${problem.problemId}`}
//             className="grid grid-cols-1 md:grid-cols-11 gap-2 md:gap-4 p-4 transition-smooth hover:bg-muted/50 group"
//           >
//             {/* Mobile: Title first */}
//             <div className="md:hidden col-span-1 mb-2">
//               <h3 className="font-medium group-hover:text-primary transition-smooth">
//                {problem.title}
//               </h3>
//             </div>

//             {/* Status */}
//             <div className="flex items-center gap-2 md:col-span-1">
//               <StatusIcon status={problem.status} />
//               <span className="md:hidden text-xs text-muted-foreground capitalize">
//                 {problem.status}
//               </span>
//             </div>

//             {/* Title - Desktop only */}
//             <div className="hidden md:flex items-center md:col-span-5">
//               <h3 className="font-medium group-hover:text-primary transition-smooth">
//                 {problem.title}
//               </h3>
//             </div>

//             {/* Difficulty */}
//             <div className="flex items-center md:col-span-2">
//               <DifficultyBadge difficulty={problem.difficulty} />
//             </div>

//             {/* Acceptance */}
//             {/* <div className="flex items-center md:col-span-2">
//               <span className="text-sm text-muted-foreground">
//                 <span className="md:hidden mr-1">Acceptance:</span>
//                 {Math.floor(Math.random() * 101)}%
//               </span>
//             </div> */}

//             {/* Tags */}
//             <div className="flex items-center justify-between gap-3 md:col-span-3 flex-wrap">
//               <div className="flex items-center gap-1 flex-wrap">
//                 {problem?.topics?.slice(0, 2).map((topic) => (
//                   <Badge key={topic} variant="secondary" className="text-xs">
//                     {topic}
//                   </Badge>
//                 ))}
//                 {problem?.topics?.length > 2 && (
//                   <Badge variant="secondary" className="text-xs">
//                     +{problem?.topics?.length - 2}
//                   </Badge>
//                 )}
//               </div>

//               {isAdmin && (
//                 <div className="flex items-center gap-1 md:gap-2 text-xs">
//                   <Link
//                     href={`/admin/problems/add-testcase/${problem.problemId}`}
//                     onClick={(e) => e.stopPropagation()}
//                     className="px-2 py-1 rounded border border-border bg-background hover:bg-muted transition-smooth"
//                   >
//                     Add TC
//                   </Link>
//                   <Link
//                     href={`/admin/problems/edit/${problem.problemId}`}
//                     onClick={(e) => e.stopPropagation()}
//                     className="px-2 py-1 rounded border border-border bg-background hover:bg-muted transition-smooth"
//                   >
//                     Edit
//                   </Link>
//                   <button
//                     type="button"
//                     onClick={(e) => handleDelete(e, problem.problemId)}
//                     className="px-2 py-1 rounded border border-destructive/40 text-destructive hover:bg-destructive/10 transition-smooth"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProblemTable;






































"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import DifficultyBadge from "./DifficultyBadge";
import StatusIcon from "./StatusIcon";
import Link from "next/link";
import { ProblemI } from "@/models/problem.model";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Edit2, PlusCircle, Trash2 } from "lucide-react"; // Optional: Add icons for better UI

interface ProblemTableProps {
  problems: ProblemI[];
  admin?: boolean;
  onDelete?: (problemId: string) => void;
}

const ProblemTable = ({ problems, admin=false,onDelete }: ProblemTableProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = admin && session?.user.role === "admin";

  const handleDelete = async (e: React.MouseEvent, problemId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (onDelete) {
      onDelete(problemId);
      return;
    }

    if (!window.confirm("Are you sure you want to delete this problem?")) return;

    try {
      const res = await fetch(`/api/problems/${problemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error deleting problem.");
    }
  };

  return (
    <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-muted/30 border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-5">Title</div>
        <div className="col-span-2">Difficulty</div>
        <div className="col-span-2">Topics</div>
        {isAdmin && <div className="col-span-2 text-right">Actions</div>}
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {problems.map((problem) => (
          <Link
            key={problem.problemId}
            href={`/problems/${problem.problemId}`}
            className="relative grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center transition-all hover:bg-muted/40 group border-l-2 border-l-transparent hover:border-l-primary"
          >
            {/* Status & Title (Mobile Wrapper) */}
            <div className="col-span-1 md:col-span-1 flex items-center md:justify-center">
              <StatusIcon status={problem.status} />
              <span className="md:hidden ml-2 font-medium">Status</span>
            </div>

            <div className="col-span-5 flex flex-col justify-center">
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {problem.title}
              </span>
            </div>

            {/* Difficulty */}
            <div className="col-span-2">
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>

            {/* Topics */}
            <div className="col-span-2 flex flex-wrap gap-1">
              {problem?.topics?.slice(0, 2).map((topic) => (
                <Badge key={topic} variant="secondary" className="px-1.5 py-0 text-[10px] font-medium">
                  {topic}
                </Badge>
              ))}
              {problem?.topics?.length > 2 && (
                <span className="text-[10px] text-muted-foreground font-medium ml-1">
                  +{problem.topics.length - 2} more
                </span>
              )}
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="col-span-2 flex items-center justify-end gap-2 mt-2 md:mt-0">
                <Link
                  href={`/admin/problems/${problem.problemId}/testcase`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-md hover:bg-background border border-transparent hover:border-border transition-all"
                  title="Add Testcase"
                >
                  <PlusCircle className="w-4 h-4 text-muted-foreground" />
                </Link>
                <Link
                  href={`/admin/problems/${problem.problemId}/edit`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-md hover:bg-background border border-transparent hover:border-border transition-all"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </Link>
                <button
                  onClick={(e) => handleDelete(e, problem.problemId)}
                  className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProblemTable;
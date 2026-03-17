import Link from "next/link";
import { Lock, Globe, List, Calendar } from "lucide-react";
import { ProblemListI } from "@/models/problemList.model";

interface ListCardProps {
  list: ProblemListI;
}

export default function ListCard({ list }: ListCardProps) {
  // Extract id depending on whether it's hydrated or raw mongoose object
  const listId = list._id ? String(list._id) : "";

  return (
    <Link href={`/lists/${listId}`} className="group block">
      <div className="bg-card border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all h-full flex flex-col cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {list.title}
          </h3>
          <div className="flex-shrink-0 ml-2">
            {list.isPublic ? (
              <div className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                <Globe className="h-3 w-3 mr-1" /> Public
              </div>
            ) : (
              <div className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                <Lock className="h-3 w-3 mr-1" /> Private
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
          {list.description || "No description provided."}
        </p>

        <div className="pt-4 border-t flex items-center text-xs text-muted-foreground justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <List className="h-3.5 w-3.5" />
            <span>Problem List</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {list.createdAt
                ? new Date(list.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Just now"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

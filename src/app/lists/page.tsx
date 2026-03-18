"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/apiClient/apiClient";
import { ProblemListI } from "@/models/problemList.model";
import Container from "@/components/Container";
import ListCard from "@/components/Lists/ListCard";
import CreateListModal from "@/components/Lists/CreateListModal";
import { FolderOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ListsOverviewPage() {
  const { status } = useSession();
  const router = useRouter();

  const [lists, setLists] = useState<ProblemListI[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // ✅ Stable + reusable function
  const fetchLists = useCallback(async () => {
    if (status !== "authenticated") {
      setLoading(false); // ✅ fix loading bug
      return;
    }

    try {
      const res = await apiClient.getLists();
      if (res.success && res.data?.lists) {
        setLists(res.data.lists);
      }
    } catch (error) {
      console.error("Failed to fetch lists", error);
    } finally {
      setLoading(false);
    }
  }, [status]);

  // ✅ Safe effect
  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  if (status === "loading" || loading) {
    return (
      <Container>
        <div className="animate-pulse space-y-8 mt-10">
          <div className="h-10 w-48 bg-muted rounded-md mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <Container>
      <div className="py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              My Problem Lists
            </h1>
            <p className="text-muted-foreground mt-1">
              Organize & track your coding progress with custom lists.
            </p>
          </div>

          {/* ✅ Stable function prevents unnecessary re-renders */}
          <CreateListModal onSuccess={fetchLists} />
        </div>

        {lists.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-muted/20 border-dashed">
            <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mb-4 text-muted-foreground">
              <FolderOpen className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              No lists created yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create your first problem list to organize your study plan and
              save questions for later.
            </p>
            <CreateListModal onSuccess={fetchLists} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list, idx) => (
              <ListCard
                key={list._id ? String(list._id) : idx}
                list={list}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
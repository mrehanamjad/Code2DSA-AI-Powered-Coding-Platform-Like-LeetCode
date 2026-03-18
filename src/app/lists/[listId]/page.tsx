"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient/apiClient";
import Container from "@/components/Container";
import { Loader2, Trash2, Lock, Globe, AlertTriangle, Home, LayoutList } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProblemListI } from "@/models/problemList.model";
import { PaginatedListProblems } from "@/lib/apiClient/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import SortableProblemRow from "@/components/Lists/SortableProblemRow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PaginationControls from "@/components/PaginationControls";
import CreateListModal from "@/components/Lists/CreateListModal";
import ProblemTableHeader from "@/components/Problems/ProblemTableHeader";
import { SharePageButton } from "@/components/Lists/SharePageButton";

type Props = {
  params: Promise<{
    listId: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default function ListDetailPage({ params, searchParams }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const [list, setList] = useState<ProblemListI | null>(null);
  const [problemsData, setProblemsData] = useState<PaginatedListProblems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listId, setListId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isPrivate, setIsPrivate] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts to prevent accidental clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Resolve params and searchParams which are Promises in Next.js 15
    Promise.all([params, searchParams]).then(([resolvedParams, resolvedSearch]) => {
      setListId(resolvedParams.listId);
      const pageStr = resolvedSearch.page as string;
      setPage(pageStr ? parseInt(pageStr, 10) : 1);
    });
  }, [params, searchParams]);

  useEffect(() => {
    if (listId) {
      fetchListDetails(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId, page, session?.user?.id]); // Re-fetch if auth state changes


  const fetchListDetails = async (page: number) => {
    setLoading(true);
    setError(null);
    setIsPrivate(false); // Reset on new fetch

    try {
      const res = await apiClient.getListById(listId, page, 10);

      if (res.success && res.data) {
        setList(res.data.list);
        setProblemsData(res.data.problems);
      } else {
        // Catch the 403 specifically
        if (res.status === 403) {
          setIsPrivate(true);
        } else {
          setError(res.error || "Failed to load list details");
        }
      }
    } catch (err: unknown) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteList = async () => {
    try {
      const res = await apiClient.deleteList(listId);
      if (res.success) {
        toast.success("List deleted successfully");
        router.push("/lists");
      } else {
        toast.error(res.error || "Failed to delete list");
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Error deleting list");
    }
  };

  const handleRemoveProblem = async (e: React.MouseEvent, problemId: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await apiClient.removeProblemFromList(listId, problemId);
      if (res.success) {
        toast.success("Problem removed from list");
        fetchListDetails(page); // Refresh current page
      } else {
        toast.error(res.error || "Failed to remove problem");
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Error removing problem");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !problemsData?.docs) {
      return;
    }

    const problems = [...problemsData.docs];
    const oldIndex = problems.findIndex((p) => p._id === active.id);
    const newIndex = problems.findIndex((p) => p._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Shift memory array via dnd-kit utility
    const newProblems = arrayMove(problems, oldIndex, newIndex);

    // Calculate global index offset for this page
    const baseOrder = ((problemsData.page || 1) - 1) * (problemsData.limit || 10);

    const updates: { problemId: string; order: number }[] = [];

    // Linearly assign correct order integers according to sequence index safely
    const orderedBatch = newProblems.map((prob, idx) => {
      // Create a definitive, globally unique order value instead of trusting raw arrays that might be 0 default
      const slotOrder = baseOrder + idx;

      updates.push({
        problemId: prob.problemDetails._id,
        order: slotOrder
      });

      // Return a new shallow clone with updated order to avoid mutating shared refs
      return { ...prob, order: slotOrder };
    });

    setProblemsData({ ...problemsData, docs: orderedBatch });

    try {
      // Background quiet sync to DB
      const res = await apiClient.reorderProblems(listId, updates);
      if (!res.success) {
        toast.error(res.error || "Failed to save new order");
        fetchListDetails(page);
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Unexpected error saving order");
      fetchListDetails(page);
    }
  };

  if (loading && !list) {
    return (
      <Container>
        <div className="py-10 flex justify-center items-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Container>
    );
  }

if (isPrivate) {
  return (
    <Container>
      <div className="py-20 flex flex-col items-center justify-center min-h-[50vh] text-center border rounded-2xl bg-muted/30 p-12 shadow-inner">
        <div className="bg-background p-4 rounded-full shadow-sm mb-6">
          <Lock className="h-12 w-12 text-muted-foreground" />
        </div>
        
        <h2 className="text-3xl font-bold mb-3 tracking-tight">This List is Private</h2>
        <p className="text-muted-foreground text-lg max-w-md mb-8">
          You don&apos;t have permission to view this collection. It might be set to private by the owner.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button 
            variant="outline" 
            onClick={() => router.push("/")} 
            className="gap-2 h-11 px-6"
          >
            <Home className="h-4 w-4" /> 
            Back to Home
          </Button>
          
          <Button 
            onClick={() => router.push("/problems?sort=oldest&page=1")} 
            className="gap-2 h-11 px-6"
          >
            <LayoutList className="h-4 w-4" /> 
            View All Problems
          </Button>
        </div>
      </div>
    </Container>
  );
}

  if (error || !list) {
    return (
      <Container>
        <div className="py-10 flex flex-col items-center justify-center min-h-[40vh] text-center border rounded-xl bg-destructive/5 p-8">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Oops! Error Loading List</h2>
          <p className="text-muted-foreground mb-6">{error || "The list requested could not be found."}</p>
          <Button onClick={() => router.push("/lists")}>Return to My Lists</Button>
        </div>
      </Container>
    );
  }

  const isOwner = session?.user?.id === String(list.owner || "");
  const problems = problemsData?.docs || [];

  return (
    <Container>
      <div className="py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{list.title}</h1>
              <Badge variant="secondary" className="font-normal flex items-center gap-1">
                {list.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {list.isPublic ? "Public" : "Private"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl">
              {list.description || "No description provided."}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Created on {new Date(list.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>

          {isOwner && (
            <div className="flex gap-3 mt-4 md:mt-0 ">
              <SharePageButton listName={list.title} isPublic={list.isPublic} listId={listId} listDescription={list.description} onUpdateSuccess={() => fetchListDetails(page)} />
              <CreateListModal
                mode="edit"
                listId={listId}
                initialData={{
                  title: list.title,
                  description: list.description,
                  isPublic: list.isPublic
                }}
                onSuccess={() => fetchListDetails(page)}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" /> Delete List
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the list &quot;{list.title}&quot; and remove all problem associations. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteList} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Yes, Delete List
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {/* Problems Table Section */}
        <h2 className="text-xl font-semibold mb-4">Problems ({problemsData?.totalDocs || 0})</h2>

        {problems.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-muted/20 border-dashed">
            <p className="text-muted-foreground">No problems have been added to this list yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">
              {/* Table Header */}
              <ProblemTableHeader hasActions={isOwner} />

              {/* Table Body */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="divide-y divide-border">
                  <SortableContext
                    items={problems.map((p) => p._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {problems.map((problem) => (
                      <SortableProblemRow
                        key={problem._id}
                        problem={problem}
                        isOwner={isOwner}
                        onRemove={handleRemoveProblem}
                      />
                    ))}
                  </SortableContext>
                </div>
              </DndContext>
            </div>

            {/* Pagination Component */}
            {problemsData && problemsData.totalPages > 1 && (
              <div className="pt-4 pb-8">
                <PaginationControls
                  currentPage={problemsData.page}
                  totalPages={problemsData.totalPages}
                  hasNextPage={problemsData.hasNextPage}
                  hasPrevPage={problemsData.hasPrevPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}

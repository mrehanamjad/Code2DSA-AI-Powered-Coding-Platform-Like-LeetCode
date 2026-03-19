"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Check, FolderPlus } from "lucide-react";
import { apiClient } from "@/lib/apiClient/apiClient";
import { toast } from "sonner";
import { ProblemListI } from "@/models/problemList.model";
import { useSession } from "next-auth/react";

interface ProblemListWithCheck extends ProblemListI {
  containsProblem?: boolean;
}

// 1. Update the props to accept isOpen and onClose
interface AddToListModalProps {
  problemId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddToListModal({ problemId, isOpen, onClose }: AddToListModalProps) {
  const { status, data: session } = useSession();
  
  // 2. Remove the local 'open' state. We use 'isOpen' from props now.
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState<ProblemListWithCheck[]>([]);
  
  const [addingToListId, setAddingToListId] = useState<string | null>(null);
  const [addedLists, setAddedLists] = useState<Set<string>>(new Set());
  
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creatingLoading, setCreatingLoading] = useState(false);

  // 3. Update the useEffect to watch 'isOpen' instead of the local state
  useEffect(() => {
    if (isOpen && status === "authenticated") {
      fetchLists();
    } else if (!isOpen) {
      // Reset state on close
      setIsCreatingNew(false);
      setNewTitle("");
      setAddingToListId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, status, problemId]);

  const fetchLists = async () => {
    setLoading(true);
    try {
      const listsRes = await apiClient.getLists(session?.user?.id, problemId);

      if (listsRes.success && listsRes.data?.lists) {
        const fetchedLists: ProblemListWithCheck[] = listsRes.data.lists;
        setLists(fetchedLists);
        
        const alreadyAdded = new Set<string>(
          fetchedLists
            .filter((list) => list.containsProblem)
            .map((list) => String(list._id))
        );
        setAddedLists(alreadyAdded);
      }
    } catch (error) {
      console.error("Failed to fetch lists", error);
      toast.error("Failed to load your lists.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToList = async (listId: string) => {
    if (addedLists.has(listId)) return;
    
    setAddingToListId(listId);
    try {
      const res = await apiClient.addProblemToList(listId, problemId);
      if (res.success) {
        toast.success("Added to list!");
        setAddedLists((prev) => new Set(prev).add(listId));
      } else {
        if (res.error?.includes("duplicate") || res.error?.includes("already exists")) {
             toast.info("Problem is already in this list");
             setAddedLists((prev) => new Set(prev).add(listId));
        } else {
            toast.error(res.error || "Failed to add to list");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("An unexpected error occurred");
    } finally {
      setAddingToListId(null);
    }
  };

  const handleCreateAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("List title is required");
      return;
    }

    setCreatingLoading(true);
    try {
      const createRes = await apiClient.createList({ title: newTitle, isPublic: false });
      
      if (createRes.success && createRes.data?.list) {
        const newList = createRes.data.list;
        const newListId = String(newList._id || "");
        
        setLists((prev) => [newList, ...prev]);
        
        const addRes = await apiClient.addProblemToList(newListId, problemId);
        
        if (addRes.success) {
          toast.success(`Created "${newTitle}" and added problem!`);
          setAddedLists((prev) => new Set(prev).add(newListId));
          setIsCreatingNew(false);
          setNewTitle("");
        } else {
           toast.error("List created, but failed to add problem.");
        }
      } else {
        toast.error(createRes.error || "Failed to create list");
      }
    } catch (err) {
      console.log(err);
      toast.error("An unexpected error occurred");
    } finally {
      setCreatingLoading(false);
    }
  };

  // 4. Return ONLY the Dialog. The trigger buttons are gone!
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(val) => {
        // If the dialog wants to close (val is false), fire the onClose prop
        if (!val) onClose();
      }}
    >
      <DialogContent 
        className="sm:max-w-[425px] p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Save to list</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col max-h-[60vh]">
          <div className="overflow-y-auto p-2 scrollbar-thin">
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : lists.length === 0 ? (
              <div className="text-center p-6 text-sm text-muted-foreground">
                You haven&apos;t created any lists yet.
              </div>
            ) : (
              <div className="space-y-1">
                {lists.map((list) => {
                  const listId = String(list._id || "");
                  const isAdded = addedLists.has(listId);
                  const isAdding = addingToListId === listId;
                  
                  return (
                    <button
                      key={listId}
                      onClick={() => handleAddToList(listId)}
                      disabled={isAdded || isAdding}
                      className="w-full group flex items-center justify-between p-3 flex-row rounded-md hover:bg-muted/50 transition-colors disabled:opacity-80 text-left"
                      type="button"
                    >
                      <span className="font-medium text-sm truncate pr-4">{list.title}</span>
                      
                      {isAdding ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
                      ) : isAdded ? (
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <Plus className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-muted/10">
            {isCreatingNew ? (
              <form onSubmit={handleCreateAndAdd} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="new-list-title" className="text-xs font-semibold">List Title</Label>
                  <Input
                    id="new-list-title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="E.g. Blind 75, To Review..."
                    className="h-8 text-sm"
                    autoFocus
                    maxLength={100}
                    disabled={creatingLoading}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={() => setIsCreatingNew(false)}
                    disabled={creatingLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="h-8 text-xs"
                    disabled={creatingLoading || !newTitle.trim()}
                  >
                    {creatingLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                    Create & Save
                  </Button>
                </div>
              </form>
            ) : (
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 h-10 text-muted-foreground font-medium hover:text-foreground"
                onClick={() => setIsCreatingNew(true)}
                type="button"
              >
                <FolderPlus className="h-4 w-4" />
                Create new list
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
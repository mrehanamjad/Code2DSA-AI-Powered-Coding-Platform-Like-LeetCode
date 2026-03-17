"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient/apiClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";

export interface CreateListModalProps {
  mode?: "create" | "edit";
  initialData?: {
    title: string;
    description: string;
    isPublic: boolean;
  };
  listId?: string; // required if mode === 'edit'
  onSuccess?: () => void;
}

export default function CreateListModal({ 
  mode = "create", 
  initialData, 
  listId,
  onSuccess
}: CreateListModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isPublic, setIsPublic] = useState(initialData?.isPublic || false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);
    try {
      if (mode === "create") {
        const res = await apiClient.createList({ title, description, isPublic });
        if (res.success && res.data) {
          toast.success("List created successfully!");
          setOpen(false);
          setTitle("");
          setDescription("");
          setIsPublic(false);
          if (onSuccess) onSuccess();
          else router.refresh();
        } else {
          toast.error(res.error || "Failed to create list");
        }
      } else if (mode === "edit" && listId) {
        // Edit flow
        const res = await apiClient.updateList(listId, { title, description, isPublic });
        if (res.success && res.data) {
          toast.success("List updated successfully!");
          setOpen(false);
          if (onSuccess) onSuccess();
          else router.refresh();
        } else {
          toast.error(res.error || "Failed to edit list");
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New List
          </Button>
        ) : (
          <Button variant="outline" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit List
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create a Problem List" : "Edit List Details"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Top Interview Questions"
              maxLength={100}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this list about?"
              maxLength={500}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="space-y-0.5">
              <Label htmlFor="public-toggle">Public List</Label>
              <p className="text-xs text-muted-foreground">
                Anyone with the link can view this list.
              </p>
            </div>
            <Switch
              id="public-toggle"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {mode === "create" ? "Create List" : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

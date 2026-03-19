"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import AddToListModal from "@/components/Lists/AddToListModal";

interface SaveToListButtonProps {
  problemId: string;
}

export default function SaveToListButton({ problemId }: SaveToListButtonProps) {
  const { status } = useSession();
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const handleOpenListModal = () => {
    if (status !== "authenticated") {
      toast.info("Please sign in to save to your lists.");
      return;
    }
    setIsListModalOpen(true);
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="gap-1.5 h-8 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
        onClick={handleOpenListModal}
        type="button"
      >
        <BookmarkPlus className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Save to List</span>
        <span className="sm:hidden">Save</span>
      </Button>

      {/* The modal only mounts when open, keeping the DOM perfectly clean */}
      {isListModalOpen && (
        <AddToListModal
          problemId={problemId}
          isOpen={isListModalOpen}
          onClose={() => setIsListModalOpen(false)}
        />
      )}
    </>
  );
}
"use client"

import { ShareLinkDialog } from "../ShareLinkDialog"
import CreateListModal from "./CreateListModal"

interface ShareListButtonProps {
  listName: string
  isPublic: boolean
  listId: string
  listDescription: string
  onUpdateSuccess: () => void
}

export function ShareListButton({
  listName,
  isPublic,
  listId,
  listDescription,
  onUpdateSuccess,
}: ShareListButtonProps) {
  
  // This is the warning UI shown only when the list is private
  const PrivateWarningContent = (
    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-4">
      <div className="flex flex-col items-center text-center gap-2">
        <p className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-widest">
          Action Required
        </p>
        <p className="text-xs text-muted-foreground leading-snug">
          Updating your list status to <span className="text-foreground font-bold italic">Public</span> will enable link sharing instantly.
        </p>
      </div>
      
      <div className="flex justify-center">
        <CreateListModal
          mode="edit"
          listId={listId}
          initialData={{
            title: listName,
            description: listDescription,
            isPublic: isPublic,
          }}
          onSuccess={onUpdateSuccess}
        />
      </div>
    </div>
  );

  return (
    <ShareLinkDialog
      title="Share List"
      description={
        isPublic 
          ? "Anyone with this link can view your curated problem set." 
          : "This list is currently private. You must make it public before others can view it."
      }
      itemName={listName}
      isPublic={isPublic}
      privateStateContent={PrivateWarningContent}
    />
  )
}
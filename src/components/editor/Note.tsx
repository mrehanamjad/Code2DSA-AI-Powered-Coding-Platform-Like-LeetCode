import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PenLine, Save } from "lucide-react";
import { toast } from "sonner";
import { apiClient, SubmissionForProblemI } from "@/lib/apiClient";

function Note({
  submissionId,
  savedNote,
  closeNoteModal,
  setSubmissions,
}: {
  submissionId: string;
  savedNote: string;
  closeNoteModal?: () => void;
  setSubmissions?: (value: React.SetStateAction<SubmissionForProblemI[]>) => void;
}) {
  const [note, setNote] = useState(savedNote || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNote = async (submissionId: string, note: string) => {
    if (!submissionId) return;
    const res = await apiClient.addOrUpdateSubmissionNote(submissionId, note);

    if (res.success) {
      toast.success("Note Saved");
      setSubmissions && setSubmissions((prev) =>
        prev.map((sub) =>
          sub._id.toString() === submissionId
            ? { ...sub, note }
            : sub
        )
      )
      closeNoteModal && closeNoteModal();
    } else {
      toast.error("Failed to save note");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await handleSaveNote(submissionId, note);
    setIsSaving(false);
  };

  return (
      <div className="flex flex-col gap-2">
        <Textarea
          placeholder="Add a note (e.g., Time complexity O(n))..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[80px] text-sm resize-none bg-muted/20 focus:bg-background"
        />
        <div className="flex justify-end gap-2 mt-1.5">
          {closeNoteModal && (
            <Button
                // size="sm"
                variant={"ghost"}
                disabled={isSaving}
              onClick={() => closeNoteModal()}
              className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
            >
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="h-8"
          >
            {isSaving ? (
              <Loader2 className="h-3 w-3 animate-spin mr-2" />
            ) : (
              <Save className="h-3 w-3 mr-2" />
            )}{" "}
            Save Note
          </Button>
        </div>
      </div>
  );
}

export default Note;

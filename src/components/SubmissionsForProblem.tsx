"use client"
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { apiClient } from "@/lib/apiClient/apiClient";
import { Loader2, FilePenLine, Plus, X, ArrowUpRight } from "lucide-react";
import Note from "./editor/Note";
import { SubmissionForProblemI } from "@/lib/apiClient/types";
import SubmissionPopup from "./editor/SubmissionPopup";

interface SubmissionsForProblemProps {
  problemId: string;
  isEditor?: boolean
}

export function SubmissionsForProblem({ problemId, isEditor = true }: SubmissionsForProblemProps) {
  const [submissions, setSubmissions] = useState<SubmissionForProblemI[]>([]);
  const [loading, setLoading] = useState(false);
  // Modal State
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isSubmissionModelOpen, setIsSubmissionModelOpen] = useState(false);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(
    null
  );
  const [noteContent, setNoteContent] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // --- Fetch Submissions ---
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!problemId) return;

      setLoading(true);
      const response = await apiClient.getSubmissionsForProblem(problemId);

      if (response.success && response.data) {
        setSubmissions(response.data);
      } else {
        setSubmissions([]);
      }
      setLoading(false);
    };

    fetchSubmissions();
  }, [problemId]);

  // --- Handlers ---
  const openNoteModal = (submissionId: string, currentNote?: string) => {
    setCurrentSubmissionId(submissionId);
    setNoteContent(currentNote || "");
    setIsNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setIsNoteModalOpen(false);
    setCurrentSubmissionId(null);
    setNoteContent("");
  };

  const openSubmissionModal = (submissionId: string) => {
    setCurrentSubmissionId(submissionId);
    setIsSubmissionModelOpen(true);
  };

  const closeSubmissionModal = () => {
    setIsSubmissionModelOpen(false);
    setCurrentSubmissionId(null);
  };

  // --- Helpers ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "text-green-600 bg-green-500/10";
      case "wrongAnswer":
        return "text-red-600 bg-red-500/10";
      case "tle":
        return "text-yellow-600 bg-yellow-500/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const formatStatus = (status: string) => {
    if (status === "tle") return "Time Limit Exceeded";
    return status
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const formatDate = (dateString?: Date | string) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Less than 1 minute
    if (diffInSeconds < 60) return "Just now";

    // Less than 1 hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }

    // Less than 24 hours
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }

    // Older than 24 hours
    return date.toLocaleDateString();
  };

 

  return (
    <>
      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : submissions.length > 0 ? (
        <div className="rounded-md border w-full overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[600px]">
            <thead className="bg-muted/50 text-muted-foreground border-b">
              <tr>
                <th className="h-10 px-4 font-medium whitespace-nowrap"></th>
                <th className="h-10 px-4 font-medium whitespace-nowrap">Status</th>
                <th className="h-10 px-4 font-medium whitespace-nowrap">Language</th>
                <th className="h-10 px-4 font-medium whitespace-nowrap">Date</th>
                <th className="h-10 px-4 font-medium whitespace-nowrap">Note</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr
                  key={sub._id.toString()}
                  className="border-b transition-colors hover:bg-muted/30"
                >
                  <td className="p-4">
                    <button  onClick={() => openSubmissionModal(sub._id.toString())} >
                    <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(
                        sub.status
                      )}`}
                    >
                      {formatStatus(sub.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary" className="font-normal">
                      {sub.language}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground whitespace-nowrap">
                    {formatDate(sub.createdAt)}
                  </td>
                  <td className="p-4">
                    {sub.note ? (
                      <div
                        onClick={() => openNoteModal(sub._id.toString(), sub.note)}
                        className="group flex items-center gap-2 cursor-pointer text-foreground/80 hover:text-primary transition-colors"
                      >
                        <FilePenLine className="w-4 h-4 opacity-70 shrink-0" />
                        <span className="max-w-[150px] truncate block">
                          {sub.note}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => openNoteModal(sub._id.toString(), "")}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                      >
                        <Plus className="w-3 h-3" /> Add Note
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card className="p-6 bg-card">
          <p className="text-muted-foreground text-center">
            No submissions yet.
          </p>
        </Card>
      )}

      {/* --- Global Modal/Popup Overlay --- */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200 border-border/40 bg-background/95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Submission Note</h3>
              <button
                onClick={closeNoteModal}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            
            <Note submissionId={currentSubmissionId!} savedNote={noteContent} closeNoteModal={closeNoteModal} setSubmissions={setSubmissions} />
          </Card>
        </div>
      )}
      {isSubmissionModelOpen && (
        <SubmissionPopup 
          isEditor={isEditor}
          submissionId={currentSubmissionId!}
          closeModel={closeSubmissionModal}
          setSubmissionsForSubmissionTable={setSubmissions}
          
        />
      )}
    </>
  );
}
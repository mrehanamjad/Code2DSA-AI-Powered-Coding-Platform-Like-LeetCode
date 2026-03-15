"use client";
import { apiClient } from "@/lib/apiClient/apiClient";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import SubmissionStract from "./SubmissionStract";
import { Loader2, X } from "lucide-react";
import { SubmissionForProblemI, SubmissionResponseT } from "@/lib/apiClient/types";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

function SubmissionPopup({
  submissionId,
  isEditor = true,
  closeModel,
  setSubmissionsForSubmissionTable,
}: {
  submissionId: string;
  isEditor?: boolean;
  closeModel: () => void;
  setSubmissionsForSubmissionTable?: (
    value: React.SetStateAction<SubmissionForProblemI[]>
  ) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [submission, setSubmission] = useState<SubmissionResponseT | null>(null);

  // --- Fetch Submissions ---
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!submissionId) return;
      setLoading(true);
      const response = await apiClient.getSubmissionDetailById(submissionId);
      console.log(response);
      if (response.success && response.data) {
        setSubmission(response.data);
      } else {
        toast.error("Something went wrong");
      }
      setLoading(false);
    };

    fetchSubmissions();
  }, [submissionId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 w-full h-full">
        <Card className="w-full h-full flex items-center justify-center max-w-4xl p-6 shadow-xl animate-in fade-in duration-200 border-border/40 bg-background/95">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Card>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 w-full h-full">
        <Card className="w-full h-full flex flex-col items-center justify-center max-w-4xl p-6 shadow-xl animate-in fade-in duration-200 border-border/40 bg-background/95">
          <div className="text-muted-foreground mb-4">
            Submission not found
          </div>
          <Button variant="outline" onClick={closeModel}>
            Close
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 w-full h-full">
      <Card className="w-full h-full overflow-auto max-w-4xl p-6 shadow-xl animate-in fade-in zoom-in duration-200 border-border/40 bg-background/95">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Submission Detail</h3>
          <button
            onClick={closeModel}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl lg:text-2xl font-bold">
            {submission?.problemId?.title}
          </h3>
          {!isEditor && (
            <Link href={`/problems/${submission.problemId?.problemId}`}>
              <Button>Open in Editor</Button>
            </Link>
          )}
        </div>
        <SubmissionStract
          status={
            submission?.status
              .replace(/([a-z0-9])([A-Z])/g, "$1_$2") // Insert an underscore
              .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2") // handle edge cases like HTTPServer" → "HTTP_Server
              .toUpperCase() as string
          }
          code={submission?.code ?? ""}
          error={submission?.error ?? ""}
          language={submission?.language ?? ""}
          note={submission?.note ?? ""}
          totalTestCases={submission?.totalTestCases ?? 0}
          passedTestCases={submission?.passedTestCases ?? 0}
          submissionId={submission?._id.toString()}
          executionTime={submission?.executionTime}
          memoryUsed={submission?.memoryUsed}
          testDetail={
            submission?.lastFailedTestCase
              ? {
                  inputs: JSON.parse(submission.lastFailedTestCase.input || "[]"),
                  expected: JSON.parse(submission.lastFailedTestCase.expectedOutput || "null"),
                  output: JSON.parse(submission.lastFailedTestCase.actualOutput || "null"),
                  error: submission.lastFailedTestCase.error,
                  isPassed: false,
                  paramNames: submission?.problemId?.function?.params ?? [],
                }
              : undefined
          }
          problemStatement={submission?.problemId?.description ?? ""}
          setSubmissionsForSubmissionTable={setSubmissionsForSubmissionTable}
        />
      </Card>
    </div>
  );
}

export default SubmissionPopup;
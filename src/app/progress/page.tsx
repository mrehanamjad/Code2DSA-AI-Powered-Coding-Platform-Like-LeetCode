"use client";

import { useEffect, useState, Fragment } from "react";
import { format } from "date-fns";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SubmissionsForProblem } from "@/components/SubmissionsForProblem";
import Link from "next/link";

// --- Import your nested component here ---
// import { SubmissionsForProblem } from "@/components/SubmissionsForProblem";

// Temporary placeholder if you don't have the component file yet
// const SubmissionsForProblem = ({ problemId }: { problemId: string }) => (
//   <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-md border border-dashed border-border">
//     {/* This is where your actual component renders */}
//     <p>Loading specific submissions for problem ID: {problemId}...</p>
//     <p className="text-xs mt-1">(Replace this placeholder with your actual component)</p>
//   </div>
// );

// --- Types ---
type SubmissionGroup = {
  problemId: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  frontendProblemId: string;
  topics: string[];
  lastSubmittedAt: string;
  lastStatus:
    | "accepted"
    | "wrongAnswer"
    | "runtimeError"
    | "compileError"
    | "tle";
  totalSubmissions: number;
  isSolved: boolean;
};

type ApiResponse = {
  docs: SubmissionGroup[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type FilterType = "All" | "Easy" | "Medium" | "Hard";

// --- Helpers ---
const getDifficultyColor = (diff: string) => {
  switch (diff.toLowerCase()) {
    case "easy":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    case "medium":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "hard":
      return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    default:
      return "text-slate-500 bg-slate-500/10";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "accepted":
      return "text-foreground";
    case "wrongAnswer":
      return "text-red-400";
    default:
      return "text-muted-foreground";
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case "accepted":
      return "Accepted";
    case "wrongAnswer":
      return "Wrong Answer";
    case "runtimeError":
      return "Runtime Error";
    case "tle":
      return "TLE";
    case "compileError":
      return "Compile Error";
    default:
      return status;
  }
};

export default function PracticeHistory() {
  const [data, setData] = useState<SubmissionGroup[]>([]);
  const [pagination, setPagination] = useState<Partial<ApiResponse>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State
  const [filter, setFilter] = useState<FilterType>("All");
  const [page, setPage] = useState(1);
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      // Reset expansion when page/filter changes
      setExpandedProblemId(null);

      try {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("limit", "10");
        if (filter !== "All") params.set("difficulty", filter);

        const res = await fetch(`/api/submissions/user?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load history");

        const json: ApiResponse = await res.json();
        setData(json.docs || []);
        setPagination(json);
      } catch (err) {
        setError("Could not load your practice history.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter, page]);

  // Toggle Row Function
  const toggleRow = (id: string) => {
    setExpandedProblemId((prev) => (prev === id ? null : id));
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setPage(1);
  };

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground">
        <AlertCircle className="h-10 w-10 text-destructive/50" />
        <p>{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/5 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Practice History
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your progress and review past submissions.
            </p>
          </div>

          <div className="flex items-center p-1 bg-muted/50 rounded-lg border border-border/50">
            {(["All", "Easy", "Medium", "Hard"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                  filter === f
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card className="border-border/60 bg-card shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <div className="min-h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b border-border/60">
                        <TableHead className="w-[180px] pl-6 font-medium">
                          Last Submitted
                        </TableHead>
                        <TableHead className="w-[450px] font-medium">
                          Problem
                        </TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="text-right pr-6 font-medium">
                          Attempts
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="h-48 text-center text-muted-foreground"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Clock className="h-8 w-8 opacity-20" />
                              <p>No submissions found.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.map((item) => (
                          <Fragment key={item.problemId}>
                            <TableRow
                              className={cn(
                                "group transition-colors cursor-pointer border-b border-border/40 last:border-0",
                                expandedProblemId === item.problemId
                                  ? "bg-muted/50 border-b-0"
                                  : "hover:bg-muted/40"
                              )}
                            >
                              {/* Date */}
                              <TableCell className="align-top pl-6 py-5 text-muted-foreground font-mono text-sm">
                                {format(
                                  new Date(item.lastSubmittedAt),
                                  "MMM dd, yyyy"
                                )}
                              </TableCell>

                              {/* Problem Info */}
                              <TableCell className="align-top py-5">
                                <div className="flex items-start gap-3.5">
                                  <div className="mt-0.5">
                                    {item.isSolved ? (
                                      <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
                                    ) : (
                                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Link
                                        href={`/problems/${item.frontendProblemId}`}
                                        target="_blank"
                                        className="font-semibold text-base text-foreground group-hover:text-primary transition-colors truncate max-w-[250px]"
                                      >
                                        {item.title}
                                      </Link>

                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "rounded-md px-1.5 py-0 text-[10px] font-medium uppercase tracking-wider border",
                                          getDifficultyColor(item.difficulty)
                                        )}
                                      >
                                        {item.difficulty}
                                      </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {item.topics.slice(0, 3).map((tag) => (
                                        <span
                                          key={tag}
                                          className="inline-flex items-center rounded-sm bg-secondary/50 px-2 py-0.5 text-xs text-muted-foreground border border-border/50"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                      {item.topics.length > 3 && (
                                        <span className="text-xs text-muted-foreground/60 px-1 py-0.5">
                                          +{item.topics.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>

                              {/* Status */}
                              <TableCell className="align-top py-5">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={cn(
                                      "h-2 w-2 rounded-full",
                                      item.lastStatus === "accepted"
                                        ? "bg-foreground"
                                        : "bg-destructive/60"
                                    )}
                                  />
                                  <span
                                    className={cn(
                                      "font-medium text-sm",
                                      getStatusColor(item.lastStatus)
                                    )}
                                  >
                                    {formatStatus(item.lastStatus)}
                                  </span>
                                </div>
                              </TableCell>

                              {/* Attempts Button */}
                              <TableCell
                                onClick={() => toggleRow(item.problemId)}
                                className="align-top text-right pr-6 py-5"
                              >
                                <div
                                  className={cn(
                                    "inline-flex items-center justify-between gap-3 text-muted-foreground bg-secondary/30 pl-3 pr-2 py-1.5 rounded-md border border-transparent transition-all w-20",
                                    expandedProblemId === item.problemId
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "group-hover:border-border"
                                  )}
                                >
                                  <span className="text-sm font-medium">
                                    {item.totalSubmissions}
                                  </span>
                                  <ChevronDown
                                    className={cn(
                                      "h-4 w-4 opacity-50 transition-transform duration-200",
                                      expandedProblemId === item.problemId &&
                                        "rotate-180 opacity-100"
                                    )}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>

                            {/* EXPANDABLE ROW */}
                            {expandedProblemId === item.problemId && (
                              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/40 animate-in fade-in-0 zoom-in-95 duration-200">
                                <TableCell colSpan={4} className="p-4 sm:p-6">
                                  <div className="rounded-lg border bg-background p-1 shadow-sm">
                                    {/* Render the Nested Component */}
                                    <SubmissionsForProblem
                                      problemId={item.problemId}
                                      isEditor={false}
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </Fragment>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination.totalPages && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-border/60 px-6 py-4 bg-muted/20">
                    <div className="text-sm text-muted-foreground">
                      Page {page} of {pagination.totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={!pagination.hasPrevPage}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!pagination.hasNextPage}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-start justify-between gap-4">
          <Skeleton className="h-4 w-24 mt-1" />
          <div className="flex-1 space-y-3">
            <div className="flex gap-2 items-center">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex gap-2 pl-7">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-24 mt-1" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}

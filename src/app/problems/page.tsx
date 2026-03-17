import { Suspense } from "react";
import ProblemTable from "@/components/Problems/ProblemTable";
import SearchInput from "@/components/Problems/SearchInput";
import FilterToggleWrapper from "@/components/Problems/FilterToggleWrapper"; // New small wrapper
import { ProblemI } from "@/models/problem.model";
import { SortSelect } from "@/components/Problems/SortSelect";
import PaginationControls from "@/components/PaginationControls";
import mongoose from "mongoose";

// Force dynamic rendering if your API is not static,
// though searchParams usually forces dynamic anyway in Next 15.
export const dynamic = "force-dynamic";

export interface ProblemResponse {
  problems: ProblemI[];
  paginator: {
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    next: number | null;
    pageSize: number;
    prev: number | null;
    slNo: number;
    totalPages: number;
    totalProblems: number;
  };
}

async function getProblems(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  // Convert object params to URLSearchParams string
  const query = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) query.append(key, value as string);
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/problems?${query.toString()}`, {
      cache: "no-store", // Ensure fresh data on every request
    });

    if (!res.ok) throw new Error("Failed to fetch problems");
    const data = await res.json()
    console.log("res",data);

    return data as Promise<ProblemResponse>;
  } catch (error) {
    console.error(error);
    return { problems: [], total: 0, page: 1, totalPages: 1 };
  }
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProblemsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // 2. Fetch data server-side
  const data = (await getProblems(params)) as ProblemResponse;

  if (!data)
    return (
      <div className="min-h-screen bg-background flex justify-center items-center text-xl">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar Filter - Wrapped in Suspense because it uses useSearchParams */}
        <Suspense fallback={<div className="w-72 hidden lg:block border-r" />}>
          <FilterToggleWrapper />
        </Suspense>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Practice Problems
            </h1>
            <p className="text-muted-foreground">
              Master algorithms and data structures with our curated problem set
            </p>
          </div>

          <div className="mb-6 space-y-4">
            {/* Search - Suspense needed for useSearchParams */}
            <Suspense
              fallback={
                <div className="h-10 w-full bg-secondary/50 rounded-md animate-pulse" />
              }
            >
              <SearchInput />
            </Suspense>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Mobile Filter Toggle is inside FilterToggleWrapper */}

                {/* Sort Control */}
                <SortSelect />
              </div>

              <span className="text-sm text-muted-foreground">
                {data.paginator.pageSize} problems
              </span>
            </div>
          </div>

          <ProblemTable problems={
            data.problems.map((problem) => ({
              _id: problem._id as string,
              title: problem.title,
              difficulty: problem.difficulty,
              topics: problem.topics,
              problemId: problem.problemId,
              // status: problem.status,  
            }))
            } />

          {/* Pagination Controls */}
          <div className="mt-8">
            <PaginationControls
              currentPage={data.paginator.currentPage}
              totalPages={data.paginator.totalPages}
              hasNextPage={data.paginator.hasNextPage}
              hasPrevPage={data.paginator.hasPrevPage}
            />
          </div>
          
        </main>
      </div>
    </div>
  );
}

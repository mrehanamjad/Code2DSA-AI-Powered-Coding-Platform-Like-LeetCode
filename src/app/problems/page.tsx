import { Suspense } from "react";
import FilterPanel from "@/components/FilterPanel";
import ProblemTable from "@/components/ProblemTable";
import SearchInput from "@/components/SearchInput";
import FilterToggleWrapper from "@/components/FilterToggleWrapper"; // New small wrapper
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProblemI } from "@/models/problem.model";
import { SortSelect } from "@/components/SortSelect";

// Force dynamic rendering if your API is not static, 
// though searchParams usually forces dynamic anyway in Next 15.
export const dynamic = 'force-dynamic';

export interface ProblemResponse {
  problems: ProblemI[];
  total: number;
  page: number;
  totalPages: number;
}

async function getProblems(searchParams: { [key: string]: string | string[] | undefined }) {
  // Convert object params to URLSearchParams string
  const query = new URLSearchParams();
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) query.append(key, value as string);
  });

  try {
    const res = await fetch(`http://localhost:3000/api/problems?${query.toString()}`, {
      cache: "no-store", // Ensure fresh data on every request
    });

    if (!res.ok) throw new Error("Failed to fetch problems");

    return res.json() as Promise<ProblemResponse>;
  } catch (error) {
    console.error(error);
    return { problems: [], total: 0, page: 1, totalPages: 1 };
  }
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProblemsPage({ searchParams }: PageProps) {
  // 1. Await params in Next.js 15
  const params = await searchParams;
  
  // 2. Fetch data server-side
  const data = await getProblems(params);

  if (!data) return <div>Loading...</div>;

  console.log(data)

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar Filter - Wrapped in Suspense because it uses useSearchParams */}
        <Suspense fallback={<div className="w-72 hidden lg:block border-r" />}>
           <FilterToggleWrapper />
        </Suspense>
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Practice Problems</h1>
            <p className="text-muted-foreground">
              Master algorithms and data structures with our curated problem set
            </p>
          </div>

          <div className="mb-6 space-y-4">
            {/* Search - Suspense needed for useSearchParams */}
            <Suspense fallback={<div className="h-10 w-full bg-secondary/50 rounded-md animate-pulse" />}>
              <SearchInput />
            </Suspense>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Mobile Filter Toggle is inside FilterToggleWrapper */}
                
                {/* Sort Control */}
                {/* To make this functional, you would create a generic client wrapper 
                    like <SortSelect /> similar to SearchInput */}
                <SortSelect />
              </div>

              <span className="text-sm text-muted-foreground">
                {data.total} problems
              </span>
            </div>
          </div>

          <ProblemTable problems={data.problems} />

          {/* Pagination would go here, utilizing params.page */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
             Page {data.page} of {data.totalPages}
          </div>
        </main>
      </div>
    </div>
  );
}
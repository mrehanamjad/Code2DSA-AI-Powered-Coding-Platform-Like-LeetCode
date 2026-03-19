import { Suspense } from "react";
import FilterToggleWrapper from "@/components/Problems/FilterToggleWrapper";
import SearchInput from "@/components/Problems/SearchInput";
import { SortSelect } from "@/components/Problems/SortSelect";
import ProblemListFetcher from "@/components/Problems/ProblemListFetcher"; // We will create this
import { ProblemTableSkeleton } from "@/components/Skeletons/ProblemTableSkeleton";
import Container from "@/components/Container";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProblemsPage({ searchParams }: PageProps) {


  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
          <FilterToggleWrapper />

        <Container>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Practice Problems</h1>
            <p className="text-muted-foreground">Master algorithms and data structures...</p>
          </div>

          <div className="mb-6 space-y-4">
              <SearchInput />

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                <SortSelect />
              </div>
            </div>
          </div>

          {/* Wrap the heavy data fetcher in Suspense */}
          <Suspense fallback={
            <ProblemTableSkeleton rowCount={6} />
          }>
            <ProblemListFetcher searchParams={searchParams} />
          </Suspense>

        </main>
        </Container>
      </div>
    </div>
  );
}
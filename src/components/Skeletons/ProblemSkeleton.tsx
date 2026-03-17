export function ProblemSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header Skeleton */}
      <div className="border-b border-border px-6 py-3 flex items-center justify-between shrink-0 h-[60px]">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded bg-muted animate-pulse" />
          <div className="h-6 w-32 rounded bg-muted animate-pulse hidden sm:block" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-24 rounded bg-muted animate-pulse" />
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        </div>
      </div>

      {/* Main Layout Skeleton */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel (Description) - Hidden on mobile if needed, but good for generic load */}
        <div className="hidden md:flex w-[25%] flex-col gap-4 p-4 border-r border-border">
          <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
          </div>
          <div className="mt-8 space-y-2">
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
            <div className="h-20 w-full bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Middle Panel (Editor) */}
        <div className="flex-1 flex flex-col border-r border-border">
          {/* Editor Tabs Skeleton */}
          <div className="h-10 border-b border-border flex items-center px-2 gap-2">
             <div className="h-6 w-24 bg-muted animate-pulse rounded" />
          </div>
          {/* Code Area Skeleton */}
          <div className="flex-1 p-4 space-y-3">
            <div className="h-4 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded ml-4" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded ml-8" />
            <div className="h-4 w-36 bg-muted animate-pulse rounded ml-4" />
          </div>
        </div>

        {/* Right Panel (Chat/Console) */}
        <div className="hidden md:flex w-[25%] flex-col p-4 gap-3">
          <div className="h-8 w-1/2 bg-muted animate-pulse rounded" />
          <div className="flex-1 bg-muted/20 animate-pulse rounded border border-border" />
          <div className="h-10 w-full bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
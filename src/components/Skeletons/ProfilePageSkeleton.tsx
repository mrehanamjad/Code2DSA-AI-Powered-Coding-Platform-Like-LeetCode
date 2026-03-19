import { Card } from "@/components/ui/card";

// Reusable pulsing bar
const SkeletonBar = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-muted/50 rounded ${className}`} />
);

// Matching your StatCard design
const StatCardSkeleton = () => (
  <Card className="p-6 flex items-start justify-between border-border/50">
    <div className="space-y-3 flex-1">
      <SkeletonBar className="h-3 w-20" /> {/* Title */}
      <SkeletonBar className="h-8 w-12" /> {/* Value */}
    </div>
    <div className="h-11 w-11 rounded-xl bg-muted/50 animate-pulse" /> {/* Icon box */}
  </Card>
);

const SidebarCardSkeleton = ({ titleWidth = "w-24" }: { titleWidth?: string }) => (
  <Card className="p-6 border-border/50 space-y-4">
    <SkeletonBar className={`h-5 ${titleWidth}`} /> {/* Section Title */}
    <div className="space-y-3">
      <div className="h-12 w-full bg-muted/30 rounded-lg animate-pulse" />
      <div className="h-12 w-full bg-muted/30 rounded-lg animate-pulse" />
    </div>
  </Card>
);

export default function ProfilePageSkeleton() {
  return (
    <div className="space-y-6">
      {/* --- HEADER SKELETON --- */}
      <Card className="p-6 border-border/50">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="h-32 w-32 rounded-full bg-muted/50 animate-pulse shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <SkeletonBar className="h-8 w-48" /> {/* Name */}
                <SkeletonBar className="h-4 w-32" /> {/* Username */}
              </div>
              <SkeletonBar className="h-9 w-24 rounded-md" /> {/* Edit Button */}
            </div>
            <SkeletonBar className="h-4 w-full max-w-md" /> {/* Bio Line 1 */}
            <SkeletonBar className="h-4 w-3/4 max-w-sm" />  {/* Bio Line 2 */}
            <div className="flex gap-2">
              <SkeletonBar className="h-6 w-16 rounded-full" /> {/* Tag */}
              <SkeletonBar className="h-6 w-16 rounded-full" /> {/* Tag */}
            </div>
          </div>
        </div>
      </Card>

      <div className="md:grid md:grid-cols-4 gap-6 px-4">
        {/* --- MAIN CONTENT (col-span-3) --- */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Top 4 Hero Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          {/* Lower Stats & Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            {/* 2x2 Grid of secondary stats */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>

            {/* Large Donut Chart Card */}
            <Card className="lg:col-span-3 p-6 flex flex-col items-center justify-center border-border/50">
              <SkeletonBar className="h-5 w-32 mb-8" />
              <div className="h-40 w-40 rounded-full border-[12px] border-muted/30 animate-pulse flex items-center justify-center">
                <div className="space-y-2 flex flex-col items-center">
                   <SkeletonBar className="h-6 w-10" />
                   <SkeletonBar className="h-3 w-14" />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <SkeletonBar className="h-3 w-12" />
                <SkeletonBar className="h-3 w-12" />
                <SkeletonBar className="h-3 w-12" />
              </div>
            </Card>
          </div>

          {/* Contribution Graph Placeholder */}
          <Card className="p-6 h-48 border-border/50">
             <SkeletonBar className="h-5 w-48 mb-4" />
             <div className="grid grid-cols-24 gap-1"> {/* Simplified grid */}
                {Array.from({ length: 50 }).map((_, i) => (
                  <div key={i} className="h-3 w-3 bg-muted/30 rounded-sm animate-pulse" />
                ))}
             </div>
          </Card>
        </div>

        {/* --- SIDEBAR (col-span-1) --- */}
        <div className="md:col-span-1 space-y-6">
          <SidebarCardSkeleton titleWidth="w-28" /> {/* Languages */}
          <SidebarCardSkeleton titleWidth="w-20" /> {/* Skills */}
        </div>
      </div>
    </div>
  );
}
"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current sort value from URL or default to 'newest'
  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (value: string) => {
    // Create new URLSearchParams object to preserve existing filters (difficulty, etc.)
    const params = new URLSearchParams(searchParams.toString());
    
    // Update the sort parameter
    params.set("sort", value);
    
    // Optional: Reset to page 1 if sorting changes, as the order of items changes entirely
    params.set("page", "1"); 

    // Update URL without refreshing the page
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[140px] md:w-[200px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Most Recent</SelectItem>
        <SelectItem value="oldest">Oldest</SelectItem>
        <SelectItem value="difficulty_asc">Difficulty (Easy to Hard)</SelectItem>
        <SelectItem value="difficulty_desc">Difficulty (Hard to Easy)</SelectItem>
        <SelectItem value="title_asc">Title (A-Z)</SelectItem>
        <SelectItem value="title_desc">Title (Z-A)</SelectItem>
      </SelectContent>
    </Select>
  );
}
"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; // Optional: npm i use-debounce OR use manual timeout
// *If you don't want a library, I implemented a manual debounce below*

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    
    // Reset page to 1 when searching
    params.set('page', '1');

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    replace(`${pathname}?${params.toString()}`);
  };

  // Manual debounce implementation
  let timeoutId: NodeJS.Timeout;
  const debouncedSearch = (term: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => handleSearch(term), 300);
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search problems..."
        className="pl-9 bg-secondary/50 border-border focus:bg-background"
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => debouncedSearch(e.target.value)}
      />
    </div>
  );
}
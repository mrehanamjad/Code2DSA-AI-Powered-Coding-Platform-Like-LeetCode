"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);

    // Reset page to 1 when searching
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  // Debounced function (stable across renders)
  const debouncedSearch = useDebouncedCallback(
    (term: string) => {
      handleSearch(term);
    },
    300 // delay in ms
  );

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

      <Input
        type="search"
        placeholder="Search problems..."
        className="pl-9 bg-secondary/50 border-border focus:bg-background"
        defaultValue={searchParams.get("query") ?? ""}
        onChange={(e) => debouncedSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            debouncedSearch.flush();
          }
        }}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import FilterPanel from "./FilterPanel";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export default function FilterToggleWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FilterPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      
      {/* Mobile Toggle Button Portal or Fixed Position if needed, 
          or logic to render this button inside the main layout via context. 
          For simplicity, we render the logical structure here. */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
         <Button 
            className="rounded-full shadow-lg" 
            size="lg" 
            onClick={() => setIsOpen(true)}
         >
            <Filter className="h-4 w-4 mr-2" /> Filters
         </Button>
      </div>
    </>
  );
}
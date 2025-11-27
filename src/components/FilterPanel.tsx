// "use client";

// import { Filter, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useCallback } from "react";

// interface FilterPanelProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const FilterPanel = ({ isOpen, onClose }: FilterPanelProps) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Helper to get array from comma-separated params
//   const getParamArray = (key: string) => {
//     const param = searchParams.get(key);
//     return param ? param.split(",") : [];
//   };

//   const selectedDifficulty = getParamArray("difficulty");
//   const selectedTopics = getParamArray("topics");
//   const selectedStatus = getParamArray("status");

//   const updateFilters = useCallback(
//     (key: string, value: string) => {
//       const current = new URLSearchParams(Array.from(searchParams.entries()));
//       const currentValues = current.get(key)?.split(",") || [];

//       let newValues;
//       if (currentValues.includes(value)) {
//         newValues = currentValues.filter((v) => v !== value);
//       } else {
//         newValues = [...currentValues, value];
//       }

//       if (newValues.length > 0) {
//         current.set(key, newValues.join(","));
//       } else {
//         current.delete(key);
//       }
      
//       // Reset page when filtering
//       current.set("page", "1");

//       router.push(`?${current.toString()}`, { scroll: false });
//     },
//     [searchParams, router]
//   );

//   const resetFilters = () => {
//     router.push("?", { scroll: false });
//   };

//   const difficulties = ["Easy", "Medium", "Hard"];
//   const statuses = ["Solved", "Attempted", "Unsolved"];
//   // In a real app, topics might also come from an API
//   const topics = ["Array", "String", "Hash Table", "Dynamic Programming", "Math", "Tree", "Graph"];

//   return (
//     <aside
//       className={`
//         fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-card border-r z-40
//         transition-transform duration-300 ease-in-out
//         ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//       `}
//     >
//       <div className="flex items-center justify-between p-4 border-b">
//         <div className="flex items-center gap-2">
//           <Filter className="h-5 w-5 text-primary" />
//           <h2 className="font-semibold">Filters</h2>
//         </div>
//         <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
//           <X className="h-5 w-5" />
//         </Button>
//       </div>

//       <ScrollArea className="h-[calc(100%-4rem)]">
//         <div className="p-4 space-y-6">
//           {/* Difficulty */}
//           <div className="space-y-3">
//             <h3 className="text-sm font-semibold">Difficulty</h3>
//             {difficulties.map((diff) => (
//               <div key={diff} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`diff-${diff}`}
//                   checked={selectedDifficulty.includes(diff)}
//                   onCheckedChange={() => updateFilters("difficulty", diff)}
//                 />
//                 <Label htmlFor={`diff-${diff}`} className="text-sm cursor-pointer hover:text-primary">
//                   {diff}
//                 </Label>
//               </div>
//             ))}
//           </div>
//           <Separator />
          
//            {/* Status */}
//            <div className="space-y-3">
//             <h3 className="text-sm font-semibold">Status</h3>
//             {statuses.map((status) => (
//               <div key={status} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`status-${status}`}
//                   checked={selectedStatus.includes(status)}
//                   onCheckedChange={() => updateFilters("status", status)}
//                 />
//                 <Label htmlFor={`status-${status}`} className="text-sm cursor-pointer hover:text-primary">
//                   {status}
//                 </Label>
//               </div>
//             ))}
//           </div>
//           <Separator />

//           {/* Topics */}
//           <div className="space-y-3">
//             <h3 className="text-sm font-semibold">Topics</h3>
//             {topics.map((topic) => (
//               <div key={topic} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`topic-${topic}`}
//                   checked={selectedTopics.includes(topic)}
//                   onCheckedChange={() => updateFilters("topics", topic)}
//                 />
//                 <Label htmlFor={`topic-${topic}`} className="text-sm cursor-pointer hover:text-primary">
//                   {topic}
//                 </Label>
//               </div>
//             ))}
//           </div>

//           <Separator />
//           <Button variant="outline" className="w-full" onClick={resetFilters}>
//             Reset Filters
//           </Button>
//         </div>
//       </ScrollArea>
//     </aside>
//   );
// };

// export default FilterPanel;


"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import Radio Components
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterPanel = ({ isOpen, onClose }: FilterPanelProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper to get array from comma-separated params
  const getParamArray = (key: string) => {
    const param = searchParams.get(key);
    return param ? param.split(",") : [];
  };

  const selectedDifficulty = searchParams.get("difficulty") || ""; // Single string for Radio
  const selectedTopics = getParamArray("topics");
  const selectedStatus = getParamArray("status");

  // 1. Function for Multi-Select (Checkboxes)
  const updateArrayFilters = useCallback(
    (key: string, value: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      const currentValues = current.get(key)?.split(",") || [];

      let newValues;
      if (currentValues.includes(value)) {
        newValues = currentValues.filter((v) => v !== value);
      } else {
        newValues = [...currentValues, value];
      }

      if (newValues.length > 0) {
        current.set(key, newValues.join(","));
      } else {
        current.delete(key);
      }
      
      current.set("page", "1");
      router.push(`?${current.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // 2. Function for Single-Select (Radio Buttons)
  const updateSingleFilter = useCallback(
    (key: string, value: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      // Simply replace the value
      current.set(key, value);
      
      current.set("page", "1");
      router.push(`?${current.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const resetFilters = () => {
    router.push("?", { scroll: false });
  };

  const difficulties = ["Easy", "Medium", "Hard"];
  const statuses = ["Solved", "Attempted", "Unsolved"];
  const topics = ["Array", "String", "Hash Table", "Dynamic Programming", "Math", "Tree", "Graph"];

  return (
    <aside
      className={`
        fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-card border-r z-40
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Filters</h2>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100%-4rem)]">
        <div className="p-4 space-y-6">
          
          {/* Difficulty - NOW USING RADIO BUTTONS */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Difficulty</h3>
            <RadioGroup 
                value={selectedDifficulty} 
                onValueChange={(val) => updateSingleFilter("difficulty", val)}
            >
              {difficulties.map((diff) => (
                <div key={diff} className="flex items-center space-x-2">
                  <RadioGroupItem value={diff} id={`diff-${diff}`} />
                  <Label htmlFor={`diff-${diff}`} className="text-sm cursor-pointer hover:text-primary">
                    {diff}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <Separator />
          
           {/* Status - Kept as Checkbox for flexibility */}
           <div className="space-y-3">
            <h3 className="text-sm font-semibold">Status</h3>
            {statuses.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={selectedStatus.includes(status)}
                  onCheckedChange={() => updateArrayFilters("status", status)}
                />
                <Label htmlFor={`status-${status}`} className="text-sm cursor-pointer hover:text-primary">
                  {status}
                </Label>
              </div>
            ))}
          </div>
          <Separator />

          {/* Topics - Kept as Checkbox (Must be multi-select usually) */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Topics</h3>
            {topics.map((topic) => (
              <div key={topic} className="flex items-center space-x-2">
                <Checkbox
                  id={`topic-${topic}`}
                  checked={selectedTopics.includes(topic)}
                  onCheckedChange={() => updateArrayFilters("topics", topic)}
                />
                <Label htmlFor={`topic-${topic}`} className="text-sm cursor-pointer hover:text-primary">
                  {topic}
                </Label>
              </div>
            ))}
          </div>

          <Separator />
          <Button variant="outline" className="w-full" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default FilterPanel;
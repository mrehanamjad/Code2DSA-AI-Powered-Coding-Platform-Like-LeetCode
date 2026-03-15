"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Search, SlidersHorizontal, Loader2 } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ProblemTable from "@/components/ProblemTable";


import { ProblemI } from "@/models/problem.model";

export default function ProblemsPage() {
  const router = useRouter();
  
  // State
  const [problems, setProblems] = useState<ProblemI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // used in handleDelete

  // Fetch Problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/problems?limit=100");
        if (!res.ok) throw new Error("Failed to fetch problems");
        const data = await res.json();
        setProblems(data.problems || []);
      } catch (_) {
        toast.error("Failed to load problems from server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Filtered Logic
  const filteredProblems = useMemo(() => {
    return problems.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.problemId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [problems, searchQuery]);

  const handleDelete = async (problemId: string) => {
    if (!window.confirm(`Are you sure you want to delete ${problemId}?`)) return;
    
    setIsDeleting(problemId);
    
    try {
      const res = await fetch(`/api/problems/${problemId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      
      setProblems((prev) => prev.filter((p) => p.problemId !== problemId));
      
      toast.success(`Successfully deleted ${problemId}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete the problem.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b pb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Challenge Inventory
            </h1>
            <p className="text-muted-foreground text-lg">
              Monitor, edit, and curate your platform&apos;s coding challenges.
            </p>
          </div>
          
          <Button 
            onClick={() => router.push("/admin/problems/add")}
            className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all h-11 px-6 rounded-xl"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Problem
          </Button>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by title or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-card border-border/60 rounded-xl focus-visible:ring-primary/20 transition-all"
            />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          
          <div className="ml-auto text-sm text-muted-foreground font-medium bg-muted/50 px-3 py-1.5 rounded-full">
            Total: {filteredProblems.length} Problems
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
          {isLoading ? (
             <div className="py-20 flex flex-col items-center justify-center gap-4">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
               <p className="text-muted-foreground">Loading challenges...</p>
             </div>
          ) : (
            <>
              <ProblemTable 
                problems={filteredProblems} 
                onDelete={handleDelete} 
                admin={true}
              />
              
              {filteredProblems.length === 0 && (
                <div className="py-20 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No problems found</h3>
                  <p className="text-muted-foreground">Try adjusting your search query.</p>
                </div>
              )}
            </>
          )}
        </div>
    </div>
  );
}
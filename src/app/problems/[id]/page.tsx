"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ProblemPanel } from "@/components/ProblemPanel";
import { EditorPanel } from "@/components/EditorPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { ProblemHeader } from "@/components/ProblemHeader";
import { ProblemSkeleton } from "@/components/skeletons/ProblemSkeleton"; // Import Skeleton
import { ProblemNotFound } from "@/components/ProblemNotFound"; // Import Not Found
import { useIsMobile } from "@/hooks/use-mobile";
import { apiClient } from "@/lib/apiClient/apiClient";
import { toast } from "sonner";
import { ProblemI } from "@/models/problem.model";
import { TestCaseI } from "@/models/testcase.model";

type ProblemPageParams = {
  id: string;
};

function ProblemPage() {
  const isMobile = useIsMobile();
  const params = useParams() as unknown as ProblemPageParams;
  
  const problemId =  params?.id;

  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState<"problem" | "editor" | "chat">("problem");
  const [problem, setProblem] = useState<ProblemI | null>(null);
  const [testCases, setTestCases] = useState<TestCaseI[] | null>([]);
  
  // Set loading to true initially
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProblemData = async () => {
      if (!problemId) return;

      setIsLoading(true);
      try {
        const res = await apiClient.getAProblem(problemId);
        if (!res.success) {
          // You might want to handle specific error codes here
          toast.error(res.error || "Failed to load problem");
          // If fetch fails, we stop loading, but problem remains null, triggering Not Found UI
        } else {
            setProblem(res.data?.problem as ProblemI);
            setTestCases(res.data?.testCases as TestCaseI[]);
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
        toast.error("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblemData();
  }, [problemId]);

  // Theme Sync Logic
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // 1. Show Skeleton while loading
  if (isLoading) {
    return <ProblemSkeleton />;
  }

  // 2. Show Not Found if loading finished but no problem exists
  if (!problem) {
    return <ProblemNotFound />;
  }

  // 3. Render Main UI
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <ProblemHeader />

      {isMobile ? (
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex border-b border-border bg-background z-10">
            {(["problem", "editor", "chat"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0 overflow-auto">
            {activeTab === "problem" && <ProblemPanel selectedProblem={problem} />}
            {activeTab === "editor" && (
              <EditorPanel 
                problem={problem} 
                testCases={testCases || []} 
                theme={theme} 
              />
            )}
            {/* {activeTab === "chat" && <ChatPanel />} */}
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={25} minSize={20}>
              <ProblemPanel selectedProblem={problem} />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              <EditorPanel 
                problem={problem} 
                testCases={testCases || []} 
                theme={theme} 
              />
            </ResizablePanel>

            {/* <ResizableHandle withHandle /> */}

            {/* <ResizablePanel defaultSize={25} minSize={20}>
              <ChatPanel />
            </ResizablePanel> */}
          </ResizablePanelGroup>
        </div>
      )}
    </div>
  );
}
export default ProblemPage;
// "use client";
// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   ResizablePanelGroup,
//   ResizablePanel,
//   ResizableHandle,
// } from "@/components/ui/resizable";
// import { ProblemPanel } from "@/components/ProblemPanel";
// import { EditorPanel } from "@/components/EditorPanel";
// import { ChatPanel } from "@/components/ChatPanel";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import {
//   Code2,
//   ArrowLeft,
//   Timer,
//   Play,
//   Pause,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { apiClient } from "@/lib/apiClient";
// import { toast } from "sonner";
// import { ProblemI } from "@/models/problem.model";
// import { TestCaseI } from "@/models/testcase.model";

// type Params = {
//   id: string;
// };

// export default function ProblemPage() {
//   const router = useRouter();
//   const isMobile = useIsMobile();
//   const { id } = useParams<Params>();
//   const problemId = id[0];
//   console.log("problemId:",id)

//   const [theme, setTheme] = useState("dark");
//   const [activeTab, setActiveTab] = useState<"problem" | "editor" | "chat">(
//     "problem"
//   );

//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [isTimerRunning, setIsTimerRunning] = useState(true);

//   const [problem, setProblem] = useState<ProblemI | null>(null);
//   const [testCases, setTestCases] = useState<TestCaseI[] | null>([]);

//   // const currentIndex = problems.findIndex((p) => p.id === selectedProblemId);
//   // const hasPrevious = currentIndex > 0;
//   // const hasNext = currentIndex < problems.length - 1;

//   const formatTime = (seconds: number) => {
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hrs.toString().padStart(2, "0")}:${mins
//       .toString()
//       .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   const loadProblems = async (problemId: string) => {
//     const res = await apiClient.getAProblem(problemId);
//     if (!res.success) {
//       return toast.error(res.error);
//     }

//     setProblem(res.data?.problem as ProblemI);
//     setTestCases(res.data?.testCases as TestCaseI[]);
//   };

//   useEffect(() => {
//     if (problemId) {
//       loadProblems(problemId);
//       setElapsedTime(0);
//       setIsTimerRunning(true);
//     }
//   }, [problemId]);

//   // const handlePrevious = () => {
//   //   if (hasPrevious) {
//   //     const prevProblem = problems[currentIndex - 1];
//   //     setSelectedProblemId(prevProblem.id);
//   //     router.push(`/problems/${prevProblem.id}`);
//   //     setElapsedTime(0);
//   //   }
//   // };

//   // const handleNext = () => {
//   //   if (hasNext) {
//   //     const nextProblem = problems[currentIndex + 1];
//   //     setSelectedProblemId(nextProblem.id);
//   //     router.push(`/problems/${nextProblem.id}`);
//   //     setElapsedTime(0);
//   //   }
//   // };

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isTimerRunning) {
//       interval = setInterval(() => {
//         setElapsedTime((prev) => prev + 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isTimerRunning]);

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") || "dark";
//     setTheme(savedTheme);
//   }, []);

//   useEffect(() => {
//     const observer = new MutationObserver(() => {
//       setTheme(
//         document.documentElement.classList.contains("dark") ? "dark" : "light"
//       );
//     });

//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div className="h-screen flex flex-col bg-background">
//       <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
//         <div className="flex items-center gap-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => router.push("/problems")}
//             className="mr-2"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//           <Code2 className="h-6 w-6 text-primary" />
//           <h1 className="text-lg sm:text-xl font-bold text-foreground hidden sm:block">
//             CodeMaster
//           </h1>
//         </div>

//         <div className="flex items-center gap-2 sm:gap-4">
//           <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted">
//             <Timer className="h-4 w-4 text-muted-foreground" />
//             <span className="text-sm font-mono text-foreground">
//               {formatTime(elapsedTime)}
//             </span>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-6 w-6"
//               onClick={() => setIsTimerRunning(!isTimerRunning)}
//             >
//               {isTimerRunning ? (
//                 <Pause className="h-3 w-3" />
//               ) : (
//                 <Play className="h-3 w-3" />
//               )}
//             </Button>
//           </div>

//           {/* <div className="flex items-center gap-1">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handlePrevious}
//               disabled={!hasPrevious}
//               className="h-8"
//             >
//               <ChevronLeft className="h-4 w-4" />
//               <span className="hidden sm:inline">Prev</span>
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleNext}
//               disabled={!hasNext}
//               className="h-8"
//             >
//               <span className="hidden sm:inline">Next</span>
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div> */}

//           <ThemeToggle />
//         </div>
//       </header>

//       {isMobile ? (
//         <div className="flex-1 min-h-0 flex flex-col">
//           <div className="flex border-b border-border">
//             <button
//               onClick={() => setActiveTab("problem")}
//               className={`flex-1 py-3 text-sm font-medium ${
//                 activeTab === "problem"
//                   ? "text-primary border-b-2 border-primary"
//                   : "text-muted-foreground"
//               }`}
//             >
//               Problem
//             </button>
//             <button
//               onClick={() => setActiveTab("editor")}
//               className={`flex-1 py-3 text-sm font-medium ${
//                 activeTab === "editor"
//                   ? "text-primary border-b-2 border-primary"
//                   : "text-muted-foreground"
//               }`}
//             >
//               Editor
//             </button>
//             <button
//               onClick={() => setActiveTab("chat")}
//               className={`flex-1 py-3 text-sm font-medium ${
//                 activeTab === "chat"
//                   ? "text-primary border-b-2 border-primary"
//                   : "text-muted-foreground"
//               }`}
//             >
//               Chat
//             </button>
//           </div>

//           <div className="flex-1 min-h-0">
//             {activeTab === "problem" && (
//               <ProblemPanel selectedProblem={problem!} />
//             )}
//             {activeTab === "editor" && (
//               <EditorPanel problem={problem as ProblemI} testCases={testCases as TestCaseI[]} theme={theme} />
//             )}
//             {activeTab === "chat" && <ChatPanel />}
//           </div>
//         </div>
//       ) : (
//         <div className="flex-1 min-h-0">
//           <ResizablePanelGroup direction="horizontal" className="h-full">
//             <ResizablePanel defaultSize={25} minSize={20}>
//               <ProblemPanel
//                 selectedProblem={problem!}
//               />
//             </ResizablePanel>

//             <ResizableHandle withHandle />

//             <ResizablePanel defaultSize={50} minSize={30}>
//               <EditorPanel problem={problem as ProblemI} testCases={testCases as TestCaseI[]} theme={theme} />
//             </ResizablePanel>

//             <ResizableHandle withHandle />

//             <ResizablePanel defaultSize={25} minSize={20}>
//               <ChatPanel />
//             </ResizablePanel>
//           </ResizablePanelGroup>
//         </div>
//       )}
//     </div>
//   );
// }





// app/problems/[...id]/page.tsx
// app/problems/[...id]/page.tsx
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
  id: string | string[];
};

function ProblemPage() {
  const isMobile = useIsMobile();
  const params = useParams() as unknown as ProblemPageParams;
  
  const problemId = Array.isArray(params?.id) ? params.id[0] : params?.id;

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
            {activeTab === "chat" && <ChatPanel />}
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
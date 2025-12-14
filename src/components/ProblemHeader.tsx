"use client";

import { useState, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Code2, Timer, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export const ProblemHeader = memo(function ProblemHeader() {
  const router = useRouter();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Timer Logic isolated here
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/problems")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Code2 className="h-6 w-6 text-primary" />
        <h1 className="text-lg sm:text-xl font-bold text-foreground hidden sm:block">
          CodeMaster
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-mono text-foreground w-[80px] text-center">
            {formatTime(elapsedTime)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
          >
            {isTimerRunning ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </Button>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
});
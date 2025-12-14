"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient/apiClient";

// --- Types ---
type ContributionLevel = 0 | 1 | 2 | 3 | 4;

interface DailyData {
  date: string; // "YYYY-MM-DD"
  count: number;
  level: ContributionLevel;
}

interface ApiResponse {
  year: number;
  totalSubmissions: number;
  data: Record<string, { count: number; level: ContributionLevel }>;
}

// --- Constants ---
const GRADES = {
  0: "bg-secondary", // Empty
  1: "bg-emerald-200 dark:bg-emerald-900",
  2: "bg-emerald-400 dark:bg-emerald-700",
  3: "bg-emerald-600 dark:bg-emerald-500",
  4: "bg-emerald-800 dark:bg-emerald-300",
};

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function ContributionGraph({
  userId,
  userJoiningTime,
}: {
  userId: string;
  userJoiningTime?: string | Date; // Made optional to be safe
}) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Calculate the year the user joined
  const joiningYear = useMemo(() => {
    if (!userJoiningTime) return 2000; // Default fallback
    return new Date(userJoiningTime).getFullYear();
  }, [userJoiningTime]);

// 1. Fetch Data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      const result = await apiClient.getUserGraph(userId, selectedYear);

      if (result.success) {
        // result.data contains the parsed JSON response
        setApiData(result.data as ApiResponse);
      } else {
        console.error("Failed to fetch graph data:", result.error);
      }
      
      setLoading(false);
    }

    fetchData();
  }, [userId, selectedYear]);

  // 2. Generate Full Calendar
  const calendarData = useMemo(() => {
    if (!apiData) return [];

    const days: DailyData[] = [];
    const startDate = new Date(Date.UTC(selectedYear, 0, 1));
    const endDate = new Date(Date.UTC(selectedYear, 11, 31));

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const activity = apiData.data[dateStr];

      days.push({
        date: dateStr,
        count: activity ? activity.count : 0,
        level: activity ? activity.level : 0,
      });
    }
    return days;
  }, [apiData, selectedYear]);

  // 3. Group by Weeks
  const weeks = useMemo(() => {
    const weeksArray: DailyData[][] = [];
    let currentWeek: DailyData[] = [];

    calendarData.forEach((day, index) => {
      const dateObj = new Date(day.date);
      const dayOfWeek = dateObj.getUTCDay(); // 0 = Sun, 6 = Sat

      // Add padding for the first week to align columns correctly
      if (index === 0 && dayOfWeek > 0) {
        // We push 'null' placeholders into the week, but filter them out in rendering
        // or just accept that the first column is partial.
        // For a simple flex-col layout, we don't strictly need placeholders 
        // if we just want the boxes to appear. 
        // However, to align Mon to Mon, we usually add invisible spacers.
        // Let's stick to the visual squares approach:
      }

      currentWeek.push(day);

      if (dayOfWeek === 6 || index === calendarData.length - 1) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
    });
    return weeksArray;
  }, [calendarData]);

  if (loading && !apiData) {
    return (
      <div className="flex items-center justify-center w-full my-4 h-48 border rounded-xl bg-card">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full p-6 mx-auto bg-card border rounded-xl my-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            {apiData?.totalSubmissions || 0} submissions in {selectedYear}
          </h2>
          <p className="text-sm text-muted-foreground">
            Jan 1 - Dec 31, {selectedYear}
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setSelectedYear((prev) => prev - 1)}
            // DISABLE logic: Cannot go before joining year
            disabled={selectedYear <= joiningYear}
            className="p-2 rounded-full hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            aria-label="Previous Year"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-sm font-medium min-w-[3rem] text-center">
            {selectedYear}
          </span>
          
          <button
            onClick={() => setSelectedYear((prev) => prev + 1)}
            // DISABLE logic: Cannot go past current year
            disabled={selectedYear >= currentYear}
            className="p-2 rounded-full hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            aria-label="Next Year"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The Graph */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-secondary">
        <div className="min-w-[720px]">
          {/* Month Labels */}
          <div className="flex mb-2 text-xs text-muted-foreground ml-8">
            {MONTH_LABELS.map((month) => (
              <div key={month} className="flex-1">
                {month}
              </div>
            ))}
          </div>

          {/* The Grid Container */}
          <div className="flex gap-1 h-[115px]">
            {/* Day Labels (Mon, Wed, Fri) */}
            <div className="flex flex-col justify-between mr-2 text-[10px] text-muted-foreground pb-3 pt-1">
              <span className="opacity-0">Sun</span> {/* Placeholder for alignment */}
              <span>Mon</span>
              <span className="opacity-0">Tue</span>
              <span>Wed</span>
              <span className="opacity-0">Thu</span>
              <span>Fri</span>
              <span className="opacity-0">Sat</span>
            </div>

            {/* Weeks Columns */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1 flex-1">
                {/* If the first week is short (starts mid-week), we need invisible spacers at the TOP 
                   so the days align with the correct labels (Mon, Wed, Fri).
                */}
                {weekIndex === 0 && week.length < 7 && Array.from({ length: 7 - week.length }).map((_, i) => (
                   <div key={`spacer-${i}`} className="w-[10px] h-[10px]" />
                ))}

                {week.map((day) => (
                  <TooltipProvider key={day.date} delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-[10px] h-[10px] rounded-[2px] transition-all hover:ring-2 hover:ring-ring hover:ring-offset-1 cursor-pointer ${
                            GRADES[day.level]
                          }`}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">
                        <b>{day.count} submissions</b> on {day.date}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-[10px] h-[10px] rounded-[2px] ${
              GRADES[level as ContributionLevel]
            }`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
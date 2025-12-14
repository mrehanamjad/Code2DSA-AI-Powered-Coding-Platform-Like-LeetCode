"use client";

import React, { useState } from "react";
// Make sure this path matches exactly where your file is located
import { problems } from "@/data/problems";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type LogEntry = {
  problem: string;
  status: "success" | "skipped" | "error";
  message: string;
};

export default function SeedProblemsPage() {
    const router = useRouter();
    const {data:session} = useSession();
    if(!session || (session && session.user.username !== "rehan7161")) {
      router.push("/");
    }



  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    current: 0,
    total: problems.length,
  });

  const handleSeed = async () => {
    setLoading(true);
    setLogs([]);
    setProgress({ current: 0, total: problems.length });

    let processedCount = 0;

    const postTestCases = async (problemId: string, testCases: any[]) => {
      let idx = 0;
      for (const testCase of testCases) {
        try {
          const payload = {
            problemId,
            isHidden:idx < 3 ? false : true,
            input: testCase.input,
            expected: testCase.expected,
          };
          // 1. Prepare the
          const response = await fetch(`/api/testcases`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const result = await response.json();
          if (response.status === 201) {
            addLog(result.testCase._id, "success", "Created successfully");
          } else if (response.status === 409) {
            addLog(result.testCase._id, "skipped", "Already exists in database");
          } else {
            addLog(result.testCase._id, "error", result.error || "Unknown error");
          }

        } catch (error) {
          console.log(error);
        }
        idx++;
      }
    };

    for (const problem of problems) {

      try {
        // 1. Prepare the payload
        // IMPORTANT: Your data has 'id', but API expects 'problemId'
        const payload = {
          ...problem,
          problemId: problem.id,
        };

        // 2. Request the API
        const response = await fetch("/api/problems", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        // 3. Handle Responses
        if (response.status === 201) {
          addLog(result.problem._id, "success", "Created successfully");
            await postTestCases(result.problem._id.toString(), problem.testCases!);
        } else if (response.status === 409) {
          addLog(problem.title, "skipped", "Already exists in database");
        } else {
          addLog(problem.title, "error", result.error || "Unknown error");
        }
      } catch (error: any) {
        addLog(problem.title, "error", error.message);
      }

      processedCount++;
      setProgress((prev) => ({ ...prev, current: processedCount }));
    }

    setLoading(false);
  };

  const addLog = (
    problem: string,
    status: LogEntry["status"],
    message: string
  ) => {
    setLogs((prev) => [...prev, { problem, status, message }]);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-white">Database Seeder</h1>
          <p className="text-gray-400 mt-2">
            Inject local problems from{" "}
            <code className="bg-gray-800 px-1 rounded">@/data/problems.ts</code>{" "}
            into MongoDB.
          </p>
        </header>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">
                Total Problems Found: {problems.length}
              </h2>
              {loading && (
                <p className="text-blue-400 text-sm mt-1">
                  Processing: {progress.current} / {progress.total}
                </p>
              )}
            </div>

            <button
              onClick={handleSeed}
              disabled={loading}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                loading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
              }`}
            >
              {loading ? "Seeding..." : "Start Sync"}
            </button>
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="w-full bg-gray-800 rounded-full h-2.5 mb-6">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                }}
              ></div>
            </div>
          )}

          {/* Console Logs */}
          <div className="bg-black rounded-md p-4 h-96 overflow-y-auto border border-gray-800 font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-600 italic">Logs will appear here...</p>
            ) : (
              <ul className="space-y-2">
                {logs.map((log, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 border-b border-gray-900 pb-1"
                  >
                    <span className="text-gray-500 min-w-[24px]">
                      {index + 1}.
                    </span>

                    <StatusBadge status={log.status} />

                    <span className="text-gray-300 flex-1">{log.problem}</span>
                    <span className="text-gray-500 text-xs">{log.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for badges
function StatusBadge({ status }: { status: LogEntry["status"] }) {
  if (status === "success") {
    return <span className="text-green-400 font-bold w-20">[OK]</span>;
  }
  if (status === "skipped") {
    return <span className="text-yellow-500 font-bold w-20">[EXIST]</span>;
  }
  return <span className="text-red-500 font-bold w-20">[FAIL]</span>;
}

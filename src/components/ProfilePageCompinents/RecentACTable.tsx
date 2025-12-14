"use client";

import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Matches the response from /api/submissions/recent
type RecentSubmission = {
  _id: string;
  title: string;
  frontendProblemId: string;
  status: "accepted" | "wrongAnswer" | "runtimeError" | "compileError" | "tle";
  createdAt: string;
};

function RecentACTable({userId}:{userId:string}) {
  const [submissions, setSubmissions] = useState<RecentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch(`/api/user/statistics/${userId}/recent-ac`);
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data);
        }
      } catch (error) {
        console.error("Failed to fetch recent submissions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3 p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return <div className="text-sm text-muted-foreground py-4 text-center">No recent activity.</div>;
  }

  return (
    <table className='w-full text-sm'>
      <thead>
        {/* <tr className='border-b border-border'>
          <th className='text-left py-3 px-2 font-semibold text-muted-foreground'>Problem</th>
          <th className='text-left py-3 px-2 font-semibold text-muted-foreground hidden md:table-cell'>
            Time
          </th>
        </tr> */}
      </thead>
      <tbody>
        {submissions.map((sub) => (
          <tr key={sub._id} className='border-b border-border hover:bg-muted/40 transition-colors'>
            <td className='py-4 px-2'>
              <p className={cn(
                "font-medium truncate transition-colors",
                // Optional: Color code the problem name based on status
                sub.status === 'accepted' ? "text-foreground" : "text-muted-foreground"
              )}>
                {/* {sub.frontendProblemId} */}
                {sub.title}
              </p>
            </td>

            <td className='py-4 px-2 hidden md:table-cell text-xs text-muted-foreground whitespace-nowrap'>
              {formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RecentACTable;
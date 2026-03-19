import ProblemTable from "@/components/Problems/ProblemTable";
import PaginationControls from "@/components/PaginationControls";
import { headers } from "next/headers";
import { ProblemI } from "@/models/problem.model";
import { Status } from "../StatusIcon";


export interface ProblemResponse {
  problems: ProblemI[];
  paginator: {
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    next: number | null;
    pageSize: number;
    prev: number | null;
    slNo: number;
    totalPages: number;
    totalProblems: number;
  };
}

async function getProblems(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  // Convert object params to URLSearchParams string
  const query = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) query.append(key, value as string);
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") || "";

    const res = await fetch(`${baseUrl}/api/problems?${query.toString()}`, {
      cache: "no-store", // Ensure fresh data on every request
      headers: {
        cookie: cookieHeader,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch problems");
    const data = await res.json()

    return data as Promise<ProblemResponse>;
  } catch (error) {
    console.error(error);
    return {
      problems: [],
      paginator: {
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
        next: null,
        pageSize: 10,
        prev: null,
        slNo: 1,
        totalPages: 1,
        totalProblems: 0,
      },
    };
  }
}


export default async function ProblemListFetcher({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const data = await getProblems(params);

  if (!data || data.problems.length === 0) return <div>No problems found.</div>;

  return (
    <>
      <ProblemTable problems={
        data.problems.map((problem: ProblemI & { status?: Status }) => ({
          _id: problem._id as string,
          title: problem.title,
          difficulty: problem.difficulty,
          topics: problem.topics,
          problemId: problem.problemId,
          status: problem.status,  
        }))
      } />

      <div className="mt-8">
        <PaginationControls
          currentPage={data.paginator.currentPage}
          totalPages={data.paginator.totalPages}
          hasNextPage={data.paginator.hasNextPage}
          hasPrevPage={data.paginator.hasPrevPage}
        />
      </div>
    </>
  );
}
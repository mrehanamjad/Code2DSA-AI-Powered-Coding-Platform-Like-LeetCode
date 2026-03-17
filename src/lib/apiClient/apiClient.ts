import { ProblemI } from "@/models/problem.model";
import { SubmissionI } from "@/models/submission.model";
import { TestCaseI } from "@/models/testcase.model";
import { AICodeAnalyzerResposeI, SubmissionForProblemI, SubmissionResponseT } from "./types";

// utils/apiClient.ts
type FetchOpts = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
};

class ApiClient {
  private async request<T>(
    endpoint: string,
    opts: FetchOpts = {}
  ): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`/api${endpoint}`, {
        method: opts.method ?? "GET",
        headers: {
          "Content-Type": "application/json",
          ...(opts.headers || {}),
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
      });

      const status = res.status;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let json: any = null;
      try {
        json = await res.json();
      } catch {}

      if (!res.ok) {
        return {
          success: false,
          error: json?.error || json?.message || "Request failed",
          status,
        };
      }

      return {
        success: true,
        data: json as T,
        status,
      };
    } catch (error) {
          const message = error instanceof Error ? error.message : "Network error";
      return {
        success: false,
        error: message ?? "Network error",
        status: 0,
      };
    }
  }

  // ------------------------
  // Endpoints
  // ------------------------

  async getAProblem(problemId: string) {
    return this.request<{ problem: ProblemI; testCases: TestCaseI[] }>(
      `/problems/${problemId}`
    );
  }

  async deleteProblem(problemId: string) {
    return this.request(`/problems/${problemId}`, {
      method: "DELETE",
    });
  }

  async createSubmission(body: SubmissionI) {
    return this.request<SubmissionI>(`/submissions/`, {
      method: "POST",
      body,
    });
  }

  async addOrUpdateSubmissionNote(submissionId: string, note: string) {
    return this.request<SubmissionI>(`/submissions/${submissionId}/note`, {
      method: "PATCH",
      body: { note },
    });
  }

  async getSubmissionsForProblem(problemId: string) {
    return this.request<SubmissionForProblemI[]>(`/submissions/problem/${problemId}`);
  }

  async getSubmissionDetailById(submissionId: string){
    return this.request<SubmissionResponseT>(`/submissions/${submissionId}`);
  }

  async getUserGraph(userId: string,selectedYear: number) {
    return this.request(`/user/statistics/${userId}/activity?year=${selectedYear}`);
  }

  async getAICodeAnalysis(data: { problemStatement: string; code: string; language: string }) {
    return this.request<AICodeAnalyzerResposeI>("/ai/code-analyze", {
      method: "POST",
      body: data,
    });
  }

  // ------------------------
  // Problem Lists Endpoints
  // ------------------------

  async getLists() {
    return this.request<{ lists: import("@/models/problemList.model").ProblemListI[] }>("/lists");
  }

  async createList(data: { title: string; description?: string; isPublic?: boolean }) {
    return this.request<{ message: string; list: import("@/models/problemList.model").ProblemListI }>("/lists", {
      method: "POST",
      body: data,
    });
  }

  async getListById(listId: string, page = 1, limit = 10) {
    return this.request<{
      list: import("@/models/problemList.model").ProblemListI;
      problems: import("./types").PaginatedListProblems;
    }>(`/lists/${listId}?page=${page}&limit=${limit}`);
  }

  async updateList(listId: string, data: Partial<import("@/models/problemList.model").ProblemListI>) {
    return this.request<{ message: string; list: import("@/models/problemList.model").ProblemListI }>(`/lists/${listId}`, {
      method: "PATCH",
      body: data,
    });
  }

  async reorderProblems(listId: string, updates: { problemId: string; order: number }[]) {
    return this.request<{ message: string }>(`/lists/${listId}/reorder`, {
      method: "PATCH",
      body: { updates },
    });
  }

  async deleteList(listId: string) {
    return this.request<{ message: string }>(`/lists/${listId}`, {
      method: "DELETE",
    });
  }

  async addProblemToList(listId: string, problemId: string) {
    return this.request<{ message: string; entry: import("@/models/listProblem.model").ListProblemI }>(`/lists/${listId}/problems`, {
      method: "POST",
      body: { problemId },
    });
  }

  async removeProblemFromList(listId: string, problemId: string) {
    return this.request<{ message: string }>(`/lists/${listId}/problems/${problemId}`, {
      method: "DELETE",
    });
  }

  async reorderListProblems(listId: string, updates: { problemId: string; order: number }[]) {
    return this.request<{ message: string; result: unknown }>(`/lists/${listId}/reorder`, {
      method: "PATCH",
      body: { updates },
    });
  }

  async checkProblemInLists(problemId: string) {
    return this.request<{ listIds: string[] }>(`/lists/check/${problemId}`);
  }
}

export const apiClient = new ApiClient();

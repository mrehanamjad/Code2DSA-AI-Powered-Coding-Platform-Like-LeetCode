import { ProblemI } from "@/models/problem.model";
import { TestCaseI } from "@/models/testcase.model";
import mongoose from "mongoose";




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
    } catch (err: any) {
      return {
        success: false,
        error: err.message ?? "Network error",
        status: 0,
      };
    }
  }

  // ------------------------
  // Endpoints
  // ------------------------

  async getAProblem(problemId: string) {
    return this.request<{problem: ProblemI; testCases: TestCaseI[]}>(`/problems/${problemId}`);
  }

  //   async editVideo(id: string, data: { title?: string; description?: string }) {
//     return await this.myFetch(`/videos/${id}/edit`, {
//       method: "PATCH",
//       body: data,
//     });
//   }

//   async deleteVideo(id: string) {
//     return await this.myFetch(`/videos/${id}/delete`, { method: "DELETE" });
//   }
}

export const apiClient = new ApiClient();

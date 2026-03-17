import { SubmissionI } from "@/models/submission.model";
import mongoose from "mongoose"

export interface SubmissionForProblemI extends Document {
  _id: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  language: string;
  status: "accepted" | "wrongAnswer" | "runtimeError" | "compileError" | "tle";
  executionTime?: number;
  memoryUsed?: number;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PopulatedProblem {
  _id: mongoose.Types.ObjectId;
  title: string;
  problemId: string;
  difficulty: string;
  function: {
    name: string;
    params: string[];
  };
  description: string;
}

export type SubmissionResponseT = Omit<SubmissionI, "problemId"> & {
  problemId: PopulatedProblem;
};


export interface PublicUser {
  _id: mongoose.Types.ObjectId;
  userName: string;
  name: string;
  email: string;
  avatar: { id: string; url: string };
  phone: string;
  bio: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface AICodeAnalyzerResposeI {
    timeComplexity: string;
    spaceComplexity: string;
    bugs: string[];
    optimizations: string[];
    feedback: string;
}

export interface PaginatedListProblems {
  docs: {
    _id: string;
    order: number;
    problemId: string;
    problemDetails: {
      problemId: string;
      title: string;
      difficulty: string;
      topics: string[];
      status: string;
      _id: string;
    }
  }[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
import { SubmissionI } from "@/models/submission.model";
import { UserI } from "@/models/user.model";
import mongoose from "mongoose"

export interface SubmissionForProblemI extends Document {
  _id: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  language: string;
  status: "accepted" | "wrongAnswer" | "runtimeError" | "compileError" | "tle";
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
}

export type SubmissionResponseT = Omit<SubmissionI, "problemId"> & {
  problemId: PopulatedProblem;
};


export type PublicUser = Omit<UserI, "password">;


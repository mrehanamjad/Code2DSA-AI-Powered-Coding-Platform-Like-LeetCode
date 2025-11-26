import mongoose, { Schema, Document, models } from "mongoose";

interface TestCaseI {
  problemId: mongoose.Types.ObjectId;
  input: any[];
  expected: any;
  isHidden: boolean;
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const TestCaseSchema: Schema<TestCaseI> = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Problem",
    },
    input: {
      type: [{ type: Schema.Types.Mixed }],
      required: true,
    },
    expected: {
      type: Schema.Types.Mixed,
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const TestCase =
  models.TestCase || mongoose.model<TestCaseI>("TestCase", TestCaseSchema);

export default TestCase;

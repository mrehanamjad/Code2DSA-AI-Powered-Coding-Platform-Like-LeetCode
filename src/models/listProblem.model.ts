import mongoose, { Document, model, models, Schema, Model } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface ListProblemI extends Document {
  listId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ListProblemSchema = new Schema<ListProblemI>(
  {
    listId: {
      type: Schema.Types.ObjectId,
      ref: "ProblemList",
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ---------- Indexing ----------
// Index for queried ordered problems in a list
ListProblemSchema.index({ listId: 1, order: 1 });
// Compound index to ensure a problem is only added once to a specific list
ListProblemSchema.index({ listId: 1, problemId: 1 }, { unique: true });

ListProblemSchema.plugin(aggregatePaginate);

// Define the AggregatePaginateModel type
interface ListProblemModel<T extends Document> extends Model<T> {
  aggregatePaginate: unknown;
}

const ListProblem =
  (models?.ListProblem as ListProblemModel<ListProblemI>) ||
  (model<ListProblemI>(
    "ListProblem",
    ListProblemSchema
  ) as ListProblemModel<ListProblemI>);

export default ListProblem;

import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB
interface ITask {
  title: string;
  priority: "low" | "medium" | "high";
  interval: number;
}

// 2. Create a Schema corresponding to the document interface.
const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  priority: { type: String, enum: ["low", "medium", "high"], required: true },
  interval: { type: Number, required: true },
});

// 3. Create and export a Model.
export const Task = model<ITask>("Task", taskSchema);

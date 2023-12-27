import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB
interface ITask {
  title: string;
  description: string,
  priority: "low" | "medium" | "high";
  creationDate: Date;
  dueDate: Date;
  isRepeatingTask: boolean;
  isDone: boolean;
  userId: string;
}

// 2. Create a Schema corresponding to the document interface.
const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: false },
  priority: { type: String, enum: ["low", "medium", "high"], required: true },
  creationDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  isRepeatingTask: { type: Boolean, required: true },
  isDone: { type: Boolean, required: false },
  userId: { type: String, required: true },
});

// 3. Create and export a Model.
export const Task = model<ITask>("Task", taskSchema);

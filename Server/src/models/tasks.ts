import * as mongodb from "mongodb";

export interface Task {
  title: string;
  priority: "low" | "medium" | "high";
  interval: number;
  _id?: mongodb.ObjectId;
}

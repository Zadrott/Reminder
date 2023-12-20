import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB
export interface IUser {
  name: string;
  email: string;
  password: string;
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  name: { type: String, required: false },
  email: { type: String, required: true, match: /.+\@.+\..+/, unique: true },
  password: { type: String, minlength: 8, required: true },
});

// 3. Create and export a Model.
export const User = model<IUser>("User", userSchema);

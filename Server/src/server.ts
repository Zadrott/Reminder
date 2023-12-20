import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connect } from "mongoose";

import { taskRouter } from "./routes/tasks.route";
import { userRouter } from "./routes/users.route";

// Load and validate environment variables from the .env file
dotenv.config();
const { PORT, DB_USER, DB_PASS, DB_HOST, DB_NAME, USERS_SECRET } = process.env;

if (!DB_USER || !DB_PASS || !DB_HOST || !DB_NAME || USERS_SECRET) {
  console.error(
    "No DB_USER, DB_PASS, DB_HOST, DB_NAME or USERS_SECRET environment variables not defined in .env"
  );
  process.exit(1);
}

//Start server if successfully connected to MongoDB
connect(
  `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`
)
  .then(() => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use("/tasks", taskRouter);
    app.use("/users", userRouter);

    app.listen(PORT ?? 8090, () => {
      console.log(`Server running at http://localhost:${PORT ?? 8090}...`);
    });
  })
  .catch((error) => console.error(error));

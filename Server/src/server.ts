import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connect } from "mongoose";

import { taskRouter } from "./routes/tasks.route";

// Load environment variables from the .env file
dotenv.config();
const { PORT, DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;

if (!DB_USER || !DB_PASS || !DB_HOST || !DB_NAME) {
  console.error(
    "No DB_USER, DB_PASS, DB_HOST or DB_NAME environment variables not defined in .env"
  );
  process.exit(1);
}

connect(
  `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`
)
  .then(() => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    // add routers
    app.use("/tasks", taskRouter);

    // start the Express server
    app.listen(PORT ?? 8090, () => {
      console.log(`Server running at http://localhost:${PORT ?? 8090}...`);
    });
  })
  .catch((error) => console.error(error));

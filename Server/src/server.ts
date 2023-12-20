import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connect } from "mongoose";

import { taskRouter } from "./routes/tasks.route";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();
const { PORT, DB_USER, DB_PASS, DB_HOST } = process.env;

if (!DB_USER || !DB_PASS || !DB_HOST) {
  console.error(
    "No DB_USER, DB_PASS or DB_HOST environment variable defined in config.env"
  );
  process.exit(1);
}

connect(
  `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/?retryWrites=true&w=majority`
)
  .then(() => {
    const app = express();
    app.use(cors());

    // add routers
    app.use("/tasks", taskRouter);

    // start the Express server
    app.listen(PORT ?? 8090, () => {
      console.log(`Server running at http://localhost:${PORT ?? 8090}...`);
    });
  })
  .catch((error) => console.error(error));

import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";

import { connectToDatabase } from "./database";
import { taskRouter } from "./routes/tasks.route";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();
const { ATLAS_URI, PORT } = process.env;

if (!ATLAS_URI) {
  console.error(
    "No ATLAS_URI environment variable has been defined in config.env"
  );
  process.exit(1);
}

connectToDatabase(ATLAS_URI)
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

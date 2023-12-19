import * as mongodb from "mongodb";

import { Task } from "./models/tasks";

export const collections: {
  tasks?: mongodb.Collection<Task>;
} = {};

export async function connectToDatabase(uri: string) {
  const client = new mongodb.MongoClient(uri);
  await client.connect();
  
  const db = client.db("reminder");
  await applySchemaValidation(db);
 
  const tasksCollection = db.collection<Task>("tasks");
  collections.tasks = tasksCollection;

  console.log("Connected to MongoDB");
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
  const tasksSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "priority", "interval"],
      additionalProperties: false,
      properties: {
        _id: {},
        title: {
          bsonType: "string",
          description: "'title' is required and is a string",
        },
        priority: {
          bsonType: "string",
          description:
            "'priority' is required and is one of 'low', 'medium', or 'high'",
          enum: ["low", "medium", "high"],
        },
        interval: {
          bsonType: "number",
          description: "'interval' is required and is a number",
        },
      },
    },
  };

  // Try applying the modification to the collections, if a collection doesn't exist, create it
  await db
    .command({
      collMod: "tasks",
      validator: tasksSchema,
    })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection("tasks", { validator: tasksSchema });
      }
      else {
        console.error(error)
        process.exit()
      }
    });
}

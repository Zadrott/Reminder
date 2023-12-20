import * as express from "express";

import { Task } from "../models/tasks";
import { authMiddleware } from "../middlewares/auth";

export const taskRouter = express.Router();

taskRouter.use(authMiddleware);

taskRouter.get("/", async (_req, res) => {
  Task.find()
    .then((tasks) => {
      console.log(`All tasks returned`);
      console.log(tasks);
      res.status(200).json(tasks);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({
        error: error,
      });
    });
});

taskRouter.get("/:id", async (req, res) => {
  Task.findOne({
    _id: req.params.id,
  })
    .then((task) => {
      console.log(`Task found:`);
      console.log(task);
      res.status(200).json(task);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
});

taskRouter.post("/", async (req, res) => {
  let receivedTask = req.body;
  const task = new Task({
    title: receivedTask.title,
    priority: receivedTask.priority,
    interval: receivedTask.interval,
    userId: receivedTask.userId,
  });

  task
    .save()
    .then(() => {
      console.log("New task created :");
      console.log(task);
      res.status(201).json({
        message: "Task created successfully!",
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({
        error: error,
      });
    });
});

taskRouter.put("/:id", async (req, res) => {
  const id = req?.params?.id;
  const task = req.body;
  Task.findOne({ _id: req.params.id }).then((task) => {
    if (req.body.userId == task.userId) {
      Task.updateOne({ _id: id }, task)
        .then(() => {
          console.log("Task updated :");
          console.log(task);
          res.status(201).json({
            message: "Task updated successfully!",
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(400).json({
            error: error,
          });
        });
    } else {
      res.status(400).json({
        error: "You can't modify a task belonging to someone else",
      });
    }
  });
});

taskRouter.delete("/:id", async (req, res) => {
  Task.findOne({ _id: req.params.id }).then((task) => {
    if (req.body.userId == task.userId) {
      task
        .deleteOne({ _id: req.params.id })
        .then(() => {
          console.log("Task deleted :");
          console.log(task);
          res.status(200).json({
            message: "Task deleted successfully!",
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(400).json({
            error: error,
          });
        });
    } else {
      res.status(400).json({
        error: "You can't delete a task that belong to someone else",
      });
    }
  });
});

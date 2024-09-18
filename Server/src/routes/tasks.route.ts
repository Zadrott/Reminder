import * as express from "express";

import { Task } from "../models/tasks";
import { authMiddleware } from "../middlewares/auth";

export const taskRouter = express.Router();

taskRouter.use(authMiddleware);

//route: GET {BaseUrl}/tasks/
//description: get all tasks
taskRouter.get("/", async (_req, res) => {
  Task.find({ userId: _req.body.userId })
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

//route: GET {BaseUrl}/tasks/{id}
//description: get task by id
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

//route: POST {BaseUrl}/tasks/
//description: create new task
taskRouter.post("/", async (req, res) => {
  const receivedTask = req.body;
  const task = new Task({
    title: receivedTask.title,
    priority: receivedTask.priority,
    creationDate: receivedTask.creationDate,
    dueDate: receivedTask.dueDate,
    isRepeatingTask: receivedTask.isRepeatingTask,
    isDone: receivedTask.isDone ?? false,
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

//route: POST {BaseUrl}/tasks/{id}/complete
//description: mark task as completed
taskRouter.post("/:id/complete", async (req, res) => {
  //Update the isDone property of the task
  Task.findOne({ _id: req.params.id }).then((storedTask) => {
    if (req.body.userId == storedTask.userId) {
      const updatedTask = new Task({
        _id: storedTask.id,
        title: storedTask.title,
        priority: storedTask.priority,
        creationDate: storedTask.creationDate,
        dueDate: storedTask.dueDate,
        isRepeatingTask: storedTask.isRepeatingTask,
        isDone: true,
        userId: storedTask.userId,
      });

      Task.updateOne({ _id: req.params.id }, updatedTask)
        .then(() => {
          console.log("Task updated :");
          console.log(updatedTask);
        })
        .catch((error) => {
          console.error(error);
          res.status(400).json({
            error: error,
          });
        });

      //Create new task if needed
      if (updatedTask.isRepeatingTask) {
        const newTask = new Task({
          title: updatedTask.title,
          priority: updatedTask.priority,
          creationDate: updatedTask.dueDate,
          dueDate: ComputeNextDueDate(
            updatedTask.creationDate,
            updatedTask.dueDate
          ),
          isRepeatingTask: updatedTask.isRepeatingTask,
          isDone: false,
          userId: updatedTask.userId,
        });

        newTask
          .save()
          .then(() => {
            console.log("New task created :");
            console.log(newTask);
          })
          .catch((error) => {
            console.error(error);
            res.status(400).json({
              error: error,
            });
          });
      }

      res.status(201).json({
        message: "Task completed successfully!",
      });
    } else {
      res.status(400).json({
        error: "You can't complete a task that belongs to someone else",
      });
    }
  });
});

//route: PUT {BaseUrl}/tasks/{id}
//description: update task
taskRouter.put("/:id", async (req, res) => {
  const receivedTask = req.body;

  Task.findOne({ _id: req.params.id }).then((storedTask) => {
    if (req.body.userId == storedTask.userId) {
      const updatedTask = new Task({
        _id: storedTask.id,
        title: receivedTask.title,
        priority: receivedTask.priority,
        creationDate: receivedTask.creationDate,
        dueDate: receivedTask.dueDate,
        isRepeatingTask: receivedTask.isRepeatingTask,
        isDone: receivedTask.isDone,
        userId: receivedTask.userId,
      });

      Task.updateOne({ _id: req.params.id }, updatedTask)
        .then(() => {
          console.log("Task updated :");
          console.log(updatedTask);
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
        error: "You can't modify a task that belongs to someone else",
      });
    }
  });
});

//route: DELETE {BaseUrl}/tasks/{id}
//description: delete task
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
        error: "You can't delete a task that belongs to someone else",
      });
    }
  });
});

// Helpers:

function ComputeNextDueDate(creationDate: Date, dueDate: Date): Date {
  const interval = dueDate.getTime() - creationDate.getTime();
  const newDate = new Date(dueDate.getTime() + interval);

  return newDate;
}

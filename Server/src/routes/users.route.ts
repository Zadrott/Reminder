import * as express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/users";

export const userRouter = express.Router();

//route: POST {BaseUrl}/users/login
//description: validate credentials and return a token to be used for secure routes (routers using auth middleware)
userRouter.post("/login", async (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: new Error("User not found!"),
        });
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error("Incorrect password!"),
            });
          }

          //Token expire in 24h
          const expirationDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

          const token = jwt.sign(
            { userId: user._id, exp: expirationDate },
            process.env.USERS_SECRET
          );

          console.log("User logged in: ");
          console.log(user.name ?? user.email);
          res.status(200).json({
            userId: user._id,
            token: token,
            expire: expirationDate,
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json(error);
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

//route: POST {BaseUrl}/users/register
//description: create a new user and hash password
userRouter.post("/register", async (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        //TODO : Add name
        email: req.body.email,
        password: hash,
      });

      user
        .save()
        .then(() => {
          console.log("New user added: ");
          console.log(user);
          res.status(201).json({
            message: "User added successfully!",
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            error: error.code == 11000 ? "This email is already in use" : error,
          });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

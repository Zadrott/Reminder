import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload extends jwt.JwtPayload {
  userId: String;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      process.env.USERS_SECRET
    ) as UserPayload;
    const userId = decodedToken.userId;

    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      req.body.userId = userId;
      next();
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

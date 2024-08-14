import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send({
      result: false,
      message: "Unauthorized",
    });
  }

  try {
    const payload = jwt.verify(token, "WG6oqviIhVwcCJKY1ZI5G0NKnaTB5uYb") as {
      userId: number;
      username: string;
    };

    const data = await UserModel.getById(payload.userId);

    if (!data.result) {
      return res.status(401).send({
        result: false,
        message: "User not found",
      });
    } else {
      req.user = data.user;
    }
  } catch (e) {
    console.log(e);
    return res.status(401).send({
      result: false,
      message: "Unauthorized",
    });
  }
  next();
};

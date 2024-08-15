import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token:any = req.headers["authorization"];
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const payload:any = jwt.verify(token, "Dbx6aLgGlUXrK7VedFSDOL1bbuIZN0VY");
    const data = await UserModel.getById(payload.userId);
    
    if (!data.success) {
      return res.status(401).send({
        success: false,
        message: "User not found",
      });
    } else {
      req.body = {...req.body, user:data.user}
    }
  } catch (e) {
    console.log(e);
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }
  next();
};

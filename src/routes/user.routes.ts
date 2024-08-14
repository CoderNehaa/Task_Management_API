import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userRouter = Router();
const userController = new UserController();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.signin);



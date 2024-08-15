import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validationMiddleware } from "../middlewares/form-validation";

const userRouter = Router();
const userController = new UserController();

userRouter.post('/register', validationMiddleware, userController.register);
userRouter.post('/login', validationMiddleware, userController.signin);


export default userRouter

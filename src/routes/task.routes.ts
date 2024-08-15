import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth-validation";

const taskRouter = Router();
const taskController = new TaskController();

taskRouter.post('/add', authMiddleware, taskController.add);
taskRouter.put('/update', authMiddleware, taskController.update);
taskRouter.delete('/remove/:taskId', authMiddleware, taskController.delete);
taskRouter.get('/user/:userId', authMiddleware, taskController.getTasksByUserId);
taskRouter.get('/team', authMiddleware, taskController.getTeamTasks);
taskRouter.patch('/:taskId/assign/:assigneeId', authMiddleware, taskController.assignTasks);

export default taskRouter


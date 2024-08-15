import { NextFunction, Request, Response } from "express";
import { Task as TaskInterface } from "../interface";
import { TaskModel } from "../models/task.model";
import { UserModel } from "../models/user.model";
import { CustomError } from "../utils/custom-error";

export class TaskController {
    async add(req: Request, res: Response) {
        try {
            const { title,description, status, priority, user } = req.body;
            
            const task: TaskInterface = {
                title,
                description,
                status,
                priority,
                creatorId: user.id
            };

            if (!task.title || !task.creatorId || !task.status) {
                return res.status(400).send({
                    success: false,
                    message: "Title, creatorId, and status are required fields.",
                });
            }

            const result = await TaskModel.create(task);
            if (!result.success) {
                return res.status(400).send(result);
            }

            return res.status(200).send({
                success: true,
                message: "Task added successfully"
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send({
                success: false,
                message: "Failed to add task! Try later"
            });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const {id, title, description, status, endDate, priority, user} = req.body;
            const updateDate = new Date();
            const task:TaskInterface= {
                id, creatorId:user.id, title, description, status, endDate, updateDate, priority
            }
            
            if (!id || !title || !status) {
                return res.status(400).send({
                    success: false,
                    message: "Task id, title, and status are required fields.",
                });
            }

            const result = await TaskModel.update(task);
            if (!result.success) {
                return res.status(400).send(result);
            }

            return res.status(200).send({
                success: true,
                message: "Task updated successfully",
                task: result.task
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send({
                success: false,
                message: "Failed to update task! Try later"
            });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const taskId: number = parseInt(req.params.taskId);

            if (!taskId) {
                return res.status(400).send({
                    success: false,
                    message: "Task id is required",
                });
            }

            const result = await TaskModel.delete(taskId);
            if (!result.success) {
                return res.status(400).send(result);
            }

            return res.status(200).send(result);
        } catch (e) {
            console.log(e);
            return res.status(500).send({
                success: false,
                message: "Failed to delete task! Try later"
            });
        }
    }

    //it will return task which are created by this given userId
    async getTasksByUserId(req: Request, res: Response) {
        try {
            const userId: number = parseInt(req.params.userId);
            if (!userId) {
                return res.status(400).send({
                    success: false,
                    message: "User id is required",
                });
            }

            const userExists = await UserModel.getById(userId);
            if (!userExists.success) {
                return res.status(400).send({
                    success: false,
                    message: !userExists.message,
                });
            }

            const result = await TaskModel.getByUserId(userId);
            if (!result.success) {
                return res.status(400).send(result);
            }

            return res.status(200).send(result);
        } catch (e) {
            console.log(e);
            return res.status(500).send({
                success: false,
                message: "Failed to get user tasks! Try later"
            });
        }
    }

    async getTeamTasks(req: Request, res: Response, next:NextFunction) {
        try {
            const {user} = req.body;
            if(user.account_type!=="admin"){
                throw new CustomError(400, "Only admin can access this data. Logged in user is not admin");
            }

            const result = await TaskModel.getByAdminId(user.id);
            if (!result.success) {
                throw new CustomError(400, result.message);
            }

            return res.status(200).send({success:true, data:result.tasks});
        } catch (e) {
            next(e);
        }
    }

    async assignTasks(req: Request, res: Response, next:NextFunction) {
        try {
            const taskId: number = parseInt(req.params.taskId);
            const assigneeId: number = parseInt(req.params.assigneeId);
            
            const {user} = req.body;
            if (user.account_type === "user") {
                throw new CustomError(400, "Logged in user is not admin. Only admin can assign tasks.");
            }

            const result = await TaskModel.assignTask(taskId, assigneeId);
            if (!result.success) {
                throw new CustomError(400, result.message);
            }

            return res.status(200).send({success:true, message:"Task assigned successfully"});
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
}

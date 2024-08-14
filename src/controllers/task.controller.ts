import { Request, Response } from "express";
import { Task } from "../interface";
import { TaskModel } from "../models/task.model";
import { UserModel } from "../models/user.model";

export class TaskController{
    async add(req:Request, res:Response){
        try{
            const task: Task = req.body;

            if (!task.title || !task.creatorId || !task.status) {
                return res.status(400).send({
                  result: false,
                  message: "Title, userId, and status are required fields.",
                });
              }

              await TaskModel.create(task);              
            return res.status(200).send({
                success:true,
                message:"Task added successfully"
            })
        } catch (e){
            console.log(e);
            return res.status(500).send({
                success:false,
                message:"Failed to add task! try later"
            })
        }
    }

    async update(req:Request, res:Response){
        try{
            const task: Task = req.body;

            if (!task.id || !task.title || !task.creatorId || !task.status) {
                return res.status(400).send({
                  result: false,
                  message: "Task id, title, userId, and status are required fields.",
                });
              }

              const taskExists = await TaskModel.getById(task.id);
              if(!taskExists.result){
                return res.status(400).send({
                    result: false,
                    message: "Task does not exist",
                  });
              }
              
              await TaskModel.update(task);              
            return res.status(500).send({
                success:true,
                message:"Task updated successfully"
            })
        } catch (e){
            console.log(e);
            return res.status(500).send({
                success:false,
                message:"Failed to add task! try later"
            })
        }
    }    
    
    async delete(req:Request, res:Response){
        try{
            const taskId:number = parseInt(req.params.taskId);

            if (!taskId) {
                return res.status(400).send({
                  result: false,
                  message: "Task id is required",
                });
              }

              const taskExists = await TaskModel.getById(taskId);
              if(!taskExists.result){
                return res.status(400).send({
                    result: false,
                    message: "Task does not exist",
                  });
              }
                          
              await TaskModel.delete(taskId);
            return res.status(200).send({
                success:true,
                message:"Task deleted successfully"
            })
        } catch (e){
            console.log(e);
            return res.status(500).send({
                success:false,
                message:"Failed to delete task! try later"
            })
        }
    }

    //user see its own created tasks, both user and admin
    async getTasksByUserId(req:Request, res:Response){
       try{
            const userId:number = parseInt(req.params.userId);

            if (!userId) {
                return res.status(400).send({
                  result: false,
                  message: "user id is required",
                });
              }

              const userExists = await UserModel.getById(userId);
              if(!userExists.result){
                return res.status(400).send({
                    result: false,
                    message: "User does not exist",
                  });
              }
                          
              const tasks = await TaskModel.getByUserId(userId);
            return res.status(200).send({
                success:true,
                data:tasks
            })
        } catch (e){
            console.log(e);
            return res.status(500).send({
                success:false,
                message:"Failed to get user tasks! try later"
            })
        }
    }

    //if logged in user is admin, only then, admin can see task of all team members
    async getTeamTasks(req:Request, res:Response){
        try{
            const user = req.user;
            if(user.account_type==="user"){
                return res.status(400).send({
                    result: false,
                    message: "Logged in user is not admin. only admin can access this information.",
                });
            }

            const adminId:number = user.id;                           
            const tasks = await TaskModel.getByAdminId(adminId);
            return res.status(200).send({
                success:true,
                data:tasks
            });
         } catch (e){
             console.log(e);
             return res.status(500).send({
                 success:false,
                 message:"Failed to get user tasks! try later"
             })
         }
    }

    //if logged in user is admin, only then, admin can assign tasks
    async assignTasks(req:Request, res:Response){
        try{
            const taskId = parseInt(req.params.taskId);
            const userId = parseInt(req.params.userId);

            const user = req.user;
            if(user.account_type==="user"){
                return res.status(400).send({
                    result: false,
                    message: "Logged in user is not admin. only admin can assign tasks.",
                });
            }

            const taskExists = await TaskModel.getById(taskId);
            if(!taskExists.result){
            return res.status(400).send({
                result: false,
                message: "Task does not exist",
                });
            }     
            
            const userExists = await UserModel.getById(userId);
            if(!userExists.result){
            return res.status(400).send({
                result: false,
                message: "No account found with the id given for new assignee of task",
                });
            }        
            
            await TaskModel.assignTask(taskId, userId)
            return res.status(200).send({
                success:true,
                message:"Task assigned to new user!"
            });
         } catch (e){
             console.log(e);
             return res.status(500).send({
                 success:false,
                 message:"Failed to get user tasks! try later"
             })
         }
    }
}



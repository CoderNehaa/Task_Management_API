import { Task } from "../interface";

export class TaskModel{
    static async create(task:Task){

    }

    static async update(task:Task){

    }

    static async getById(taskId:number):Promise<any>{
        return {
            result:false,
            task:null
        }
    }

    static async delete(taskId:number){

    }

    static async getByUserId(userId:number){

    }

    static async getByAdminId(adminId:number){
        //joint query user and tasks both details
    }

    static async assignTask(taskId:number, userId:number){

    }

    
}
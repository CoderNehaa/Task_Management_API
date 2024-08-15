import { getRepository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';

export class TaskModel {
    static async create(task: any): Promise<any> {
        const taskRepository = getRepository(Task);
        const newTask = taskRepository.create(task);
        
        await taskRepository.save(newTask);

        return {
            success: true,
            task: newTask,
        };
    }

    static async update(task: any): Promise<any> {
        const taskRepository = getRepository(Task);

        const existingTask = await taskRepository.findOne({where: {id:task.id}});
        if (!existingTask) {
            return { success: false, message: 'Task not found' };
        }

        taskRepository.merge(existingTask, task);
        await taskRepository.save(existingTask);
        return {
            success: true,
            task: existingTask,
        };
    }

    static async getById(taskId: number): Promise<any> {
        const taskRepository:any = getRepository(Task);
        const task = await taskRepository.findOne({where: { id : taskId }});

        if (!task) {
            return { success: false, message: 'Task not found' };
        }

        return {
            success: true,
            task,
        };
    }

    static async delete(taskId: number): Promise<any> {
        const taskRepository:any = getRepository(Task);
        const task = await taskRepository.findOne({where: { id : taskId }});

        if (!task) {
            return { success: false, message: 'Task not found' };
        }

        await taskRepository.remove(task);

        return {
            success: true,
            message: 'Task deleted successfully',
        };
    }

    static async getByUserId(userId: number): Promise<any> {
        const taskRepository:any = getRepository(Task);
        const tasks = await taskRepository.find({ where: { creatorId: userId } });

        return {
            success: true,
            tasks,
        };
    }

    static async getByAdminId(adminId: number): Promise<any> {
        try {
          const taskRepository = getRepository(Task);
          const userRepository = getRepository(User);
    
          // Use query builder to join tasks with users and filter by adminId
          const tasks = await taskRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect(User, 'user', 'task.creatorId = user.id')
            .where('user.adminId = :adminId', { adminId })
            .select([
              'task.id',
              'task.title',
              'task.description',
              'task.status',
              'task.priority',
              'task.startDate',
              'task.endDate',
              'task.updateDate',
              'task.creatorId',
              'user.username',
              'user.adminId'
            ])
            .getMany();
    
          return { success: true, tasks };
        } catch (error) {
          console.error('Error fetching tasks by admin ID:', error);
          return { success: false, message: 'An error occurred while fetching tasks' };
        }
      }

    static async assignTask(taskId: number, assigneeId: number): Promise<any> {
        const taskRepository:any = getRepository(Task);
        const userRepository:any = getRepository(User);
        
        const task = await taskRepository.findOne({where:{id:taskId}});        
        if (!task) {
            return { success: false, message: 'Task not found' };
        }

        const user = await userRepository.findOne({where:{id:assigneeId}});
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        task.assigneeId = assigneeId;
        await taskRepository.save(task);

        return {
            success: true,
            task,
        };
    }
}

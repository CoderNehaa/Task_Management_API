import { getRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class UserModel {
  private static getRepository(): Repository<User> {
    return getRepository(User);
  }

  static async create(adminId: number, account_type: 'admin' | 'user', username: string, password: string) {
    const userRepository = this.getRepository();

    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
        return { success: false, message: 'Username already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({ username, password: hashedPassword, account_type, adminId });
    await userRepository.save(user);
    return { success: true, user };
}


  static async get(username: string, password: string): Promise<any> {
    const userRepository = this.getRepository();
    const user = await userRepository.findOne({ where: { username } });
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return { success: false, message: 'Invalid credentials' };
    // }
    return { success: true, user };
  }

  static async getById(id: number): Promise<any> {
      const userRepository = this.getRepository();
      
      const user = await userRepository.findOne({ where: { id } });
      
      if (user) {
        return { success: true, user };
      } else {
        return { success: false, message: 'User does not exist' };
      }
    }

  static async usernameExists(username: string) {
    const userRepository = this.getRepository();
    
    const user = await userRepository.findOne({ where: { username } });
    return !!user;
  }
}


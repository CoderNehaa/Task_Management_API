import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column({ type: 'enum', enum: ['todo', 'in progress', 'done'], default: 'todo' })
  status: 'todo' | 'in progress' | 'done' = 'todo';

  @Column({ type: 'enum', enum: ['high', 'medium', 'low'], default: 'medium' })
  priority: 'high' | 'medium' | 'low' = 'medium';

  @Column({ type: 'date' })
  startDate!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  endDate!: Date;

  @Column({ type: 'date', nullable: true })
  updateDate?: Date;

  @Column({type:"int", nullable:false})
  creatorId!: number;

  @Column({type:"int", nullable:true})
  assigneeId!: number;
}

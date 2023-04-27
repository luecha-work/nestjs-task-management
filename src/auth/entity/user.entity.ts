import { Task } from './../../tasks/entity/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) //ห้ามซ้ำ
  username: string;

  @Column()
  password: string;

  // join table
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}

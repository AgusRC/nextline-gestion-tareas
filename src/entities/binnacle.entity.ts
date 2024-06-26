import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task.entity";
import { User } from "./user.entity";

@Entity()
export class Binnacle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task)
  @JoinColumn()
  task: Task;

  @Column('jsonb', { nullable: false, default: {} })
  history: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: string;

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy: User;

}
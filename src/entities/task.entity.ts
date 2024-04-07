import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum TaskStatus {
  PENDING = "pending",
  INPROGRESS = "in progress",
  COMPLETE = "complete"
}
@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.PENDING
  })
  status: TaskStatus;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  deadline: string;

  @Column({default: ""})
  comments: string;

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy: User;

  @Column({default: ""})
  tags: string;

  @Column({nullable: true})
  file: string;

  @Column({nullable: true})
  filename: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedDate: string;

  @Column({default: true})
  active: boolean;
  
}
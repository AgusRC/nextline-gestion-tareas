import { TaskStatus } from "src/entities/task.entity";

export class TaskDTO {
  title: string;
  description: string;
  deadline: string;
  comments?: string;
  tags?: string;
  file?: string;
  filename?: string;
  status?: TaskStatus;
}
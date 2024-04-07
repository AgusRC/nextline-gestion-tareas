import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TaskStatus } from "src/entities/task.entity";

export class TaskDTO {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  deadline: string;
  @ApiPropertyOptional()
  comments?: string;
  @ApiPropertyOptional()
  tags?: string;
  @ApiPropertyOptional()
  file?: string;
  @ApiPropertyOptional()
  filename?: string;
  @ApiPropertyOptional()
  status?: TaskStatus;
  @ApiProperty()
  userId: number;
}
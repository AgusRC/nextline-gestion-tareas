import { ApiProperty } from "@nestjs/swagger";

export class userDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  pass: string;
}
import { IsArray, IsNumber } from 'class-validator';

export class AssignRoleToUserDto {
  @IsNumber()
  role: number;

  @IsArray()
  @IsNumber({}, { each: true })
  users: number[];
}

import { IsArray, IsNumber } from 'class-validator';

export class UpdateRoleOfUserDto {
  @IsNumber()
  role: number;

  @IsArray()
  @IsNumber({}, { each: true })
  users: number[];
}

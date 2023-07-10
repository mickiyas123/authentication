import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePermissionOfRoleDto {
  @IsNumber()
  @IsNotEmpty()
  role: number;

  @IsArray()
  @IsNumber({}, { each: true })
  permissions: number[];
}

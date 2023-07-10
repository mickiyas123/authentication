import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignPermissionToRoleDto {
  @IsNumber()
  @IsNotEmpty()
  role: number;

  // Add custom class validator to check input is either string or array of string
  permissions: number | number[] | string;
}

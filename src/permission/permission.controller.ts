import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AssignPermissionToRoleDto } from './dto/assign-permission-role-to.dto';
import { UpdatePermissionOfRoleDto } from './dto/update-permission-of-role.dto ';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Post('assign-permission-to-role')
  assignPermissionToRole(
    @Body() assignPermissionToRole: AssignPermissionToRoleDto,
  ) {
    return this.permissionService.assignPermissionToRole(
      assignPermissionToRole,
    );
  }

  @Post('update-permission-of-role')
  updateRoleOfUser(@Body() updatePermissionOfRole: UpdatePermissionOfRoleDto) {
    return this.permissionService.updatePermissionOfRole(
      updatePermissionOfRole,
    );
  }
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}

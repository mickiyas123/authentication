import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleToUserDto } from './dto/assign-role-to-user.dto';
import { UpdateRoleOfUserDto } from './dto/update-role-of-user.dto copy';
import { Request } from 'express';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto, @Req() request: Request) {
    return this.roleService.create(createRoleDto, request);
  }

  @Post('assign-role-to-user')
  assignRoleToUser(@Body() assignRoleToUser: AssignRoleToUserDto) {
    return this.roleService.assignRoleToUser(assignRoleToUser);
  }

  @Post('update-role-of-user')
  updateRoleOfUser(@Body() updateRoleOfUser: UpdateRoleOfUserDto) {
    return this.roleService.updateRoleOfUser(updateRoleOfUser);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}

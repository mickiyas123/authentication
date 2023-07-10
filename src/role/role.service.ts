import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignRoleToUserDto } from './dto/assign-role-to-user.dto';
import { UpdateRoleOfUserDto } from './dto/update-role-of-user.dto copy';
import { AbilityFactory } from 'src/ability/ability.factory';
import { Request } from 'express';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly abilityFactory: AbilityFactory,
  ) {}
  async create(createRoleDto: CreateRoleDto, @Req() request: Request) {
    const user: any = request.user;
    const ability = await this.abilityFactory.createForUser(user.id);
    if (!ability.can('create', 'roles')) {
      throw new NotFoundException('You are not authorized');
    }
    const role = await this.prisma.roles.create({
      data: createRoleDto,
    });
    return role;
  }

  async assignRoleToUser(assignRoleToUser: AssignRoleToUserDto) {
    const { role: roleRequest, users: usersRequest } = assignRoleToUser;

    const role = await this.prisma.roles.findUnique({
      where: { id: roleRequest },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const users = await this.prisma.users.findMany();
    const userIds = users.map((user) => user.id);

    const invalidUsers = usersRequest.filter((user) => !userIds.includes(user));

    if (invalidUsers.length) {
      throw new NotFoundException(
        `Users not found: ${invalidUsers.join(', ')}`,
      );
    }

    await this.prisma.roles.update({
      where: { id: roleRequest },
      data: {
        users: {
          connect: usersRequest.map((user) => ({ id: user })),
        },
      },
    });

    return { message: 'Role assigned to users' };
  }

  async updateRoleOfUser(updateRoleOfUser: UpdateRoleOfUserDto) {
    const { role: roleRequest, users: usersRequest } = updateRoleOfUser;

    const role = await this.prisma.roles.findUnique({
      where: { id: roleRequest },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const users = await this.prisma.users.findMany();
    const userIds = users.map((user) => user.id);

    const invalidUsers = usersRequest.filter((user) => !userIds.includes(user));

    if (invalidUsers.length) {
      throw new NotFoundException(
        `Users not found: ${invalidUsers.join(', ')}`,
      );
    }

    await this.prisma.roles.update({
      where: { id: roleRequest },
      data: {
        users: {
          set: usersRequest.map((user) => ({ id: user })),
        },
      },
    });

    return { message: 'Role updated to users' };
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignPermissionToRoleDto } from './dto/assign-permission-role-to.dto';
import { UpdatePermissionOfRoleDto } from './dto/update-permission-of-role.dto ';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPermissionDto: CreatePermissionDto) {
    const permission = this.prisma.permissions.create({
      data: createPermissionDto,
    });
    return permission;
  }

  async assignPermissionToRole(
    assignRoleToPermissionDto: AssignPermissionToRoleDto,
  ) {
    const { role: roleRequest, permissions: permissionsRequest } =
      assignRoleToPermissionDto;

    // Grab role from database
    const role = await this.prisma.roles.findUnique({
      where: { id: roleRequest },
      select: { id: true },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    let validPermissions, invalidPermissions;

    // Grab permissions from database
    const permissions = await this.prisma.permissions.findMany({
      select: { id: true },
    });

    // Check if permissionsRequest is string
    if (
      typeof permissionsRequest === 'string' &&
      permissionsRequest === 'all'
    ) {
      // Assign all permissions to role
      await this.prisma.roles.update({
        where: { id: roleRequest },
        data: {
          permissions: {
            connect: permissions.map((permission) => ({ id: permission.id })),
          },
        },
      });
    }
    // Check if permissionsRequest is array of ids
    else if (Array.isArray(permissionsRequest)) {
      const currentPermissionId = permissions.map(
        (permission) => permission.id,
      );
      // Check for valid permission ids
      validPermissions = permissionsRequest.filter((permission) =>
        currentPermissionId.includes(permission),
      );
      await this.prisma.roles.update({
        where: { id: roleRequest },
        data: {
          permissions: {
            connect: validPermissions.map((permission) => ({ id: permission })),
          },
        },
      });
      invalidPermissions = permissionsRequest.filter(
        (permission) => !currentPermissionId.includes(permission),
      );
      if (invalidPermissions.length) {
        throw new NotFoundException(
          `Permissions not found: ${invalidPermissions.join(', ')}`,
        );
      }
    }

    return 'Permission assigned to role successfully';
  }

  // Update permission of role
  async updatePermissionOfRole(
    updatePermissionOfRoleDto: UpdatePermissionOfRoleDto,
  ) {
    const { role: roleRequest, permissions: permissionsRequest } =
      updatePermissionOfRoleDto;
    // Grab role from database
    const role = await this.prisma.roles.findUnique({
      where: { id: roleRequest },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permissions = await this.prisma.permissions.findMany();

    // Check if all permission from request are vaiid
    const currentPermissionId = permissions.map((permission) => permission.id);
    const invalidPermissions = permissionsRequest.filter(
      (id) => !currentPermissionId.includes(id),
    );
    // Thow error if invalid permission found
    if (invalidPermissions.length) {
      throw new NotFoundException(
        `Permissions not found: ${invalidPermissions.join(', ')}`,
      );
    }

    // update permission of role
    await this.prisma.roles.update({
      where: { id: roleRequest },
      data: {
        permissions: {
          set: permissionsRequest.map((id) => ({ id })),
        },
      },
    });

    return 'Permission of role updated successfully';
  }

  findAll() {
    return `This action returns all permission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}

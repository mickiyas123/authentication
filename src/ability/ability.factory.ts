import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbilityBuilder } from '@casl/ability';
import { createPrismaAbility } from '@casl/prisma';

export enum RoleType {
  Admin = 'admin',
  Employee = 'employee',
}

export const defineAbilityForUser = (userRoles: any) => {
  const { can, build } = new AbilityBuilder(createPrismaAbility);

  userRoles.forEach((role) => {
    if (role.name === RoleType.Admin) {
      can('manage', 'all');
    } else if (role.name === RoleType.Employee) {
      role.permissions.forEach((permission) => {
        can(permission.action, permission.subject);
      });
    }
  });

  return build();
};

@Injectable()
export class AbilityFactory {
  constructor(private readonly prisma: PrismaService) {}

  async createForUser(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });

    const roles = user?.roles ?? [];
    return defineAbilityForUser(roles);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashString } from 'src/utils/auth.utils';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async signup(createUserDto: CreateUserDto) {
    const password = await hashString(createUserDto.password);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password,
      },
    });

    return user;
  }

  async signin(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (!user) throw new Error('User not found');

    const password = await argon.verify(user.password, createUserDto.password);
    if (!password) throw new Error('Password is incorrect');

    return user;
  }

  async signout(userId: number) {
    const user = await this.prisma.user.updateMany({
      where: {
        id: userId,
        refresh_token: {
          not: null,
        },
      },
      data: {
        refresh_token: null,
      },
    });

    return user;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const refresh_token = await hashString(updateUserDto.refresh_token);
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        refresh_token,
      },
    });
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

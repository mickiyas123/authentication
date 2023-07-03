import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async create(createAuthDto: CreateAuthDto) {
    const user = await this.userService.create(createAuthDto);
    return user;
  }

  async validateUser(email: string, password: string) {
    return this.userService.validateUser(email, password);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(email: string) {
    return this.userService.findOne(email);
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

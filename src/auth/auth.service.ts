import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  async signup(createAuthDto: CreateAuthDto) {
    const user = await this.userService.signup(createAuthDto);
    const payload = { sub: user.id };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.config.get('PRIVATE_KEY'),
      expiresIn: '15m',
      algorithm: 'RS256',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.config.get('PRIVATE_KEY'),
      expiresIn: '7d',
      algorithm: 'RS256',
    });
    await this.userService.update(user.id, {
      refresh_token: refresh_token,
    });
    return {
      access_token,
      refresh_token,
    };
  }

  async signin(@Body() createAuthDto: CreateAuthDto) {
    const user = await this.userService.signin(createAuthDto);
    const payload = { sub: user.id };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.config.get('PRIVATE_KEY'),
      expiresIn: '15m',
      algorithm: 'RS256',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.config.get('PRIVATE_KEY'),
      expiresIn: '7d',
      algorithm: 'RS256',
    });
    await this.userService.update(user.id, {
      refresh_token: refresh_token,
    });
    return {
      access_token,
      refresh_token,
    };
  }

  async signout(userId: number) {
    const signout = await this.userService.signout(+userId);
    return signout;
  }

  async refreshToken(userId: number, rt: string) {
    const user = await this.userService.findOne(+userId);

    const rtMatch = await argon.verify(user.refresh_token, rt);

    if (!rtMatch) throw new ForbiddenException('Invalid refresh token');

    const payload = { sub: user.id };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.config.get('PRIVATE_KEY'),
      expiresIn: '15m',
      algorithm: 'RS256',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.config.get('PRIVATE_KEY'),
      expiresIn: '7d',
      algorithm: 'RS256',
    });
    await this.userService.update(user.id, {
      refresh_token: refresh_token,
    });
    return {
      access_token,
      refresh_token,
    };
    // return user;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

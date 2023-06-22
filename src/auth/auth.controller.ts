import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Request } from 'express';
import { RtAuthGuard } from 'src/common/guards/rt.guard';
import { AtAuthGuard } from 'src/common/guards/at.guard';
import { User } from 'src/common/decorators/get-current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signup(createAuthDto);
  }

  @Post('signin')
  signin(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signin(createAuthDto);
  }

  @UseGuards(AtAuthGuard)
  @Post('signout')
  signout(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.authService.signout(+userId);
  }

  @UseGuards(RtAuthGuard)
  @Post('refresh_token')
  refreshToken(@User() user) {
    const userId = user['sub'];
    const rt = user['refresh_token'];
    return this.authService.refreshToken(+userId, rt);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/common/guards/local.auth.guard';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  findAll(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('protected')
  protected() {
    return 'protected route';
  }

  @Get('logout')
  findOne(@Request() req) {
    req.session.destroy();
    return { msg: 'logut' };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

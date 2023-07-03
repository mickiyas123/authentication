import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategies/local.startegy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}

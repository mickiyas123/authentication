import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './exceptions/prisma-client-exception.filter';
import { CustomExceptionFilter } from './exceptions/custom-exception.filter';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60 * 60 * 24 * 7 },
    }),
  );
  app.useGlobalFilters(
    new CustomExceptionFilter(),
    new PrismaClientExceptionFilter(httpAdapter),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();

import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response, Request } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const filedNames = exception.meta.target as string[];
        response.status(status).json({
          statusCode: status,
          message: `Duplicate values for unique fields: ${filedNames.join(
            ', ',
          )}`,
          path: request.url,
        });
        `break;`;
      }
      default:
        super.catch(exception, host);
        break;
    }
  }
}

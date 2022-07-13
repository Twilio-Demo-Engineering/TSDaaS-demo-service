import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    switch (exception.code) {
      case 'P2002':
        super.catch(
          new HttpException(exception.message, HttpStatus.CONFLICT),
          host,
        );
        break;
      default:
        super.catch(
          new HttpException(
            exception.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
          host,
        );
    }
  }
}

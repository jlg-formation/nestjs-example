import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;
    let errorCode: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = status === 500 ? 'Internal error' : exception.message;
      errorCode = status === 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal error';
      errorCode = 'INTERNAL_ERROR';
    }

    response.status(status).json({
      statusCode: status,
      message,
      errorCode,
    });
  }
}

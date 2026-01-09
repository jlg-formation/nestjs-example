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

      if (status === 500) {
        message = 'Internal error';
        errorCode = 'INTERNAL_ERROR';
      } else {
        const responseBody = exception.getResponse();
        const extractedMessage =
          typeof responseBody === 'object' && responseBody !== null
            ? (responseBody as { message?: unknown }).message
            : undefined;

        if (Array.isArray(extractedMessage)) {
          message = extractedMessage.join('; ');
        } else if (typeof extractedMessage === 'string') {
          message = extractedMessage;
        } else {
          message = exception.message;
        }

        errorCode = 'BAD_REQUEST';
      }
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

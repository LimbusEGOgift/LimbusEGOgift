import {
  Catch,
  HttpException,
  ExceptionFilter,
  Logger,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';
import { ControllerResponse } from '../response/controller.response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('Exception');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const message = exception.message;
    const name = exception.name;

    const errorResponse = ControllerResponse.error(
      {
        name,
        details: exception.getResponse(),
      },
      message,
      status,
    );

    this.logger.error(`[${status}] ${name} - ${message}`, exception.stack);

    response.status(status).json(errorResponse);
  }
}

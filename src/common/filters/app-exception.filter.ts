import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ExceptionPayload {
  status: number;
  code: string;
  message: string;
  detail: unknown;
}

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, code, message, detail } =
      this.buildExceptionPayload(exception);

    this.logger.error(
      `${request.method} ${request.url} -> ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json({
      status,
      body: {
        code,
        message,
        detail,
      },
    });
  }

  private buildExceptionPayload(exception: unknown): ExceptionPayload {
    const isHttpException = exception instanceof HttpException;
    const exceptionStatus: HttpStatus = isHttpException
      ? (exception.getStatus() as HttpStatus)
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const response = isHttpException ? exception.getResponse() : null;
    const messageFromResponse =
      typeof response === 'string'
        ? response
        : ((response as Record<string, unknown>)?.error ??
          (response as Record<string, unknown>)?.message);

    const [status, message] = this.resolveMessage(
      exceptionStatus,
      messageFromResponse,
    );

    const detail =
      typeof response === 'string'
        ? response
        : ((response as Record<string, unknown>)?.message ??
          (exception instanceof Error ? exception.message : response));

    const code = HttpStatus[status] || 'INTERNAL_SERVER_ERROR';

    return { status, code, message, detail };
  }

  private resolveMessage(
    exceptionStatus: HttpStatus,
    message: unknown,
  ): [HttpStatus, string] {
    switch (exceptionStatus) {
      case HttpStatus.NOT_FOUND:
        return [
          HttpStatus.NOT_FOUND,
          this.normalizeMessage(message, 'Not Found'),
        ];
      default:
        return [HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error'];
    }
  }

  private normalizeMessage(message: unknown, fallback: string): string {
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(', ');
    return fallback;
  }
}

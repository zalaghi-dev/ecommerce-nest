import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();
    const req: Request = ctx.getRequest();

    let status = 500;
    let message = 'Unknown error occurred, please try again later';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exRes: any = exception.getResponse();
      message = exRes.message || exRes;
    } else {
      message = exception.message || message;
    }
  }
}

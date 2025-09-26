import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, response, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req: Request = ctx.getRequest();
    const res: Response = ctx.getResponse();
    const status = exception.getStatus();
    const exRes: any = exception.getResponse();
    const message: string = exRes.message || exRes;
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toString(),
      path: req.url,
    });
  }
}

// Other Filters
/*
AllExceptionsFilter : HttpException and Error()
DB: QueryFailedError, EntityNotFoundError
WS: WsExceptionsFilter 
*/

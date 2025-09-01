import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class BodyLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const body = req.body;
    if (Object.keys(body).length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        data: null,
        message: 'Body not provided',
      });
    } else console.log(body);
    next();
  }
}

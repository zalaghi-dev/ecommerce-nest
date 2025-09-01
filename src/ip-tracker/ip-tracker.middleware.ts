import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { IpTrackerService } from 'src/ip-tracker/ip-tracker.service';

@Injectable()
export class IpTrackerMiddleware implements NestMiddleware {
  constructor(private readonly ipTracker: IpTrackerService) {}
  async use(req: Request, res: Response, next: () => void) {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    await this.ipTracker.test(req.ip);
    next();
  }
}

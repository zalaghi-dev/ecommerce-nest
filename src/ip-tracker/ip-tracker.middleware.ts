import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { IpTrackerService } from 'src/ip-tracker/ip-tracker.service';

@Injectable()
export class IpTrackerMiddleware implements NestMiddleware {
  constructor(private readonly ipTracker: IpTrackerService) {}
  async use(req: Request, res: Response, next: () => void) {
    if (req.ip) {
      await this.ipTracker.track(req.ip);
      next();
    } else return;
  }
}

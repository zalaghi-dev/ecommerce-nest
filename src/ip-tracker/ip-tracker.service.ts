import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IpRecord } from './entities/ip-record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IpTrackerService {
  private readonly MAX_REQUEST = 10;
  private readonly WINDOW_MINUTES = 1;
  private readonly BLOCK_MINUTES = 1;
  private readonly TEHRAN_TIMEZONE = 3.5 * 60 * 60 * 1000;

  constructor(
    @InjectRepository(IpRecord)
    private readonly ipRepo: Repository<IpRecord>,
  ) {}
  async track(ip: string) {
    const nowTime = new Date();
    const nowTimeTh = new Date(nowTime.getTime() + this.TEHRAN_TIMEZONE);
    const record = await this.ipRepo.findOne({ where: { ip } });
    if (!record) {
      const newRecord = this.ipRepo.create({
        ip,
        requestCount: 1,
        windowStart: nowTime,
        isBlocked: false,
        blockUntil: null,
      });
      await this.ipRepo.save(newRecord);
      console.log(`IP: ${ip} send request on time: ${nowTime.toISOString()}`);
      return;
    } else {
      // Calc win end
      const windowEnd = new Date(
        record.windowStart.getTime() +
          this.WINDOW_MINUTES * 60 * 1000 +
          this.TEHRAN_TIMEZONE,
      );

      // Refresh rec
      if (nowTimeTh > windowEnd) {
        record.requestCount = 1;
        record.windowStart = nowTime;
      } else {
        if (record.requestCount >= this.MAX_REQUEST) {
          // BLOCK
          record.isBlocked = true;
          record.blockUntil = new Date(
            nowTime.getTime() + this.BLOCK_MINUTES * 60 * 1000,
            +this.TEHRAN_TIMEZONE,
          );
          //-----
        } else {
          record.requestCount += 1;
        }
      }
      await this.ipRepo.save(record);
    }
  }
}

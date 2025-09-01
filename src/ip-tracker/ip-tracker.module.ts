import { Module } from '@nestjs/common';
import { IpTrackerService } from './ip-tracker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpRecord } from './entities/ip-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IpRecord])],
  providers: [IpTrackerService],
  exports: [IpTrackerService],
})
export class IpTrackerModule {}

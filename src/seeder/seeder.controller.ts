import { Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { Response } from 'express';

@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('seed')
  async seed(@Res() res: Response) {
    await this.seederService.seedPermissionAndRole();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Seeding completed successfully',
    });
  }
}

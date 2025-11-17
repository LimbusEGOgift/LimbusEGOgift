import { Module } from '@nestjs/common';
import { EgogiftController } from './egogift.controller';
import { EgogiftService } from './egogift.service';

@Module({
  controllers: [EgogiftController],
  providers: [EgogiftService],
})
export class EgogiftModule {}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { EgogiftService } from './egogift.service';
import { FindEGOGiftByIdentityDto } from './dto/findEGOGiftByIdentity.dto';

@Controller('EGOGift')
export class EgogiftController {
  constructor(private readonly egogiftService: EgogiftService) {}

  @Get()
  findAll() {
    return this.egogiftService.findAllEGOGift();
  }

  @Post()
  findIdentities(@Body() dto: FindEGOGiftByIdentityDto) {
    return this.egogiftService.findMatchedIdentities(dto);
  }
}

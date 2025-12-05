import { Controller, Get } from '@nestjs/common';
import { EgogiftService } from './egogift.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('EGOGift')
@Controller({ path: 'EGOGift' })
export class EgogiftController {
  constructor(private readonly egogiftService: EgogiftService) {}

  @ApiOperation({ summary: '모든 EGOGift 조회' })
  @ApiOkResponse({ description: '조회 완료' })
  @Get()
  findAll() {
    return this.egogiftService.findAllEGOGift();
  }
}

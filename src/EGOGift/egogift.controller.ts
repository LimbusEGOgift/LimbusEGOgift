import { Body, Controller, Get, Post } from '@nestjs/common';
import { EgogiftService } from './egogift.service';
import { FindIdentityByEGOGiftDto } from './dto/findIdentityByCondition.dto';
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

  @ApiOperation({ summary: '인격에 맞는 EGOGift 조회' })
  @ApiOkResponse({ description: '조회 완료' })
  @Post()
  findIdentities(@Body() dto: FindIdentityByEGOGiftDto) {
    return this.egogiftService.findMatchedIdentities(dto);
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { FindEGOGiftByIdentityDto } from './dto/findEGOGiftByKeyword.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('identity')
@Controller({ path: 'identity' })
export class IdentityController {
  constructor(private readonly app: IdentityService) {}

  @ApiOperation({ summary: '모든 인격 조회' })
  @ApiOkResponse({ description: '조회 완료' })
  @Get()
  findAll() {
    return this.app.findAllIdentity();
  }

  @ApiOperation({ summary: 'EGOGift에 맞는 인격 조회' })
  @ApiOkResponse({ description: '조회 완료' })
  @Post()
  findEGOGifts(@Body() dto: FindEGOGiftByIdentityDto) {
    return this.app.findMatchedEGOGifts(dto);
  }
}

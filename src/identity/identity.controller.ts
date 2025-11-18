import { Body, Controller, Get, Post } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { FindEGOGiftByKeywordDto } from './dto/findEGOGiftByKeyword.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiDoc } from 'src/common/swagger/envelope';
import { ControllerResponse } from 'src/common/response/controller.response';
import { IdentityCollection } from 'src/common/type/identity-EGOGift.type';

@ApiTags('identity')
@Controller({ path: 'identity' })
export class IdentityController {
  constructor(private readonly app: IdentityService) {}

  @ApiDoc({
    summary: "모든 인격 조회",
    successType: String
  })
  @Get()
  async findAll(): Promise<ControllerResponse<Record<string, IdentityCollection>>> {
    const res = await this.app.findAllIdentity();
    return ControllerResponse.success(res);
  }

  @ApiDoc({
    summary: "인격 키워드에 맞는 EGOGift 조회",
    successType: String
  })
  @Post()
  async findEGOGifts(
    @Body() dto: FindEGOGiftByKeywordDto
  ): Promise<ControllerResponse<Record<string, string[]>>> {
    const res = await this.app.findMatchedEGOGifts(dto);
    return ControllerResponse.success(res);
  }
}

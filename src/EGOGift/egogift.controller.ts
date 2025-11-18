import { Body, Controller, Get, Post } from '@nestjs/common';
import { EgogiftService } from './egogift.service';
import { FindIdentityByConditionDto } from './dto/findIdentityByCondition.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiDoc } from 'src/common/swagger/envelope';
import { ControllerResponse } from 'src/common/response/controller.response';
import { EGOGiftCollection } from 'src/common/type/identity-EGOGift.type';

@ApiTags('EGOGift')
@Controller({ path: 'EGOGift' })
export class EgogiftController {
  constructor(private readonly egogiftService: EgogiftService) {}

  @ApiDoc({
    summary: '모든 EGOGift 조회',
    successType: String,
  })
  @Get()
  async findAll(): Promise<
    ControllerResponse<Record<string, EGOGiftCollection>>
  > {
    const res = await this.egogiftService.findAllEGOGift();
    return ControllerResponse.success(res);
  }

  @ApiDoc({
    summary: 'EGOGift 조건에 맞는 인격 조회',
    successType: String,
  })
  @Post()
  async findIdentities(
    @Body() dto: FindIdentityByConditionDto,
  ): Promise<ControllerResponse<Record<string, string[]>>> {
    const res = await this.egogiftService.findMatchedIdentities(dto);
    return ControllerResponse.success(res);
  }
}

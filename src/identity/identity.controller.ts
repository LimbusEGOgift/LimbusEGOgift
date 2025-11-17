import { Body, Controller, Get, Post } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { FindIdentityByEGOGiftDto } from './dto/findIdentityByEGOGift.dto';

@Controller({ path: 'identity' })
export class IdentityController {
  constructor(private readonly app: IdentityService) {}

  @Get()
  findIdentity() {
    return this.app.findAllIdentity();
  }

  @Post()
  findEGOGift(@Body() dto: FindIdentityByEGOGiftDto) {
    return this.app.findMatchedEGOGifts(dto);
  }
}

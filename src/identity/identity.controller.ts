import { Body, Controller, Get, Post } from "@nestjs/common";
import { IdentityService } from "./identity.service";
import { FindEGOGiftDto } from "./dto/findEGOGift.dto";

@Controller({ path: "identity" })
export class IdentityController {
  constructor(private readonly app: IdentityService) {}

  @Get()
  findIdentity(){
    return this.app.findIdentityList();
  }

  @Post()
  findEGOGift(@Body() dto: FindEGOGiftDto){
    return this.app.findEGOGiftForIdentity(dto);
  }

}
import { Controller, Get } from '@nestjs/common';
import { IdentityService } from './identity.service';

@Controller({ path: 'identity' })
export class IdentityController {
  constructor(private readonly app: IdentityService) {}

  @Get()
  findIdentity() {
    return this.app.findIdentityList();
  }
}

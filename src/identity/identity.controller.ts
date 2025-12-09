import { Controller, Get } from '@nestjs/common';
import { IdentityService } from './identity.service';
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
}

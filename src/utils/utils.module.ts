import { Global, Module } from '@nestjs/common';
import { JsonLoaderService } from './json-loader.service';

@Global()
@Module({
  providers: [JsonLoaderService],
  exports: [JsonLoaderService],
})
export class UtilsModule {}

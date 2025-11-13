import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from './utils/utils.module';
import { IdentityModule } from './identity/identity.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HealthModule,
    UtilsModule,
    IdentityModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

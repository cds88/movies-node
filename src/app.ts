import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as appConstants from './app.constants';
import { AppV1Module } from './v1/v1.module';

@Module({
  imports: [
    AppV1Module,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: appConstants.APP_THROTTLE_TTL,
      limit: appConstants.APP_THROTTLE_LIMIT,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

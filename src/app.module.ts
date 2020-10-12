import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppRoutingModule } from './app-routing.module';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigUtil, LoggerUtilService } from './util';
import { default_config } from '@config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from 'nestjs-redis';
import { RequestLogInterceptor } from '@interceptors';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [AppController],
  imports: [
    AppRoutingModule,
    ConfigModule.forRoot({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      isGlobal: true,
      load: [default_config]
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      useClass: DatabaseConfigUtil
    }),
    RedisModule.register({
      // eslint-disable-next-line require-await
      onClientReady: async (client) => {
        client.on('error', (err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });

        client.on('connect', () => {
          console.warn('Connected to redis server.');
        });
      },
      url: 'redis://127.0.0.1:6379/4'
    })
  ],
  providers: [
    LoggerUtilService,
    AppService, {
      provide: APP_INTERCEPTOR,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      useClass: RequestLogInterceptor }
  ]
})
export class AppModule {}

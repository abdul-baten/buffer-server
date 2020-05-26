import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from '@app/app.controller';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppService } from '@app/app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigUtil } from './util';
import { defaultConfig } from '@config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestLogInterceptor } from '@interceptor';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AppRoutingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [defaultConfig],
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      useClass: DatabaseConfigUtil,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: RequestLogInterceptor },
  ],
})
export class AppModule {}

import {
  ConnectionHelperService,
  InsightHelperService,
  RedisHelperService,
  UserHelperService
} from '@helpers';
import { InsightController } from './controller/insight.controller';
import { InsightFacade } from './facade/insight.facade';
import { InsightService } from './service/insight.service';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/module/mongoose-schema.module';
import { TokenService } from '@utils';

@Module({
  controllers: [InsightController],
  imports: [MongooseSchemaModule],
  providers: [ConnectionHelperService, InsightFacade, InsightHelperService, InsightService, RedisHelperService, TokenService, UserHelperService]
})
export class InsightModule {}

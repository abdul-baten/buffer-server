import {
  ConnectionHelperService,
  FacebookInsightHelperService,
  RedisHelperService,
  UserHelperService
} from '@helpers';
import { FacebookInsightController } from './controller/facebook-insight.controller';
import { FacebookInsightFacade } from './facade/facebook-insight.facade';
import { FacebookInsightService } from './service/facebook-insight.service';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/module/mongoose-schema.module';
import { TokenService } from '@utils';

@Module({
  controllers: [FacebookInsightController],
  imports: [MongooseSchemaModule],
  providers: [
    ConnectionHelperService,
    FacebookInsightFacade,
    FacebookInsightHelperService,
    FacebookInsightService,
    RedisHelperService,
    TokenService,
    UserHelperService
  ]
})
export class FacebookInsightModule {}

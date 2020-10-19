import {
  ConnectionHelperService,
  InstagramInsightHelperService,
  RedisHelperService,
  UserHelperService
} from '@helpers';
import { InstagramInsightController } from './controller/instagram-insight.controller';
import { InstagramInsightFacade } from './facade/instagram-insight.facade';
import { InstagramInsightService } from './service/instagram-insight.service';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/module/mongoose-schema.module';
import { TokenService } from '@utils';

@Module({
  controllers: [InstagramInsightController],
  imports: [MongooseSchemaModule],
  providers: [ConnectionHelperService, InstagramInsightFacade, InstagramInsightHelperService, InstagramInsightService, RedisHelperService, TokenService, UserHelperService]
})
export class InstagramInsightModule {}

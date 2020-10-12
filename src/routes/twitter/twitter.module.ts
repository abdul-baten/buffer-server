import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/module/mongoose-schema.module';
import { TokenService } from '@utils';
import { TwitterController } from './controller/twitter.controller';
import { TwitterFacade } from './facade/twitter.facade';
import { TwitterHelperService, UserHelperService } from '@helpers';
import { TwitterService } from './service/twitter.service';

@Module({
  controllers: [TwitterController],
  imports: [MongooseSchemaModule],
  providers: [TwitterFacade, TwitterHelperService, TwitterService, TokenService, UserHelperService]
})
export class TwitterModule {}

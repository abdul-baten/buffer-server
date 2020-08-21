import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/mongoose-schema.module';
import { TwitterController } from './controller/twitter.controller';
import { TwitterFacade } from './facade/twitter.facade';
import { TwitterService } from './service/twitter.service';

@Module({
  controllers: [TwitterController],
  imports: [MongooseSchemaModule],
  providers: [TwitterFacade, TwitterService],
})
export class TwitterModule {}

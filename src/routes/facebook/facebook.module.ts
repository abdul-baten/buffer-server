import { FacebookController } from './controller/facebook.controller';
import { FacebookFacade } from './facade/facebook.facade';
import { FacebookService } from './service/facebook.service';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/mongoose-schema.module';

@Module({
  controllers: [FacebookController],
  imports: [MongooseSchemaModule],
  providers: [FacebookFacade, FacebookService],
})
export class FacebookModule {}

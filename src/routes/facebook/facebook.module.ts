import { FacebookController } from './controller/facebook.controller';
import { FacebookFacade } from './facade/facebook.facade';
import { FacebookService } from './service/facebook.service';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/module/mongoose-schema.module';
import { TokenService } from '@utils';
import { UserHelperService } from '@helpers';

@Module({
  controllers: [FacebookController],
  imports: [MongooseSchemaModule],
  providers: [FacebookFacade, FacebookService, TokenService, UserHelperService]
})
export class FacebookModule {}

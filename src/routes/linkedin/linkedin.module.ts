import { LinkedInController } from './controller/linkedin.controller';
import { LinkedInFacade } from './facade/linkedin.facade';
import { LinkedInHelperService, UserHelperService } from '@helpers';
import { LinkedInService } from './service/linkedin.service';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/module/mongoose-schema.module';
import { TokenService } from '@utils';

@Module({
  controllers: [LinkedInController],
  imports: [MongooseSchemaModule],
  providers: [LinkedInFacade, LinkedInHelperService, LinkedInService, TokenService, UserHelperService]
})
export class LinkedInModule {}

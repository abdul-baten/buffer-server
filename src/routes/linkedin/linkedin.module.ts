import { LinkedInController } from './controller/linkedin.controller';
import { LinkedInFacade } from './facade/linkedin.facade';
import { LinkedInService } from './service/linkedin.service';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/mongoose-schema.module';

@Module({
  controllers: [LinkedInController],
  imports: [MongooseSchemaModule],
  providers: [LinkedInFacade, LinkedInService],
})
export class LinkedInModule {}

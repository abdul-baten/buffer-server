import { InstagramController } from './controller/instagram.controller';
import { InstagramFacade } from './facade/instagram.facade';
import { InstagramService } from './service/instagram.service';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/mongoose-schema.module';

@Module({
  controllers: [InstagramController],
  imports: [MongooseSchemaModule],
  providers: [InstagramFacade, InstagramService],
})
export class InstagramModule {}

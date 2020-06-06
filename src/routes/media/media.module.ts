import { MediaController } from './controller/media.controller';
import { MediaFacade } from './facade/media.facade';
import { MediaService } from './service/media.service';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/mongoose-schema.module';

@Module({
  controllers: [MediaController],
  imports: [MongooseSchemaModule],
  providers: [MediaFacade, MediaService],
})
export class MediaModule {}

import { MediaController } from './controller/media.controller';
import { MediaFacade } from './facade/media.facade';
import { MediaHelperService, UserHelperService } from '@helpers';
import { MediaService } from './service/media.service';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/module/mongoose-schema.module';
import { TokenService } from '@utils';

@Module({
  controllers: [MediaController],
  imports: [MongooseSchemaModule],
  providers: [MediaFacade, MediaHelperService, MediaService, TokenService, UserHelperService]
})
export class MediaModule {}

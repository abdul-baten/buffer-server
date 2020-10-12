import { InstagramController } from './controller/instagram.controller';
import { InstagramFacade } from './facade/instagram.facade';
import { InstagramService } from './service/instagram.service';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/module/mongoose-schema.module';
import { TokenService } from '@utils';
import { UserHelperService } from '@helpers';

@Module({
  controllers: [InstagramController],
  imports: [MongooseSchemaModule],
  providers: [InstagramFacade, InstagramService, TokenService, UserHelperService]
})
export class InstagramModule {}

import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/module/mongoose-schema.module';
import { TokenService } from '@utils';
import { UserController } from './controller/user.controller';
import { UserFacade } from './facade/user.facade';
import { UserHelperService } from '@helpers';
import { UserService } from './service/user.service';

@Module({
  controllers: [UserController],
  imports: [MongooseSchemaModule],
  providers: [UserFacade, UserService, TokenService, UserHelperService]
})
export class UserModule {}

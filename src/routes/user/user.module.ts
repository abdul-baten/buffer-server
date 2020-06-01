import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/mongoose-schema.module';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

@Module({
  controllers: [UserController],
  imports: [MongooseSchemaModule],
  providers: [UserService],
})
export class UserModule {}

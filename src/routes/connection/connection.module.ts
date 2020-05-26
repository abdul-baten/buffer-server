import { ConnectionController } from './controller/connection.controller';
import { ConnectionSchema } from './schema/connection.schema';
import { ConnectionService } from './service/connection.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../auth/schema/user.schema';

@Module({
  controllers: [ConnectionController],
  providers: [ConnectionService],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Connection', schema: ConnectionSchema },
    ]),
  ],
})
export class ConnectionModule {}

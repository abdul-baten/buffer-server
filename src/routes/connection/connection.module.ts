import { ConnectionController } from './controller/connection.controller';
import { ConnectionFacade } from './facade/connection.facade';
import { ConnectionHelperService, RedisHelperService, UserHelperService } from '@helpers';
import { ConnectionService } from './service/connection.service';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/module/mongoose-schema.module';
import { TokenService } from '@utils';

@Module({
  controllers: [ConnectionController],
  imports: [MongooseSchemaModule],
  providers: [ConnectionFacade, ConnectionHelperService, ConnectionService, RedisHelperService, TokenService, UserHelperService]
})
export class ConnectionModule {}

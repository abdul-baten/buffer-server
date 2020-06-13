import { ConnectionController } from './controller/connection.controller';
import { ConnectionFacade } from './facade/connection.facade';
import { ConnectionService } from './service/connection.service';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/mongoose-schema.module';

@Module({
  controllers: [ConnectionController],
  imports: [MongooseSchemaModule],
  providers: [ConnectionFacade, ConnectionService],
})
export class ConnectionModule {}

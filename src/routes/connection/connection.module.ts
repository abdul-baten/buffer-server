import { ConnectionController } from './controller/connection.controller';
import { ConnectionService } from './service/connection.service';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/mongoose-schema.module';

@Module({
  controllers: [ConnectionController],
  providers: [ConnectionService],
  imports: [MongooseSchemaModule],
})
export class ConnectionModule {}

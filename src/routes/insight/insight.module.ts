import { InsightController } from './controller/insight.controller';
import { InsightFacade } from './facade/insight.facade';
import { InsightService } from './service/insight.service';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/mongoose-schema.module';

@Module({
  controllers: [InsightController],
  imports: [MongooseSchemaModule],
  providers: [InsightFacade, InsightService],
})
export class InsightModule {}

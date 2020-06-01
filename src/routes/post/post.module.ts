import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/mongoose-schema.module';
import { PostController } from './controller/post.controller';
import { PostFacade } from './facade/post.facade';
import { PostService } from './service/post.service';

@Module({
  controllers: [PostController],
  imports: [MongooseSchemaModule],
  providers: [PostFacade, PostService],
})
export class PostModule {}

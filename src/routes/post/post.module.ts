import {
  ConnectionHelperService,
  FacebookHelperService,
  LinkedInHelperService,
  PostHelperService,
  UserHelperService
} from '@helpers';
import { Module } from '@nestjs/common';
import { MongooseSchemaModule } from 'src/module/mongoose-schema.module';
import { PostController } from './controller/post.controller';
import { PostFacade } from './facade/post.facade';
import { PostService } from './service/post.service';
import { PostTaskService } from './schedule/post-task.service';
import { TokenService } from '@utils';

@Module({
  controllers: [PostController],
  imports: [MongooseSchemaModule],
  providers: [
    ConnectionHelperService,
    FacebookHelperService,
    LinkedInHelperService,
    PostFacade,
    PostHelperService,
    PostService,
    PostTaskService,
    TokenService,
    UserHelperService
  ]
})
export class PostModule {}

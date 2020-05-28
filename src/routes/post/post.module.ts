import { FileSchema } from './schema/file.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './controller/post.controller';
import { PostFacade } from './facade/post.facade';
import { PostSchema } from './schema/post.schema';
import { PostService } from './service/post.service';
import { UserSchema } from '../auth/schema/user.schema';

@Module({
  controllers: [PostController],
  imports: [
    MongooseModule.forFeature([
      { name: 'File', schema: FileSchema },
      { name: 'Post', schema: PostSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [PostFacade, PostService],
})
export class PostModule {}

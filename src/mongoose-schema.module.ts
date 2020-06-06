import { ConnectionSchema, MediaSchema, PostSchema, UserSchema } from '@schemas';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Connection', schema: ConnectionSchema },
      { name: 'Media', schema: MediaSchema },
      { name: 'Post', schema: PostSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: 'Connection', schema: ConnectionSchema },
      { name: 'Media', schema: MediaSchema },
      { name: 'Post', schema: PostSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
})
export class MongooseSchemaModule {}

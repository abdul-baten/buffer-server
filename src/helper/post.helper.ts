import { Injectable } from '@nestjs/common';
import { to } from 'await-to-js';
import type { IPost } from '@interfaces';
import type { Model } from 'mongoose';
import type { PostDto } from '@dtos';
@Injectable()
export class PostHelperService {
  public async getPostsByUserID (model: Model<IPost>, post_user_id: string): Promise<IPost[]> {
    const [error, posts] = await to(model.
      find({ post_user_id }).
      select('-__v').
      lean(true).
      exec());

    if (error) {
      throw new Error(error.message);
    }

    return posts?.length ? posts as IPost[] : [];
  }

  public async addPost (model: Model<IPost>, post_to_add: PostDto): Promise<IPost> {
    const [error, added_post] = await to(new model(post_to_add).save());

    if (error) {
      throw new Error();
    }

    return added_post as IPost;
  }
}

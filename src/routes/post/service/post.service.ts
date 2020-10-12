import to from 'await-to-js';
import {
  ConnectionHelperService,
  FacebookHelperService,
  LinkedInHelperService,
  PostHelperService
} from '@helpers';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { PostDto } from '@dtos';
import type { IConnection, IFbPostPayload, IFbResponse, ILnSuccess, IPost } from '@interfaces';

@Injectable()
export class PostService {
  // eslint-disable-next-line max-params
  constructor (
    @InjectModel('Connection') private readonly connectionModel: Model<IConnection>,
    @InjectModel('Post') private readonly postModel: Model<IPost>,
    private readonly connectionHelperService: ConnectionHelperService,
    private readonly facebookHelperService: FacebookHelperService,
    private readonly linkedInHelperService: LinkedInHelperService,
    private readonly postHelperService: PostHelperService
  ) {}

  public async getPosts (user_id: string): Promise<IPost[]> {
    const [error, posts] = await to(this.postHelperService.getPostsByUserID(this.postModel, user_id));

    if (error) {
      throw new Error(error.message);
    }

    return posts as IPost[];
  }

  public async addPost (post_dto: PostDto): Promise<IPost> {
    const [error, post] = await to(this.postHelperService.addPost(this.postModel, post_dto as PostDto));

    if (error) {
      throw new Error(error.message);
    }

    return post as IPost;
  }

  public async getConnection (connection_id: string): Promise<IConnection> {
    const [error, connection] = await to(this.connectionHelperService.getConnectionByID(this.connectionModel, connection_id));

    if (error) {
      throw new Error(error.message);
    }

    return connection as IConnection;
  }

  public async postFacebookStatus (post_payload: IFbPostPayload): Promise<IFbResponse> {
    const [error, post] = await to(this.facebookHelperService.postStatus(post_payload));

    if (error) {
      throw new Error(error.message);
    }

    return post as IFbResponse;
  }

  public async postLinkedinStatus (connection_id: string, post_message: string): Promise<ILnSuccess> {
    const [error, post] = await to(this.linkedInHelperService.postStatus(connection_id, post_message));

    if (error) {
      throw new Error(error.message);
    }

    return post as ILnSuccess;
  }
}

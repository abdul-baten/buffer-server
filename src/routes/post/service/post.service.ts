import { from, Observable } from 'rxjs';
import { I_CONNECTION, I_POST } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDTO } from '@dtos';
import { PostHelper, ConnectionHelper } from '@helpers';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<I_POST>,
    @InjectModel('Connection')
    private readonly connectionModel: Model<I_CONNECTION>,
  ) {}

  addPost(postBody: PostDTO | I_POST): Observable<I_POST> {
    const post = new this.postModel(postBody);
    return from(post.save());
  }

  async getConnection(connectionID: string): Promise<I_CONNECTION> {
    return ConnectionHelper.getConnectionByID(this.connectionModel, connectionID).toPromise();
  }

  getPosts(userID: string): Observable<I_POST[]> {
    return PostHelper.getPostsByUserID(this.postModel, userID);
  }
}

import { from, Observable } from 'rxjs';
import { I_POST } from '@interfaces';
import { Model } from 'mongoose';

export class PostHelper {
  static getPostsByUserID(postModel: Model<I_POST>, userID: string): Observable<I_POST[]> {
    const posts = postModel
      .find({ userID })
      .lean()
      .exec();

    return from(posts);
  }
}

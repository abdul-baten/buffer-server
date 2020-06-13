import { E_POST_STATUS } from '@enums';
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

  static getPostsByStatusAndDate(
    postModel: Model<I_POST>,
    postStatus: E_POST_STATUS,
    postScheduleDateTime: string,
    limit: number,
  ): Observable<I_POST[]> {
    const posts = postModel
      .find({ postStatus, postScheduleDateTime })
      .limit(limit)
      .lean()
      .exec();

    return from(posts);
  }
}

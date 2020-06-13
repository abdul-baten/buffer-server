import { Cron, CronExpression } from '@nestjs/schedule';
import { E_CONNECTION_TYPE, E_POST_STATUS, E_POST_TYPE } from '@enums';
import { FacebookHelper, PostHelper } from '@helpers';
import { formatISO, roundToNearestMinutes } from 'date-fns';
import { I_POST } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoggerUtil } from '@utils';
import { Model } from 'mongoose';
import { PostDTO } from '@dtos';
import { queue } from 'async';

@Injectable()
export class PostTaskService {
  constructor(@InjectModel('Post') private readonly postModel: Model<I_POST>) {}

  @Cron(CronExpression.EVERY_15_MINUTES)
  async handlePostCron(): Promise<void> {
    const currentDateTime = formatISO(roundToNearestMinutes(new Date(), { nearestTo: 15 }));

    const scheduledPosts = await PostHelper.getPostsByStatusAndDate(this.postModel, E_POST_STATUS.SCHEDULED, currentDateTime, 10000).toPromise();

    const asyncArrays = queue(
      (postTask: () => void, callback: () => void) => {
        postTask();
        callback();
      },
      scheduledPosts.length <= 0 ? 2 : scheduledPosts.length,
    );

    scheduledPosts.forEach((post: I_POST) => {
      asyncArrays.push(this.connectionMap.bind(this, post));
    });
  }

  private connectionMap(post: I_POST): void {
    const { connectionID, connectionType, connectionToken } = post.postConnection;

    this.postToConnections(
      this,
      connectionID as string,
      connectionType as E_CONNECTION_TYPE,
      connectionToken as string,
      post.postType,
      post.postStatus,
      post,
    );
  }

  async postToConnections(
    self: any,
    connectionID: string,
    connectionType: E_CONNECTION_TYPE,
    connectionToken: string,
    postType: E_POST_TYPE,
    postStatus: E_POST_STATUS,
    postInfo: I_POST,
  ): Promise<void> {
    if (postType === E_POST_TYPE.IMAGE) {
      if (postStatus === E_POST_STATUS.SCHEDULED) {
        switch (connectionType) {
          case E_CONNECTION_TYPE.FACEBOOK_PAGE:
          case E_CONNECTION_TYPE.FACEBOOK_GROUP:
            FacebookHelper.postImages(connectionID, connectionToken, (postInfo as unknown) as PostDTO)
              .then(() => {
                self.postModel.findByIdAndUpdate({ _id: postInfo._id }, { postStatus: E_POST_STATUS.PUBLISHED }).exec();
              })
              .catch(error => {
                LoggerUtil.logError(error);
              });
            break;
        }
      }
    } else if (postType === E_POST_TYPE.VIDEO) {
      switch (connectionType) {
        case E_CONNECTION_TYPE.FACEBOOK_PAGE:
        case E_CONNECTION_TYPE.FACEBOOK_GROUP:
          FacebookHelper.postVideo(connectionID, connectionToken, (postInfo as unknown) as PostDTO)
            .then(() => {
              self.postModel.findByIdAndUpdate({ _id: postInfo._id }, { postStatus: E_POST_STATUS.PUBLISHED }).exec();
            })
            .catch(error => {
              LoggerUtil.logError(error);
            });
          break;
      }
    } else {
      if (postStatus === E_POST_STATUS.SCHEDULED) {
        switch (connectionType) {
          case E_CONNECTION_TYPE.FACEBOOK_PAGE:
          case E_CONNECTION_TYPE.FACEBOOK_GROUP:
            FacebookHelper.postStatus(connectionID, connectionToken, postInfo.postCaption)
              .then(() => {
                self.postModel.findByIdAndUpdate({ _id: postInfo._id }, { postStatus: E_POST_STATUS.PUBLISHED }).exec();
              })
              .catch(error => {
                LoggerUtil.logError(error);
              });
            break;
        }
      }
    }
  }
}

// import { Cron, CronExpression } from '@nestjs/schedule';
// import { EConnectionType, EPostStatus, EPostType } from '@enums';
// import { FacebookHelper, PostHelper } from '@helpers';
// import { formatISO, roundToNearestMinutes } from 'date-fns';
// import { I_POST } from '@interfaces';
import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { LoggerUtil } from '@utils';
// import { Model } from 'mongoose';
// import { PostDto } from '@dtos';
// import { queue } from 'async';

@Injectable()
export class PostTaskService {
  // constructor(@InjectModel('Post') private readonly postModel: Model<I_POST>) {}

  // @Cron(CronExpression.EVERY_30_MINUTES)
  // async handlePostCron(): Promise<void> {
  //   const currentDateTime = formatISO(roundToNearestMinutes(new Date(), { nearestTo: 15 }));

  //   const scheduledPosts = await PostHelper.getPostsByStatusAndDate(this.postModel, EPostStatus.SCHEDULED, currentDateTime, 10000).toPromise();

  //   const asyncArrays = queue(
  //     (postTask: () => void, callback: () => void) => {
  //       postTask();
  //       callback();
  //     },
  //     scheduledPosts.length <= 0 ? 2 : scheduledPosts.length,
  //   );

  //   scheduledPosts.forEach((post: I_POST) => {
  //     asyncArrays.push(this.connectionMap.bind(this, post));
  //   });
  // }

  // private connectionMap(post: I_POST): void {
  //   const { connection_id, connection_type, connection_token } = post.postConnection;

  //   this.postToConnections(
  //     this,
  //     connection_id as string,
  //     connection_type as EConnectionType,
  //     connection_token as string,
  //     post.postType,
  //     post.postStatus,
  //     post,
  //   );
  // }

  // async postToConnections(
  //   self: any,
  //   connection_id: string,
  //   connection_type: EConnectionType,
  //   connection_token: string,
  //   postType: EPostType,
  //   postStatus: EPostStatus,
  //   postInfo: I_POST,
  // ): Promise<void> {
  //   if (postType === EPostType.IMAGE) {
  //     if (postStatus === EPostStatus.SCHEDULED) {
  //       switch (connection_type) {
  //         case EConnectionType.FACEBOOK_PAGE:
  //         case EConnectionType.FACEBOOK_GROUP:
  //           FacebookHelper.postImages(connection_id, connection_token, (postInfo as unknown) as PostDto)
  //             .then(() => {
  //               self.postModel.findByIdAndUpdate({ _id: postInfo._id }, { postStatus: EPostStatus.PUBLISHED }).exec();
  //             })
  //             .catch(error => {
  //               LoggerUtil.logError(error);
  //             });
  //           break;
  //       }
  //     }
  //   } else if (postType === EPostType.VIDEO) {
  //     switch (connection_type) {
  //       case EConnectionType.FACEBOOK_PAGE:
  //       case EConnectionType.FACEBOOK_GROUP:
  //         FacebookHelper.postVideo(connection_id, connection_token, (postInfo as unknown) as PostDto)
  //           .then(() => {
  //             self.postModel.findByIdAndUpdate({ _id: postInfo._id }, { postStatus: EPostStatus.PUBLISHED }).exec();
  //           })
  //           .catch(error => {
  //             LoggerUtil.logError(error);
  //           });
  //         break;
  //     }
  //   } else {
  //     if (postStatus === EPostStatus.SCHEDULED) {
  //       switch (connection_type) {
  //         case EConnectionType.FACEBOOK_PAGE:
  //         case EConnectionType.FACEBOOK_GROUP:
  //           FacebookHelper.postStatus(connection_id, connection_token, postInfo.postCaption, EPostStatus.PUBLISHED, '')
  //             .then(() => {
  //               self.postModel.findByIdAndUpdate({ _id: postInfo._id }, { postStatus: EPostStatus.PUBLISHED }).exec();
  //             })
  //             .catch(error => {
  //               LoggerUtil.logError(error);
  //             });
  //           break;
  //       }
  //     }
  //   }
  // }
}

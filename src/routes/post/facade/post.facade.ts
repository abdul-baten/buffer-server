import { Injectable } from '@nestjs/common';
import { PostMapper } from '@mappers';
import { PostService } from '../service/post.service';
import type { IPost } from '@interfaces';
import type { PostDto } from '@dtos';

@Injectable()
export class PostFacade {
  constructor (private readonly postService: PostService) {}

  public async getPosts (user_id: string): Promise<IPost[]> {
    const posts = await this.postService.getPosts(user_id);
    const posts_length = posts.length;
    const response = [];

    for (let index = 0; index < posts_length; index += 1) {
      const mapped_response = PostMapper.postResponseMapper(posts[index]);

      response.push(mapped_response);
    }

    return response;
  }

  /*
   * Async postToConnections (
   *   connection_id: string,
   *   connectionType: EConnectionType,
   *   connection_token: string,
   *   postType: EPostType,
   *   postStatus: EPostStatus,
   *   postInfo: PostDto
   * ): Promise<any> {
   *   let connectionRequest$: Observable<any> = of(null);
   */

  /*
   *   If (postType === EPostType.IMAGE) {
   *     if (postStatus === EPostStatus.PUBLISHED) {
   *       switch (connectionType) {
   *       case EConnectionType.FACEBOOK_PAGE:
   *       case EConnectionType.FACEBOOK_GROUP:
   *         connectionRequest$ = from(FacebookHelper.postImages(connection_id, connection_token, postInfo)).pipe(map((response: any) => response));
   *         break;
   */

  /*
   *       Case EConnectionType.LINKEDIN_PAGE:
   *       case EConnectionType.LINKEDIN_PROFILE:
   *         connectionRequest$ = from(LinkedInHelper.postProfileMedia(postInfo, connection_id, connection_token)).pipe(map((response: any) => response));
   *         break;
   */

  /*
   *       Case EConnectionType.TWITTER:
   *         connectionRequest$ = from(TwitterHelper.postImages(postInfo, connection_token)).pipe(map((response: any) => response));
   *         break;
   */

  /*
   *       Default:
   *         connectionRequest$ = of(null);
   *         break;
   *       }
   *     }
   *   } else if (postType === EPostType.VIDEO) {
   *     if (postStatus === EPostStatus.PUBLISHED) {
   *       switch (connectionType) {
   *       case EConnectionType.FACEBOOK_PAGE:
   *       case EConnectionType.FACEBOOK_GROUP:
   *         connectionRequest$ = from(FacebookHelper.postVideo(connection_id, connection_token, postInfo)).pipe(map((response: any) => response));
   *         break;
   */

  /*
   *       Case EConnectionType.LINKEDIN_PAGE:
   *       case EConnectionType.LINKEDIN_PROFILE:
   *         connectionRequest$ = from(LinkedInHelper.postProfileVideo(postInfo, connection_id, connection_token)).pipe(map((response: any) => response));
   *         break;
   */

  /*
   *       Case EConnectionType.TWITTER:
   *         connectionRequest$ = from(TwitterHelper.postVideos(postInfo, connection_token)).pipe(map((response: any) => response));
   *         break;
   */

  /*
   *       Default:
   *         connectionRequest$ = of(null);
   *         break;
   *       }
   *     }
   *   } else if (postStatus === EPostStatus.PUBLISHED) {
   *     switch (connectionType) {
   *     case EConnectionType.FACEBOOK_PAGE:
   *     case EConnectionType.FACEBOOK_GROUP:
   *       connectionRequest$ = from(
   * FacebookHelper.postStatus(connection_id, connection_token, postInfo.postCaption, EPostStatus.PUBLISHED, '')).pipe(map((response: any) => response)
   * );
   *       break;
   */

  /*
   *     Case EConnectionType.LINKEDIN_PAGE:
   *     case EConnectionType.LINKEDIN_PROFILE:
   *       connectionRequest$ = from(LinkedInHelper.postStatus(connection_id, connection_token, postInfo.postCaption)).pipe(map((response: any) => response));
   *       break;
   */

  /*
   *     Case EConnectionType.TWITTER:
   *       connectionRequest$ = from(TwitterHelper.postStatus(postInfo.postCaption, connection_token)).pipe(map((response: any) => response));
   *       break;
   */

  /*
   *     Default:
   *       connectionRequest$ = of(null);
   *       break;
   *     }
   *   } else {
   *     connectionRequest$ = of(null);
   *   }
   */

  /*
   *   Return connectionRequest$.toPromise();
   * }
   */

  public async publishFacebookText (post_info_dto: PostDto): Promise<IPost> {
    const {
      post_message,
      post_status,
      post_date_time,
      post_connection: { id }
    } = post_info_dto;
    const { connection_id, connection_token } = await this.postService.getConnection(id as string);

    await this.postService.postFacebookStatus({
      connection_id,
      connection_token,
      post_date_time,
      post_message,
      post_status
    });
    const added_post = await this.postService.addPost(post_info_dto);
    const response = PostMapper.postResponseMapper(added_post);

    return response;
  }

  public async scheduleFacebookText (post_info_dto: PostDto): Promise<IPost> {
    const {
      post_message,
      post_status,
      post_date_time,
      post_connection: { id }
    } = post_info_dto;
    const { connection_id, connection_token } = await this.postService.getConnection(id as string);
    const scheduled_post = await this.postService.postFacebookStatus({
      connection_id,
      connection_token,
      post_date_time,
      post_message,
      post_status
    });

    return scheduled_post as unknown as IPost;
  }

  public async publishLinkedInText (post_info_dto: PostDto): Promise<IPost> {
    const {
      post_message,
      post_connection: { id }
    } = post_info_dto;
    const { connection_id } = await this.postService.getConnection(id as string);

    await this.postService.postLinkedinStatus(connection_id, post_message);
    const added_post = await this.postService.addPost(post_info_dto);
    const response = PostMapper.postResponseMapper(added_post);

    return response;
  }
}

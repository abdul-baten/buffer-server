import * as jsonTransformer from 'jsonata';
import type { IPost } from '@interfaces';

export class PostMapper {
  static postResponseMapper (post_info: IPost): IPost {
    const response = `
    {
      "allDay": false,
      "editable": true,
      "hasEnd": false,
      "id": $._id,
      "overlap": true,
      "postCaption": $.postCaption,
      "postConnection": $.postConnection,
      "postDate": $.postDate,
      "postMedia": $.postMedia,
      "postScheduleDateTime": $.postScheduleDateTime,
      "postStatus": $.postStatus,
      "postType": $.postType,
      "start": $.postScheduleDateTime,
      "userID": $.userID,
    }
    `;

    return jsonTransformer(response).evaluate(post_info);
  }
}

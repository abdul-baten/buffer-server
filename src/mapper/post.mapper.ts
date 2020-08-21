import * as jsonTransformer from 'jsonata';
import { I_POST } from '@interfaces';

export class PostMapper {
  static postResponseMapper(postInfo: I_POST): I_POST {
    const response = `
    {
      "id": $._id,
      "postCaption": $.postCaption,
      "postConnection": $.postConnection,
      "postDate": $.postDate,
      "postMedia": $.postMedia,
      "postScheduleDateTime": $.postScheduleDateTime,
      "postStatus": $.postStatus,
      "postType": $.postType,
      "userID": $.userID,
      "start": $.postScheduleDateTime,
      "allDay": false,
      "editable": true,
      "overlap": true,
      "hasEnd": false
    }
    `;

    return jsonTransformer(response).evaluate(postInfo);
  }
}

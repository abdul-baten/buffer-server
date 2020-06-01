import * as jsonTransformer from 'jsonata';
import { I_POST } from '@interfaces';

export class PostMapper {
  static addPostResponseMapper(connection: I_POST): I_POST {
    const response = `
    {
      "id": $._id,
      "postCaption": $.postCaption,
      "postConnection": $.postConnection,
      "postDate": $.postDate,
      "postMedia": $.postMedia,
      "postScheduleDate": $.postScheduleDate,
      "postScheduleTime": $.postScheduleTime,
      "postStatus": $.postStatus,
      "postType": $.postType,
      "userID": $.userID
    }
    `;

    return jsonTransformer(response).evaluate(connection);
  }
}

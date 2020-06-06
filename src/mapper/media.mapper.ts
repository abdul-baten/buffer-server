import * as jsonTransformer from 'jsonata';
import { I_MEDIA } from '@interfaces';

export class MediaMapper {
  static addMediaResponseMapper(mediaInfo: I_MEDIA): I_MEDIA {
    const response = `{
      "id": $._id,
      "mediaMimeType": $.mediaMimeType,
      "mediaName": $.mediaName,
      "mediaType": $.mediaType,
      "mediaSize": $.mediaSize,
      "mediaURL": $.mediaURL,
      "userID": $.userID
    }`;

    return jsonTransformer(response).evaluate(mediaInfo);
  }
}

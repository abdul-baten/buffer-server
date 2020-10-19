import jsonTransformer from 'jsonata';
import type { IMedia } from '@interfaces';

export class MediaMapper {
  static addMediaResponseMapper (media_info: IMedia): IMedia {
    const response = `{
      "id": $._id,
      "mediaMimeType": $.mediaMimeType,
      "mediaName": $.mediaName,
      "mediaType": $.mediaType,
      "mediaSize": $.mediaSize,
      "mediaURL": $.mediaURL,
      "userID": $.userID
    }`;

    return jsonTransformer(response).evaluate(media_info);
  }
}

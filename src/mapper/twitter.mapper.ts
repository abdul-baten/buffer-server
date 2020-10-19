import jsonTransformer from 'jsonata';
import type { IConnection } from '@interfaces';

export class TwitterMapper {
  static twtProfileResponseMapper (profile_info: any): IConnection {
    const response = `{
        "connection_category": $.connection_type,
        "connection_id": $.id,
        "connection_name": $.name,
        "connection_type": $.connection_type,
        "connection_picture": $.profile_image_url_https,
        "connection_token": $.oauth_token
    }`;

    return jsonTransformer(response).evaluate(profile_info);
  }
}

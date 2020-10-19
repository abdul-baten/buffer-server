import jsonTransformer from 'jsonata';
import type { IConnection, IFbPage } from '@interfaces';

export class InstagramMapper {
  static businessAccountsResponseMapper (page_info: Partial<IFbPage>): IConnection {
    const response = `{
        "connection_category": $.category,
        "connection_id": $.id,
        "connection_name": $.username,
        "connection_type": $.connection_type,
        "connection_picture": $.profile_picture_url,
        "connection_token": $.accessToken
    }`;

    return jsonTransformer(response).evaluate(page_info);
  }
}

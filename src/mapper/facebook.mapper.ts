import jsonTransformer from 'jsonata';
import { EConnectionType } from '@enums';
import type { IConnection, IFbGroup, IFbPage } from '@interfaces';

export class FacebookMapper {
  static pageResponseMapper (page_info: Partial<IFbPage>): IConnection {
    const response = `{
        "connection_category": $.category,
        "connection_id": $.id,
        "connection_name": $.name,
        "connection_type": ${EConnectionType.FACEBOOK_PAGE},
        "connection_picture": $.picture.data.url,
        "connection_token": $.access_token
    }`;

    return jsonTransformer(response).evaluate(page_info);
  }

  static groupResponseMapper (page_info: IFbGroup): IConnection {
    const response = `{
        "connection_category": $.privacy,
        "connection_id": $.id,
        "connection_name": $.name,
        "connection_type": ${EConnectionType.FACEBOOK_GROUP},
        "connection_picture": $.picture.data.url,
        "connection_token": $.access_token
    }`;

    return jsonTransformer(response).evaluate(page_info);
  }
}

import * as jsonTransformer from 'jsonata';
import { EConnectionType } from '@enums';
import type { IConnection, IFbGroup, IFbPage } from '@interfaces';

export class ConnectionMapper {
  static fbPageResponseMapper (page_info: Partial<IFbPage>): IConnection {
    const response = `{
        "connection_category": $.category,
        "connection_id": $.id,
        "connection_name": $.name,
        "connection_network": ${EConnectionType.FACEBOOK_PAGE},
        "connection_picture": $.picture.data.url,
        "connection_token": $.access_token
    }`;

    return jsonTransformer(response).evaluate(page_info);
  }

  static fbGroupResponseMapper (page_info: IFbGroup): IConnection {
    const response = `{
        "connection_category": $.privacy,
        "connection_id": $.id,
        "connection_name": $.name,
        "connection_network": ${EConnectionType.FACEBOOK_GROUP},
        "connection_picture": $.picture.data.url,
        "connection_token": $.access_token
    }`;

    return jsonTransformer(response).evaluate(page_info);
  }

  static connectionsResponseMapper (connection_info: IConnection): IConnection {
    const response = `{
      "connectionAdded": $.connectionAdded,
      "connection_category": $.connection_category,
      "connection_id": $.connection_id,
      "connection_name": $.connection_name,
      "connection_picture": $.connection_picture,
      "connectionStatus": $.connectionStatus,
      "connection_token": $.connection_token,
      "connectionType": $.connectionType,
      "connectionUpdated": $.connectionUpdated,
      "connectionUserID": $.connectionUserID,
      "id": $.id
    }`;

    return jsonTransformer(response).evaluate(connection_info);
  }

  static instagramAccountsResponseMapper (page_info: Partial<IFbPage>): IConnection {
    const response = `{
        "connection_category": $.category,
        "connection_id": $.id,
        "connection_name": $.username,
        "connection_network": $.connection_network,
        "connection_picture": $.profile_picture_url,
        "connection_token": $.accessToken
    }`;

    return jsonTransformer(response).evaluate(page_info);
  }
}

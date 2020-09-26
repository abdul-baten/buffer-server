import * as jsonTransformer from 'jsonata';
import { E_CONNECTION_TYPE } from '@enums';
import { I_CONNECTION, I_FB_GROUP, I_FB_PAGE } from '@interfaces';

export class ConnectionMapper {
  static fbPageResponseMapper(pageInfo: Partial<I_FB_PAGE>): I_CONNECTION {
    const response = `{
        "connectionCategory": $.category,
        "connectionID": $.id,
        "connectionName": $.name,
        "connectionNetwork": ${E_CONNECTION_TYPE.FACEBOOK_PAGE},
        "connectionPicture": $.picture.data.url,
        "connectionToken": $.access_token
    }`;

    return jsonTransformer(response).evaluate(pageInfo);
  }

  static fbGroupResponseMapper(pageInfo: I_FB_GROUP): I_CONNECTION {
    const response = `{
        "connectionCategory": $.privacy,
        "connectionID": $.id,
        "connectionName": $.name,
        "connectionNetwork": ${E_CONNECTION_TYPE.FACEBOOK_GROUP},
        "connectionPicture": $.picture.data.url,
        "connectionToken": $.access_token
    }`;

    return jsonTransformer(response).evaluate(pageInfo);
  }

  static connectionsResponseMapper(connectionInfo: I_CONNECTION): I_CONNECTION {
    const response = `{
      "connectionAdded": $.connectionAdded,
      "connectionCategory": $.connectionCategory,
      "connectionID": $.connectionID,
      "connectionName": $.connectionName,
      "connectionPicture": $.connectionPicture,
      "connectionStatus": $.connectionStatus,
      "connectionToken": $.connectionToken,
      "connectionType": $.connectionType,
      "connectionUpdated": $.connectionUpdated,
      "connectionUserID": $.connectionUserID,
      "id": $._id
    }`;

    return jsonTransformer(response).evaluate(connectionInfo);
  }

  static instagramAccountsResponseMapper(pageInfo: Partial<I_FB_PAGE>): I_CONNECTION {
    const response = `{
        "connectionCategory": $.category,
        "connectionID": $.id,
        "connectionName": $.username,
        "connectionNetwork": $.connectionNetwork,
        "connectionPicture": $.profile_picture_url,
        "connectionToken": $.accessToken
    }`;

    return jsonTransformer(response).evaluate(pageInfo);
  }
}

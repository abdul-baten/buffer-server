import * as jsonTransformer from 'jsonata';
import { E_CONNECTION_TYPE } from '@enums';
import { I_CONNECTION, I_FB_PAGE } from '@interfaces';

export class ConnectionMapper {
  static fbPageResponseMapper(pageInfo: Partial<I_FB_PAGE>): I_CONNECTION {
    const response = `
    {
        "connectionToken": $.access_token,
        "connectionCategory": $.category,
        "connectionID": $.id,
        "connectionName": $.name,
        "connectionPicture": $.picture.data.url,
        "connectionNetwork": ${E_CONNECTION_TYPE.FACEBOOK_PAGE}
    }
    `;

    return jsonTransformer(response).evaluate(pageInfo);
  }

  static connectionsResponseMapper(connection: I_CONNECTION): I_CONNECTION {
    const response = `
    {
      "id": $._id,
      "connectionAdded": $.connectionAdded,
      "connectionUpdated": $.connectionUpdated,
      "connectionToken": $.connectionToken,
      "connectionCategory": $.connectionCategory,
      "connectionID": $.connectionID,
      "connectionName": $.connectionName,
      "connectionPicture": $.connectionPicture,
      "connectionUserID": $.connectionUserID,
      "connectionStatus": $.connectionStatus,
      "connectionType": $.connectionType
    }
    `;

    return jsonTransformer(response).evaluate(connection);
  }
}

import jsonTransformer from 'jsonata';
import type { IConnection } from '@interfaces';

export class ConnectionMapper {
  static connectionsResponseMapper (connection_info: IConnection): IConnection {
    const response = `{
      "connection_added": $.connection_added,
      "connection_category": $.connection_category,
      "connection_id": $.connection_id,
      "connection_name": $.connection_name,
      "connection_picture": $.connection_picture,
      "connection_status": $.connection_status,
      "connection_token": $.connection_token,
      "connection_type": $.connection_type,
      "connection_updated": $.connection_updated,
      "connection_user_id": $.connection_user_id,
      "id": $.id
    }`;

    return jsonTransformer(response).evaluate(connection_info);
  }

  static addStoreResponseMapper (connection_info: IConnection): IConnection {
    const response = `{
      "connection_added": $.connection_added,
      "connection_category": $.connection_category,
      "connection_id": $.connection_id,
      "connection_name": $.connection_name,
      "connection_picture": $.connection_picture,
      "connection_status": $.connection_status,
      "connection_type": $.connection_type,
      "connection_updated": $.connection_updated,
      "connection_user_id": $.connection_user_id,
      "id": $.id
    }`;

    return jsonTransformer(response).evaluate(connection_info);
  }
}

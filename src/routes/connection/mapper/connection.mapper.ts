import * as jsonTransformer from 'jsonata';
import { E_CONNECTION_TYPE } from '@app/enum';
import { I_CONNECTION, I_FB_PAGE } from '@app/interface';

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
}

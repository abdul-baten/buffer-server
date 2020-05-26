import * as jsonTransformer from 'jsonata';
import { E_CONNECTION_TYPE } from '@app/enum';
import { I_CONNECTION, IFBPage } from '@app/interface';

export class SocialProfileMapper {
  static fbPageResponseMapper(pageInfo: Partial<IFBPage>): I_CONNECTION {
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

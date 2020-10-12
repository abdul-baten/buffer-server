import { Injectable } from '@nestjs/common';
import { InstagramService } from '../service/instagram.service';
import type { IConnection, IFbAuthResponse } from '@interfaces';

@Injectable()
export class InstagramFacade {
  constructor (private readonly instagramService: InstagramService) {}

  public async authenticateInstagram (connection_type: string): Promise<string> {
    const auth = await this.instagramService.authenticateInstagram(connection_type);

    return auth;
  }

  public async authorizeInstagram (code: string, connection_type: string): Promise<IFbAuthResponse> {
    const auth = await this.instagramService.authorizeInstagram(code, connection_type);

    return auth;
  }

  public async businessAccounts (auth_response: IFbAuthResponse): Promise<IConnection[]> {
    const auth = await this.instagramService.businessAccounts(auth_response);

    return auth;
  }
}

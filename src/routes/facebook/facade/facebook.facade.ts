import { FacebookService } from '../service/facebook.service';
import { Injectable } from '@nestjs/common';
import type { IFbAuthResponse, IConnection, IRedirectResponse } from '@interfaces';

@Injectable()
export class FacebookFacade {
  constructor (private readonly facebookService: FacebookService) {}

  public authenticateFacebook (connection_type: string): IRedirectResponse {
    const redirect_uri = this.facebookService.authenticateFacebook(connection_type);

    return redirect_uri;
  }

  public async authorizeFacebook (code: string, connection_type: string): Promise<IFbAuthResponse> {
    const response = await this.facebookService.authorizeFacebook(code, connection_type);

    return response;
  }

  public async getFBPages (access_token: string): Promise<IConnection[]> {
    const pages_list = await this.facebookService.getPages(access_token);

    return pages_list;
  }

  public async getFacebookGroups (access_token: string): Promise<IConnection[]> {
    const response = await this.facebookService.getGroups(access_token);

    return response;
  }
}

import { Injectable } from '@nestjs/common';
import { LinkedInHelperService } from '@helpers';
import type { IConnection } from '@interfaces';

@Injectable()
export class LinkedInService {
  constructor (private readonly linkedinHelperService:LinkedInHelperService) {}

  public async authorize (connection_type: string): Promise<string> {
    const redirect_uri = await this.linkedinHelperService.authorize(connection_type);

    return redirect_uri;
  }

  public async getAccessToken (connection_type: string, code: string): Promise<string> {
    const access_token = await this.linkedinHelperService.getAccessToken(connection_type, code);

    return access_token;
  }

  public async getUserInfo (connection_token: string): Promise<IConnection> {
    const user = await this.linkedinHelperService.getUserInfo(connection_token);

    return user;
  }

  public async getUserOrgs (connection_token: string): Promise<IConnection[]> {
    const organizations = await this.linkedinHelperService.getUserOrgs(connection_token);

    return organizations;
  }
}

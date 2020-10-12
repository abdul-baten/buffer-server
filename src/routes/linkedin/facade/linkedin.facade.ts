import { EConnectionType } from '@enums';
import { Injectable } from '@nestjs/common';
import { LinkedInMapper } from '@mappers';
import { LinkedInService } from '../service/linkedin.service';
import type { IConnection } from '@interfaces';

@Injectable()
export class LinkedInFacade {
  constructor (private readonly linkedInService: LinkedInService) {}

  public async authorize (connection_type: string): Promise<string> {
    const redirect_uri = await this.linkedInService.authorize(connection_type);

    return redirect_uri;
  }

  public async getAccessToken (connection_type: string, code: string): Promise<string> {
    const access_token = await this.linkedInService.getAccessToken(connection_type, code);

    return access_token;
  }

  public async getUserInfo (connection_token: string): Promise<IConnection> {
    const user_info = await this.linkedInService.getUserInfo(connection_token);

    user_info.connection_token = connection_token;
    user_info.connection_type = EConnectionType.LINKEDIN_PROFILE;

    return LinkedInMapper.profileResponseMapper(user_info);
  }

  public async getUserOrgs (connection_token: string): Promise<IConnection[]> {
    const organisations: IConnection[] = await this.linkedInService.getUserOrgs(connection_token);
    const organisations_length: number = organisations.length;
    const connections: IConnection[] = [];

    for (let index = 0; index < organisations_length; index += 1) {
      const { connection_id, connection_name } = organisations[index];
      const connection = {
        connection: 'Organization Page',
        connection_id,
        connection_name,
        connection_token,
        connection_type: EConnectionType.LINKEDIN_PROFILE
      };

      connections.push(LinkedInMapper.orgsResponseMapper(connection));
    }

    return connections;
  }
}

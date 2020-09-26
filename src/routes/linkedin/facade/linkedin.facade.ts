import { E_CONNECTION_TYPE } from '@enums';
import { I_CONNECTION, I_LN_ACCESS_TOKEN_RESPONSE } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { LinkedInMapper } from '@mappers';
import { LinkedInService } from '../service/linkedin.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class LinkedInFacade {
  constructor(private readonly linkedInService: LinkedInService) {}

  authorize(connectionType: string): string {
    return this.linkedInService.authorize(connectionType);
  }

  getAccessToken(connectionType: string, code: string): Observable<I_LN_ACCESS_TOKEN_RESPONSE> {
    return this.linkedInService.getAccessToken(connectionType, code);
  }

  getUserInfo(accessToken: string): Observable<I_CONNECTION> {
    const userInfoResponse$ = this.linkedInService.getUserInfo(accessToken);
    return userInfoResponse$.pipe(
      map((userResponse: any) => {
        userResponse.accessToken = accessToken;
        userResponse.connectionNetwork = E_CONNECTION_TYPE.LINKEDIN_PROFILE;
        return LinkedInMapper.profileResponseMapper(userResponse);
      }),
    );
  }

  getUserOrgs(accessToken: string): Observable<I_CONNECTION[]> {
    const userInfoResponse$ = this.linkedInService.getUserOrgs(accessToken);
    return userInfoResponse$.pipe(
      map((connections: I_CONNECTION[]) => {
        return connections.map((entry: I_CONNECTION) => {
          const { connectionID, connectionName } = entry;
          const connection = {
            connectionCategory: 'Organization Page',
            connectionID,
            connectionName,
            connectionNetwork: E_CONNECTION_TYPE.LINKEDIN_PROFILE,
            connectionToken: accessToken,
          };
          return LinkedInMapper.orgsResponseMapper(connection);
        });
      }),
    );
  }
}

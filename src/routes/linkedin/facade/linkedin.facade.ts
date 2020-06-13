import { AddConnectionDTO } from '@dtos';
import { catchError, map } from 'rxjs/operators';
import { E_CONNECTION_TYPE } from '@enums';
import { from, Observable } from 'rxjs';
import { I_CONNECTION, I_LN_ACCESS_TOKEN_RESPONSE } from '@interfaces';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LinkedInMapper, ConnectionMapper } from '@mappers';
import { LinkedInService } from '../service/linkedin.service';
import { SanitizerUtil } from '@utils';

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
        return LinkedInMapper.lnProfileResponseMapper(userResponse);
      }),
    );
  }

  addLinkedInProfile(addLNProfileDTO: AddConnectionDTO): Observable<I_CONNECTION> {
    const connectionInfo$ = this.linkedInService.addLinkedInProfile(addLNProfileDTO);
    return from(connectionInfo$).pipe(
      map((connection: I_CONNECTION) => SanitizerUtil.sanitizedResponse(connection)),
      map((connection: I_CONNECTION) => ConnectionMapper.connectionsResponseMapper(connection)),
      catchError(error => {
        throw new InternalServerErrorException(error);
      }),
    );
  }
}

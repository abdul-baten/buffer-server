import { AddConnectionDTO } from '@dtos';
import { from, Observable } from 'rxjs';
import { I_CONNECTION, I_LN_ACCESS_TOKEN_RESPONSE } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LinkedInHelper } from '@helpers';
import { Model } from 'mongoose';

@Injectable()
export class LinkedInService {
  constructor(
    @InjectModel('Connection')
    private readonly connectionModel: Model<I_CONNECTION>,
  ) {}

  authorize(connectionType: string): string {
    const redirectUrl = LinkedInHelper.authorize(connectionType);
    return redirectUrl;
  }

  getAccessToken(connectionType: string, code: string): Observable<I_LN_ACCESS_TOKEN_RESPONSE> {
    const accessTokenResponse = LinkedInHelper.getAccessToken(connectionType, code);
    return from(accessTokenResponse);
  }

  getUserInfo(accessToken: string): Observable<I_CONNECTION> {
    const userInfoResponse$ = LinkedInHelper.getUserInfo(accessToken);
    return from(userInfoResponse$);
  }

  addLinkedInProfile(addLNProfileDTO: AddConnectionDTO): Promise<I_CONNECTION> {
    const connection = new this.connectionModel(addLNProfileDTO);
    return connection.save();
  }
}

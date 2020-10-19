import { EConnectionType } from '@enums';
import { Injectable } from '@nestjs/common';
import { TwitterMapper } from '@mappers';
import { TwitterService } from '../service/twitter.service';
import type { IConnection } from '@interfaces';

@Injectable()
export class TwitterFacade {
  constructor (private readonly twitterService: TwitterService) {}

  public async authorize (): Promise<string> {
    const authorize = await this.twitterService.authorize();

    return authorize;
  }

  public async getProfile (oauth_token: string, oauth_verifier: string): Promise<IConnection> {
    const profile_info = await this.twitterService.getProfile(oauth_token, oauth_verifier);
    const connection_token = [profile_info.token, profile_info.oauth_token_secret];
    const profile = await JSON.parse(profile_info.response);

    profile.oauth_token = connection_token.toString();
    profile.connection_type = EConnectionType.TWITTER;

    return TwitterMapper.twtProfileResponseMapper(profile);
  }
}

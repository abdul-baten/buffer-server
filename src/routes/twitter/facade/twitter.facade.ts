import { E_CONNECTION_TYPE } from '@enums';
import { from } from 'rxjs';
import { I_CONNECTION } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { TwitterMapper } from '@mappers';
import { TwitterService } from '../service/twitter.service';

@Injectable()
export class TwitterFacade {
  constructor(private readonly twitterService: TwitterService) {}

  async authorize(): Promise<string> {
    return this.twitterService.authorize();
  }

  async getProfile(oauth_token: string, oauth_verifier: string): Promise<I_CONNECTION> {
    return (from(this.twitterService.getProfile(oauth_token, oauth_verifier))
      .pipe(
        map((resp: any) => {
          const connectionToken = [resp.token, resp.oauth_token_secret];
          const profileInfo = JSON.parse(resp.response);
          profileInfo.oauth_token = connectionToken.toString();
          profileInfo.connectionNetwork = E_CONNECTION_TYPE.TWITTER;
          return profileInfo;
        }),
        map(response => TwitterMapper.twtProfileResponseMapper(response)),
      )
      .toPromise() as unknown) as I_CONNECTION;
  }
}

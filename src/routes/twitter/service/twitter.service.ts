import to from 'await-to-js';
import { Injectable } from '@nestjs/common';
import { TwitterHelperService } from '@helpers';

@Injectable()
export class TwitterService {
  constructor (private readonly twitterHelperService: TwitterHelperService) {}
  public async authorize (): Promise<string> {
    const [error, redirect_uri] = await to(this.twitterHelperService.authorize());

    if (error) {
      throw new Error(error.message);
    }

    return redirect_uri as string;
  }

  async getProfile (oauth_token: string, oauth_verifier: string): Promise<any> {
    const [error, twitter_profile] = await to(this.twitterHelperService.getProfile(oauth_token, oauth_verifier));

    if (error) {
      throw new Error(error.message);
    }

    return twitter_profile;
  }
}

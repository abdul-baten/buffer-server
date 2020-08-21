import { Injectable } from '@nestjs/common';
import { TwitterHelper } from '@helpers';

@Injectable()
export class TwitterService {
  constructor() {}

  async authorize(): Promise<string> {
    const redirectUrl = await TwitterHelper.authorize();
    return redirectUrl;
  }

  async getProfile(oauth_token: string, oauth_verifier: string): Promise<any> {
    return TwitterHelper.getProfile(oauth_token, oauth_verifier);
  }
}

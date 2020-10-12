import { ConfigService } from '@nestjs/config';
import { CryptoUtil } from './crypto.util';
import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'bluebird';
import { sign, verify } from 'jsonwebtoken';
import { to } from 'await-to-js';
import type { IUser } from '@interfaces';

@Injectable()
export class TokenService {
  constructor (private readonly configService: ConfigService) {}

  public async jwtSign (payload: Partial<IUser>): Promise<string> {
    const sign_in_options = {
      algorithm: this.configService.get('SESSION.ALGORITHM'),
      audience: this.configService.get('SESSION.AUDIENCE') as string,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      expiresIn: this.configService.get('SESSION.EXPIRATION') as string,
      issuer: this.configService.get('SESSION.ISSUER') as string,
      subject: this.configService.get('SESSION.SUBJECT') as string
    };
    const private_key = this.configService.get('SESSION.PRIVATE_KEY') as string;
    const encryption_key = this.configService.get('SESSION.CRYPTO_KEY') as string;
    const secret_or_private_key = await resolve(readFileSync(private_key, { encoding: 'utf8' }));
    const jwt = await resolve(sign(payload, secret_or_private_key, sign_in_options));
    const encoded_token = await CryptoUtil.encryptData(jwt, encryption_key);

    return encoded_token;
  }

  public async jwtVerify (token: string): Promise<Partial<IUser>> {
    let error,
      decoded_token,
      secret_or_public_key,
      user_info;
    const sign_in_options = {
      algorithm: this.configService.get('SESSION.ALGORITHM'),
      audience: this.configService.get('SESSION.AUDIENCE'),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      expiresIn: this.configService.get('SESSION.EXPIRATION'),
      issuer: this.configService.get('SESSION.ISSUER'),
      subject: this.configService.get('SESSION.SUBJECT')
    };
    const public_key = this.configService.get('SESSION.PUBLIC_KEY');
    const encryption_key = this.configService.get('SESSION.CRYPTO_KEY');

    [error, decoded_token] = await to(CryptoUtil.decryptData(token, encryption_key));

    if (error) {
      throw new Error('Could not decrypt');
    }

    [error, secret_or_public_key] = await to(resolve(readFileSync(public_key, { encoding: 'utf8' })));

    if (error) {
      throw new Error('Could not read');
    }

    [error, user_info] = await to(resolve(verify(decoded_token as string, secret_or_public_key as string, sign_in_options)));

    if (error) {
      throw new Error('Token error');
    }

    return user_info as Partial<IUser>;
  }
}

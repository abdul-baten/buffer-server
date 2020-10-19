import to from 'await-to-js';
import { ConfigService } from '@nestjs/config';
import { CryptoUtil } from './crypto.util';
import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'bluebird';
import { sign, verify } from 'jsonwebtoken';
import type { IJwtToken } from '@interfaces';

@Injectable()
export class TokenService {
  constructor (private readonly configService: ConfigService) {}

  public async jwtSign (payload: Partial<IJwtToken>): Promise<string> {
    let error,
      secret_or_private_key,
      jwt_token,
      encoded_token;

    const sign_in_options = {
      algorithm: this.configService.get('SESSION.ALGORITHM'),
      audience: this.configService.get('SESSION.AUDIENCE'),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      expiresIn: this.configService.get('SESSION.JWT_EXPIRATION'),
      issuer: this.configService.get('SESSION.ISSUER'),
      subject: this.configService.get('SESSION.SUBJECT')
    };
    const private_key = this.configService.get('SESSION.PRIVATE_KEY') as string;
    const encryption_key = this.configService.get('SESSION.CRYPTO_KEY') as string;

    [error, secret_or_private_key] = await to(resolve(readFileSync(private_key, { encoding: 'utf8' })));
    if (error) {
      throw new Error(error.message);
    }

    [error, jwt_token] = await to(resolve(sign(payload, secret_or_private_key as string, sign_in_options)));
    if (error) {
      throw new Error(error.message);
    }

    [error, encoded_token] = await to(CryptoUtil.encryptData(jwt_token, encryption_key));
    if (error) {
      throw new Error(error.message);
    }

    return encoded_token as string;
  }

  public async jwtVerify (token: string): Promise<IJwtToken> {
    let error,
      decoded_token,
      secret_or_public_key,
      token_info;
    const sign_in_options = {
      algorithm: this.configService.get('SESSION.ALGORITHM'),
      audience: this.configService.get('SESSION.AUDIENCE'),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      expiresIn: this.configService.get('SESSION.JWT_EXPIRATION'),
      issuer: this.configService.get('SESSION.ISSUER'),
      subject: this.configService.get('SESSION.SUBJECT')
    };
    const public_key = this.configService.get('SESSION.PUBLIC_KEY');
    const encryption_key = this.configService.get('SESSION.CRYPTO_KEY');

    [error, decoded_token] = await to(CryptoUtil.decryptData(token, encryption_key));

    if (error) {
      throw new Error(error.message);
    }

    [error, secret_or_public_key] = await to(resolve(readFileSync(public_key, { encoding: 'utf8' })));

    if (error) {
      throw new Error(error.message);
    }

    [error, token_info] = await to(resolve(verify(decoded_token as string, secret_or_public_key as string, sign_in_options)));

    if (error) {
      throw new Error(error.message);
    }

    return token_info as IJwtToken;
  }
}

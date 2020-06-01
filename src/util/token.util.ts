import { ConfigService } from '@nestjs/config';
import { CryptoUtil } from './crypto.util';
import { I_USER } from '@interfaces';
import { LoggerUtil } from './logger.util';
import { readFileSync } from 'fs';
import { sign, verify } from 'jsonwebtoken';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

export class TokenUtil {
  static async jwtSign(
    payload: { email: string; _id: string },
    configService: ConfigService,
  ): Promise<string> {
    try {
      const signOptions = {
          algorithm: configService.get<string>('SESSION.ALGORITHM') as any,
          audience: configService.get<string>('SESSION.AUDIENCE') as string,
          expiresIn: configService.get<string>('SESSION.EXPIRATION') as string,
          issuer: configService.get<string>('SESSION.ISSUER') as string,
          subject: configService.get<string>('SESSION.SUBJECT') as string,
        },
        privateKey = configService.get<string>('SESSION.PRIVATE_KEY') as string,
        encryptionKey = configService.get<string>(
          'SESSION.CRYPTO_KEY',
        ) as string,
        jwt = sign(payload, readFileSync(privateKey, 'utf8'), signOptions);
      return CryptoUtil.encryptData(jwt, encryptionKey);
    } catch (error) {
      LoggerUtil.logError(error);
      throw new InternalServerErrorException(error);
    }
  }

  static async jwtVerify(
    token: string,
    configService: ConfigService,
  ): Promise<Partial<I_USER>> {
    try {
      const signOptions = {
          algorithm: configService.get<string>('SESSION.ALGORITHM') as any,
          audience: configService.get<string>('SESSION.AUDIENCE') as string,
          expiresIn: configService.get<string>('SESSION.EXPIRATION') as string,
          issuer: configService.get<string>('SESSION.ISSUER') as string,
          subject: configService.get<string>('SESSION.SUBJECT') as string,
        },
        publicKey = configService.get<string>('SESSION.PUBLIC_KEY') as string,
        encryptionKey = configService.get<string>(
          'SESSION.CRYPTO_KEY',
        ) as string,
        decodedToken = await CryptoUtil.decryptData(token, encryptionKey),
        tokenInfo = verify(
          decodedToken,
          readFileSync(publicKey, 'utf8'),
          signOptions,
        ) as I_USER;

      const { email, _id } = tokenInfo;
      return { email, _id };
    } catch (error) {
      LoggerUtil.logError(error);
      throw new UnauthorizedException();
    }
  }

  static async verifyUser(
    token: string,
    configService: ConfigService,
  ): Promise<Partial<I_USER>> {
    return TokenUtil.jwtVerify(token, configService);
  }
}

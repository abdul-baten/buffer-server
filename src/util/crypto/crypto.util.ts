import { InternalServerErrorException } from '@nestjs/common';
import { LoggerUtil } from '../logger/logger.util';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';

const resizedIV = Buffer.allocUnsafe(16),
  iv = createHash('sha256')
    .update(randomBytes(32))
    .digest();

iv.copy(resizedIV);

export class CryptoUtil {
  private static getHashedKey(key: string): Buffer {
    return createHash('sha256')
      .update(key)
      .digest();
  }

  public static encryptData(text: string, encryptionKey: string): string {
    const key = this.getHashedKey(encryptionKey);
    let cipher = createCipheriv('aes256', key, resizedIV);
    let encrypted = cipher.update(text, 'binary', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  static async decryptData(text: any, encryptionKey: string): Promise<string> {
    try {
      const key = this.getHashedKey(encryptionKey);
      let decipher = createDecipheriv('aes256', key, resizedIV);
      let decrypted = decipher.update(text, 'hex', 'binary');
      return decrypted + decipher.final('binary');
    } catch (error) {
      LoggerUtil.logError(error);
      throw new InternalServerErrorException(error);
    }
  }
}

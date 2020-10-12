import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { resolve } from 'bluebird';

// eslint-disable-next-line no-magic-numbers
const resized_iv = Buffer.allocUnsafe(16),
  iv = createHash('sha256').
    // eslint-disable-next-line no-magic-numbers
    update(randomBytes(32)).
    digest();

iv.copy(resized_iv);

export class CryptoUtil {
  private static async getHashedKey (key: string): Promise<Buffer> {
    const buffer = await resolve(createHash('sha256').
      update(key).
      digest());

    return buffer;
  }

  public static async encryptData (text: any, encryption_key: string): Promise<string> {
    const key = await this.getHashedKey(encryption_key);
    const cipher = await resolve(createCipheriv('aes256', key, resized_iv));
    let encrypted = await resolve(cipher.update(text, 'binary', 'hex'));

    encrypted += await resolve(cipher.final('hex'));

    return encrypted;
  }

  static async decryptData (text: string, encryption_key: string): Promise<string> {
    const key = await this.getHashedKey(encryption_key);
    const decipher = await resolve(createDecipheriv('aes256', key, resized_iv));
    let decrypted = await resolve(decipher.update(text, 'hex', 'binary'));

    decrypted += await resolve(decipher.final('binary'));

    return decrypted;
  }
}

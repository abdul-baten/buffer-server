import { method } from 'bluebird';
import { randomBytes } from 'crypto';

export class CommonUtil {
  public static parseJson (): any {
    return method(JSON.parse);
  }

  public static base64String (): string {
    // eslint-disable-next-line no-magic-numbers
    const bytes = randomBytes(12);
    const bytes_string = bytes.toString('base64');
    const sanitized_string = bytes_string.
      // eslint-disable-next-line require-unicode-regexp
      replace(/\+/g, '-').
      // eslint-disable-next-line require-unicode-regexp
      replace(/\//g, '_').
      // eslint-disable-next-line require-unicode-regexp
      replace(/[=]/g, '');

    return sanitized_string;
  }
}

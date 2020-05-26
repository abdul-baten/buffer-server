import * as stringify from 'json-stringify-safe';
import { ESanitizer } from '@app/enum';
import { omit } from 'lodash';

export class SanitizerUtil {
  static sanitizedResponse(
    unsanitizedData: Record<string, any>,
  ): Record<string, any> {
    return omit(JSON.parse(stringify(unsanitizedData)), [
      ESanitizer.MONGO_VERSION,
      ESanitizer.USER_PASSWORD,
    ]);
  }
}

import * as stringify from 'json-stringify-safe';
import { E_SANITIZE } from '@enums';
import { omit } from 'lodash';
export class SanitizerUtil {
  static sanitizedResponse(
    unsanitizedData: Record<string, any>,
  ): Record<string, any> {
    return omit(JSON.parse(stringify(unsanitizedData)), [
      E_SANITIZE.MONGO_VERSION,
      E_SANITIZE.USER_PASSWORD,
    ]);
  }
}

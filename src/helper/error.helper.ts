import { LoggerUtil } from '@utils';
import { Observable } from 'rxjs';
import { InternalServerErrorException } from '@nestjs/common';
import { I_FB_AUTH_ERROR } from '@interfaces';
import { E_ERROR_MESSAGE_MAP, E_ERROR_MESSAGE } from '@enums';

export class ErrorHelper {
  static catchError(error: I_FB_AUTH_ERROR): Observable<any> {
    LoggerUtil.logError(JSON.stringify(error));
    switch (error.code) {
      case 100:
        throw new InternalServerErrorException(
          E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_AUTH_CODE_EXPIRED_ERROR),
          E_ERROR_MESSAGE.FB_AUTH_CODE_EXPIRED_ERROR,
        );

      case 191:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_RIDERECT_URI_ERROR), E_ERROR_MESSAGE.FB_RIDERECT_URI_ERROR);

      default:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_OAUTH_ERROR), E_ERROR_MESSAGE.FB_OAUTH_ERROR);
    }
  }

  static catchFBError(error: I_FB_AUTH_ERROR): Observable<any> {
    LoggerUtil.logError(JSON.stringify(error));

    switch (error.code) {
      case 100:
        throw new InternalServerErrorException(
          E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_AUTH_CODE_EXPIRED_ERROR),
          E_ERROR_MESSAGE.FB_AUTH_CODE_EXPIRED_ERROR,
        );

      case 191:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_RIDERECT_URI_ERROR), E_ERROR_MESSAGE.FB_RIDERECT_URI_ERROR);

      case 197:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_EMPTY_POST_ERROR), E_ERROR_MESSAGE.FB_EMPTY_POST_ERROR);

      case 324:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_MEDIA_TOO_LARGE), E_ERROR_MESSAGE.FB_MEDIA_TOO_LARGE);

      case 368:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_TOO_MANY_REQUESTS), E_ERROR_MESSAGE.FB_TOO_MANY_REQUESTS);

      case 390:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_MEDIA_MISSING), E_ERROR_MESSAGE.FB_MEDIA_MISSING);

      case 506:
        throw new InternalServerErrorException(
          E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_DUPLICATE_MESSAGE_ERROR),
          E_ERROR_MESSAGE.FB_DUPLICATE_MESSAGE_ERROR,
        );

      default:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_OAUTH_ERROR), E_ERROR_MESSAGE.FB_OAUTH_ERROR);
    }
  }

  static catchFacebookError(error: I_FB_AUTH_ERROR): void {
    LoggerUtil.logError(JSON.stringify(error));

    switch (error.code) {
      case 100:
        throw new InternalServerErrorException(
          E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_AUTH_CODE_EXPIRED_ERROR),
          E_ERROR_MESSAGE.FB_AUTH_CODE_EXPIRED_ERROR,
        );

      case 191:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_RIDERECT_URI_ERROR), E_ERROR_MESSAGE.FB_RIDERECT_URI_ERROR);

      case 197:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_EMPTY_POST_ERROR), E_ERROR_MESSAGE.FB_EMPTY_POST_ERROR);

      case 324:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_MEDIA_TOO_LARGE), E_ERROR_MESSAGE.FB_MEDIA_TOO_LARGE);

      case 368:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_TOO_MANY_REQUESTS), E_ERROR_MESSAGE.FB_TOO_MANY_REQUESTS);

      case 390:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_MEDIA_MISSING), E_ERROR_MESSAGE.FB_MEDIA_MISSING);

      case 506:
        throw new InternalServerErrorException(
          E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_DUPLICATE_MESSAGE_ERROR),
          E_ERROR_MESSAGE.FB_DUPLICATE_MESSAGE_ERROR,
        );

      default:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_OAUTH_ERROR), E_ERROR_MESSAGE.FB_OAUTH_ERROR);
    }
  }
}

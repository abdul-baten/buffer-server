import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { E_ERROR_MESSAGE, E_ERROR_MESSAGE_MAP } from '@enums';
import { from, Observable } from 'rxjs';
import { I_MEDIA, I_USER } from '@interfaces';
import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { LoggerUtil, SanitizerUtil, TokenUtil } from '@utils';
import { MediaHelper } from '@helpers';
import { MediaMapper } from '@mappers';
import { MediaService } from '../service/media.service';

const filesize = require('filesize');

@Injectable()
export class MediaFacade {
  constructor(private readonly configService: ConfigService, private readonly mediaService: MediaService) {}

  verifyToken(authToken: string): Observable<Partial<I_USER>> {
    return from(TokenUtil.verifyUser(authToken, this.configService));
  }

  addMedia(authToken: string, postMedia: any): Observable<I_MEDIA> {
    const userID$ = this.verifyToken(authToken);

    const { filename: mediaName, mimetype: mediaMimeType, size } = postMedia;
    const mediaType = mediaMimeType.split('/')[0];
    const mediaURL = mediaName;
    const mediaSize = filesize(size, { base: 10 });

    return userID$.pipe(
      switchMap((userInfo: I_USER) => {
        const { _id: userID } = userInfo;
        return this.mediaService.addMedia({
          mediaType,
          mediaURL,
          mediaName,
          mediaMimeType,
          mediaSize,
          userID,
        });
      }),
      map((mediaInfo: I_MEDIA) => SanitizerUtil.sanitizedResponse(mediaInfo)),
      map((mediaInfo: I_MEDIA) => MediaMapper.addMediaResponseMapper(mediaInfo)),
      catchError((error) => {
        LoggerUtil.logError(error);
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.COULD_NOT_ADD_MEDIA), E_ERROR_MESSAGE.COULD_NOT_ADD_MEDIA);
      }),
    );
  }

  deleteMedia(deletedID: string): Observable<I_MEDIA> {
    return this.mediaService.deleteMedia(deletedID).pipe(
      tap((media: I_MEDIA) => {
        MediaHelper.deleteMediaFromStorage(media.mediaName);
      }),
      map((mediaInfo: I_MEDIA) => SanitizerUtil.sanitizedResponse(mediaInfo)),
      map((mediaInfo: I_MEDIA) => MediaMapper.addMediaResponseMapper(mediaInfo)),
      catchError(error => {
        LoggerUtil.logError(error);
        throw new UnprocessableEntityException(
          E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.COULD_NOT_DELETE_MEDIA),
          E_ERROR_MESSAGE.COULD_NOT_DELETE_MEDIA,
        );
      }),
    );
  }
}

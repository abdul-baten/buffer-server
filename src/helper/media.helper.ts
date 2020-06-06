import { configuration } from '@config';
import { from, Observable } from 'rxjs';
import { I_MEDIA } from '@interfaces';
import { MediaDTO } from '@dtos';
import { Model } from 'mongoose';
import { unlinkSync } from 'fs';

const UPLOAD_DIR = configuration.default.APP.UPLOAD_DIR;

export class MediaHelper {
  static addMedia(mediaModel: Model<I_MEDIA>, mediaInfo: MediaDTO | I_MEDIA): Observable<I_MEDIA> {
    const media = new mediaModel(mediaInfo),
      savedMedia$ = media.save();

    return from(savedMedia$);
  }

  static deleteMedia(mediaModel: Model<I_MEDIA>, _id: string): Observable<I_MEDIA> {
    return from(
      mediaModel
        .findOneAndDelete({ _id })
        .lean()
        .exec(),
    );
  }

  static deleteMediaFromStorage(mediaToDelete: string): void {
    const mediaDeletePath = `${UPLOAD_DIR}/${mediaToDelete}`;
    unlinkSync(mediaDeletePath);
  }
}

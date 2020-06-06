import { I_MEDIA } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { map } from 'rxjs/operators';
import { MediaDTO } from '@dtos';
import { MediaHelper } from '@helpers';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';

@Injectable()
export class MediaService {
  constructor(@InjectModel('Media') private readonly mediaModel: Model<I_MEDIA>) {}
  addMedia(mediaInfo: MediaDTO): Observable<I_MEDIA> {
    const savedFile$ = MediaHelper.addMedia(this.mediaModel, mediaInfo);

    return savedFile$.pipe(map((fileInfo: I_MEDIA) => fileInfo));
  }

  deleteMedia(deletedID: string): Observable<I_MEDIA> {
    return MediaHelper.deleteMedia(this.mediaModel, deletedID);
  }
}

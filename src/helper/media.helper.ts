import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { resolve } from 'bluebird';
import { unlinkSync } from 'fs';
import type { IMedia } from '@interfaces';
import type { MediaDto } from '@dtos';
import type { Model } from 'mongoose';

@Injectable()
export class MediaHelperService {
  constructor (private readonly configService: ConfigService) {}

  public async addMedia (model: Model<IMedia>, media_info: MediaDto | IMedia): Promise<IMedia> {
    const media_model = new model(media_info);
    const media = await media_model.save();

    return media;
  }

  public async deleteMedia (model: Model<IMedia>, media_id: string): Promise<IMedia> {
    const media = await model.
      findOneAndDelete({ _id: media_id }).
      lean().
      exec();

    await this.deleteMediaFromStorage(media?.media_name as string);

    return media as IMedia;
  }

  private async deleteMediaFromStorage (media_to_delete: string): Promise<void> {
    const media_dir = this.configService.get('APP.UPLOAD_DIR');
    const media_path = `${media_dir}/${media_to_delete}`;

    await resolve(unlinkSync(media_path));
  }
}

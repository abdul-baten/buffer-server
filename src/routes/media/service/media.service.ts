import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MediaHelperService } from '@helpers';
import { Model } from 'mongoose';
import type { IMedia } from '@interfaces';
import type { MediaDto } from '@dtos';

@Injectable()
export class MediaService {
  constructor (
    @InjectModel('Media') private readonly mediaModel: Model<IMedia>,
    private readonly mediaHelperService: MediaHelperService
  ) { }

  public async addMedia (media_info_dto: MediaDto): Promise<IMedia> {
    const media = await this.mediaHelperService.addMedia(this.mediaModel, media_info_dto);

    return media;
  }

  public async deleteMedia (media_id: string): Promise<IMedia> {
    const media = await this.mediaHelperService.deleteMedia(this.mediaModel, media_id);

    return media;
  }
}

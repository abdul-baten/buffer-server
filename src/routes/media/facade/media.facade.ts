import filesize from 'filesize';
import { ConfigService } from '@nestjs/config';
import { createWriteStream, statSync } from 'fs';
import { extname } from 'path';
import { Injectable } from '@nestjs/common';
import { MediaMapper } from '@mappers';
import { MediaService } from '../service/media.service';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { TokenService } from '@utils';
import type { IMedia, IUser } from '@interfaces';

const pump = promisify(pipeline);

@Injectable()
export class MediaFacade {
  constructor (
    private readonly configService: ConfigService,
    private readonly mediaService: MediaService,
    private readonly tokenService: TokenService
  ) {}

  public async verifyToken (auth_token: string): Promise<Partial<IUser>> {
    const user = await this.tokenService.jwtVerify(auth_token);

    return user;
  }

  private getFileName (media: string): string {
    const media_name = media.split('.')[0].toLowerCase();
    const media_ext = extname(media);
    const date = Date.now();

    return `${media_name}-${date}${media_ext}`;
  }

  public async addMedia (auth_token: string, post_media: { media_file: any; media_name: string; media_mime_type: string }): Promise<IMedia> {
    const media_dir = this.configService.get('APP.UPLOAD_DIR');
    const { media_file, media_name, media_mime_type } = post_media;
    const file_name = this.getFileName(media_name);
    const { _id: media_user_id } = await this.verifyToken(auth_token);

    await pump(media_file, createWriteStream(`${media_dir}/${file_name}`));

    const [media_type] = media_mime_type.split('/');
    const media_size = filesize(statSync(`${media_dir}/${file_name}`).size);
    const media_info = await this.mediaService.addMedia({
      media_mime_type,
      media_name: file_name,
      media_size,
      media_type,
      media_url: file_name,
      media_user_id
    });
    const added_media = MediaMapper.addMediaResponseMapper(media_info);

    return added_media;
  }

  public async deleteMedia (media_id: string): Promise<IMedia> {
    const deleted_media = await this.mediaService.deleteMedia(media_id);
    const media = MediaMapper.addMediaResponseMapper(deleted_media);

    return media;
  }
}

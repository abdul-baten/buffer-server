import { AuthGuard } from '@guards';
import {
  Controller,
  Delete,
  HttpStatus,
  Post,
  Query,
  Req,
  Response,
  UseGuards
} from '@nestjs/common';
import { MediaFacade } from '../facade/media.facade';
import { parse } from 'cookie';
import type { FastifyReply } from 'fastify';

@Controller('')
export class MediaController {
  constructor (private readonly mediaFacade: MediaFacade) {}

  @Post('add')
  @UseGuards(AuthGuard)
  public async addMedia (@Req() request: any, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const { auth_token } = parse(request.headers.cookie as string);
    const { file, filename, mimetype } = await request.file();
    const media_info = {
      media_file: file,
      media_mime_type: mimetype,
      media_name: filename
    };
    const media = await this.mediaFacade.addMedia(auth_token, media_info);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.CREATED).
      type('application/json').
      send(media);
  }

  @Delete('delete')
  @UseGuards(AuthGuard)
  public async deleteMedia (@Query('media_id') media_id: string, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const deleted_media_id = await this.mediaFacade.deleteMedia(media_id);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(deleted_media_id);
  }
}

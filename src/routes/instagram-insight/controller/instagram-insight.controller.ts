import { AuthGuard } from '@guards';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Response,
  UseGuards
} from '@nestjs/common';
import { FbInsightDto } from '@dtos';
import { InstagramInsightFacade } from '../facade/instagram-insight.facade';
import type { FastifyReply } from 'fastify';

@Controller('')
export class InstagramInsightController {
  constructor (private readonly facade: InstagramInsightFacade) {}

  @Post('')
  @UseGuards(AuthGuard)
  public async instagramInstagramInsight (@Body() payload: FbInsightDto, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const instagram_insight = await this.facade.instagramInstagramInsight(payload);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(instagram_insight);
  }
}

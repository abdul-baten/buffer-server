import { AuthGuard } from '@guards';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Response,
  UseGuards
} from '@nestjs/common';
import { FacebookInsightFacade } from '../facade/facebook-insight.facade';
import { FbInsightDto } from '@dtos';
import type { FastifyReply } from 'fastify';
import type { IFbOverviewInsight, IFbPostInsight, IFbVideoInsight, IFbPerformanceInsight } from '@interfaces';

@Controller('')
export class FacebookInsightController {
  constructor (private readonly facade: FacebookInsightFacade) {}

  @Post('overview')
  @UseGuards(AuthGuard)
  public async overview (@Body() payload: FbInsightDto, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const overview_insight: Partial<IFbOverviewInsight> = await this.facade.overview(payload);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(overview_insight);
  }

  @Post('posts')
  @UseGuards(AuthGuard)
  public async posts (@Body() payload: FbInsightDto, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const posts_insight: Partial<IFbPostInsight> = await this.facade.posts(payload);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(posts_insight);
  }

  @Post('videos')
  @UseGuards(AuthGuard)
  public async videos (@Body() payload: FbInsightDto, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const videos_insight: Partial<IFbVideoInsight> = await this.facade.videos(payload);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(videos_insight);
  }

  @Post('performance')
  @UseGuards(AuthGuard)
  public async performance (@Body() payload: FbInsightDto, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const performance_insight: Partial<IFbPerformanceInsight> = await this.facade.performance(payload);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(performance_insight);
  }
}

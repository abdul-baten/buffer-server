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
import { InsightFacade } from '../facade/insight.facade';
import type { FastifyReply } from 'fastify';
import type { IFbOverviewInsight, IFbPostInsight, IFbVideoInsight, IFbPerformanceInsight } from '@interfaces';

@Controller('')
export class InsightController {
  constructor (private readonly facade: InsightFacade) {}

  @Post('facebook/overview')
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

  @Post('facebook/posts')
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

  @Post('facebook/videos')
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

  @Post('facebook/performance')
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

  @Post('instagram')
  @UseGuards(AuthGuard)
  public async instagramInsight (@Body() payload: FbInsightDto, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const instagram_insight = await this.facade.instagramInsight(payload);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(instagram_insight);
  }
}

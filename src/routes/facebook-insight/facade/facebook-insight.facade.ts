import { FacebookInsightMapper } from '@mappers';
import { FacebookInsightService } from '../service/facebook-insight.service';
import { Injectable } from '@nestjs/common';
import type { FbInsightDto } from '@dtos';
import type { IFbOverviewInsight, IFbPerformanceInsight, IFbPostInsight, IFbVideoInsight } from '@interfaces';

@Injectable()
export class FacebookInsightFacade {
  constructor (private readonly facebookInsightService: FacebookInsightService) { }

  public async overview (payload: FbInsightDto): Promise<Partial<IFbOverviewInsight>> {
    const overview = await this.facebookInsightService.overview<IFbOverviewInsight>(payload);
    const insight_response = FacebookInsightMapper.overview<IFbOverviewInsight>(overview);

    return insight_response;
  }

  public async posts (payload: FbInsightDto): Promise<Partial<IFbPostInsight>> {
    const posts = await this.facebookInsightService.posts<IFbPostInsight>(payload);
    const insight_response = FacebookInsightMapper.posts<IFbPostInsight>(posts);

    return insight_response;
  }

  public async videos (payload: FbInsightDto): Promise<Partial<IFbVideoInsight>> {
    const videos = await this.facebookInsightService.videos<IFbVideoInsight>(payload);
    const insight_response = FacebookInsightMapper.videos<IFbVideoInsight>(videos);

    return insight_response;
  }

  public async performance (payload: FbInsightDto): Promise<Partial<IFbPerformanceInsight>> {
    const performance = await this.facebookInsightService.performance<IFbPerformanceInsight>(payload);
    const insight_response = FacebookInsightMapper.performance<IFbPerformanceInsight>(performance);

    return insight_response;
  }
}

import { Injectable } from '@nestjs/common';
import { InsightService } from '../service/insight.service';
import type { FbInsightDto } from '@dtos';
import type { IFbOverviewInsight, IFbPerformanceInsight, IFbPostInsight, IFbVideoInsight } from '@interfaces';

@Injectable()
export class InsightFacade {
  constructor (private readonly service: InsightService) {}

  public async overview (payload: FbInsightDto): Promise<Partial<IFbOverviewInsight>> {
    const overview = await this.service.overview(payload);

    return overview;
  }

  public async posts (payload: FbInsightDto): Promise<Partial<IFbPostInsight>> {
    const posts = await this.service.posts(payload);

    return posts;
  }

  public async videos (payload: FbInsightDto): Promise<Partial<IFbVideoInsight>> {
    const videos = await this.service.videos(payload);

    return videos;
  }

  public async performance (payload: FbInsightDto): Promise<Partial<IFbPerformanceInsight>> {
    const performance = await this.service.performance(payload);

    return performance;
  }

  public async instagramInsight (payload: FbInsightDto): Promise<any> {
    const insight = await this.service.instagramInsight(payload);

    insight.id = payload.id;

    return insight;
  }
}

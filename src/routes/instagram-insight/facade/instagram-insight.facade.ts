import { IInstaInsight } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { InstagramInsightService } from '../service/instagram-insight.service';
import type { FbInsightDto } from '@dtos';

@Injectable()
export class InstagramInsightFacade {
  constructor (private readonly service: InstagramInsightService) {}

  public async instagramInstagramInsight (payload: FbInsightDto): Promise<Partial<IInstaInsight>> {
    const insight = await this.service.instagramInsight(payload);

    insight.id = payload.id;

    return insight;
  }
}

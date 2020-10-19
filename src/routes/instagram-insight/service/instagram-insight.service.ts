import { ConnectionHelperService, InstagramInsightHelperService } from '@helpers';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { FbInsightDto } from '@dtos';
import type { IConnection, IInstaInsight } from '@interfaces';

// eslint-disable-next-line @typescript-eslint/no-var-requires

@Injectable()
export class InstagramInsightService {
  // eslint-disable-next-line max-params
  constructor (
    @InjectModel('Connection')
    private readonly connectionModel: Model<IConnection>,
    private readonly connectionHelperService: ConnectionHelperService,
    private readonly insightHelperService: InstagramInsightHelperService
  ) { }

  public async getConnectionByID (connection_id: string): Promise<IConnection> {
    const connection = await this.connectionHelperService.getConnectionByID(this.connectionModel, connection_id);

    return connection;
  }

  public async instagramInsight (payload: FbInsightDto): Promise<Partial<IInstaInsight>> {
    const { id, user_id, since, until } = payload;
    const { connection_id, connection_token, connection_user_id } = await this.getConnectionByID(id);

    if (user_id !== connection_user_id) {
      throw new Error();
    }

    const insight = await this.insightHelperService.getInstagramInsight(connection_id, connection_token, since, until);

    return insight;
  }
}

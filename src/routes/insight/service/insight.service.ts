import { CommonUtil } from '@utils';
import { ConnectionHelperService, InsightHelperService, RedisHelperService } from '@helpers';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from 'nestjs-redis';

import type { FbInsightDto } from '@dtos';
import type { IConnection, IFbOverviewInsight, IFbPerformanceInsight, IFbPostInsight, IFbVideoInsight, IInstaInsight } from '@interfaces';

@Injectable()
export class InsightService {
  // eslint-disable-next-line max-params
  constructor (
    @InjectModel('Connection')
    private readonly connectionModel: Model<IConnection>,
    private readonly redisService: RedisService,
    private readonly connectionHelperService: ConnectionHelperService,
    private readonly insightHelperService: InsightHelperService,
    private readonly redisHelperService: RedisHelperService
  ) {}

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

  public async overview (payload: FbInsightDto): Promise<Partial<IFbOverviewInsight>> {
    const { id: mongo_id, user_id, since, until } = payload,
      redis_key = `${InsightService.name}:${mongo_id}:overview:${since}/${until}`,
      redis_response = await this.redisHelperService.getData(this.redisService, redis_key);

    if (redis_response) {
      const parse_json = CommonUtil.parseJson(),
        response = await parse_json(redis_response);

      return response;
    }

    const { connection_id, connection_token } = await this.connectionHelperService.getConnectionByIDAndUser(this.connectionModel, mongo_id, user_id),
      response = await this.insightHelperService.overview(mongo_id, connection_id, connection_token, since, until),
      stringify = await CommonUtil.stringifyJson();

    await this.redisHelperService.setData(this.redisService, redis_key, await stringify(response));

    return response;
  }

  public async posts (payload: FbInsightDto): Promise<Partial<IFbPostInsight>> {
    const { id: mongo_id, user_id, since, until } = payload,
      redis_key = `${InsightService.name}:${mongo_id}:posts:${since}/${until}`,
      redis_response = await this.redisHelperService.getData(this.redisService, redis_key);

    if (redis_response) {
      const parse_json = CommonUtil.parseJson(),
        response = await parse_json(redis_response);

      return response;
    }

    const { connection_id, connection_token } = await this.connectionHelperService.getConnectionByIDAndUser(this.connectionModel, mongo_id, user_id),
      response = await this.insightHelperService.posts(mongo_id, connection_id, connection_token, since, until),
      stringify = await CommonUtil.stringifyJson();

    await this.redisHelperService.setData(this.redisService, redis_key, await stringify(response));

    return response;
  }

  public async videos (payload: FbInsightDto): Promise<Partial<IFbVideoInsight>> {
    const { id: mongo_id, user_id, since, until } = payload,
      redis_key = `${InsightService.name}:${mongo_id}:videos:${since}/${until}`,
      redis_response = await this.redisHelperService.getData(this.redisService, redis_key);

    if (redis_response) {
      const parse_json = CommonUtil.parseJson(),
        response = await parse_json(redis_response);

      return response;
    }

    const { connection_id, connection_token } = await this.connectionHelperService.getConnectionByIDAndUser(this.connectionModel, mongo_id, user_id),
      response = await this.insightHelperService.videos(mongo_id, connection_id, connection_token, since, until),
      stringify = await CommonUtil.stringifyJson();

    await this.redisHelperService.setData(this.redisService, redis_key, await stringify(response));

    return response;
  }

  public async performance (payload: FbInsightDto): Promise<Partial<IFbPerformanceInsight>> {
    const { id: mongo_id, user_id, since, until } = payload,
      redis_key = `${InsightService.name}:${mongo_id}:performance:${since}/${until}`,
      redis_response = await this.redisHelperService.getData(this.redisService, redis_key);

    if (redis_response) {
      const parse_json = CommonUtil.parseJson(),
        response = await parse_json(redis_response);

      return response;
    }

    const { connection_id, connection_token } = await this.connectionHelperService.getConnectionByIDAndUser(this.connectionModel, mongo_id, user_id),
      response = await this.insightHelperService.performance(mongo_id, connection_id, connection_token, since, until),
      stringify = CommonUtil.stringifyJson();

    await this.redisHelperService.setData(this.redisService, redis_key, await stringify(response));

    return response;
  }
}

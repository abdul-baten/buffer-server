import safeJsonStringify from 'safe-json-stringify';
import to from 'await-to-js';
import { ConnectionErrorCodes, GeneralErrorCodes } from '@errors';
import { ConnectionHelperService, FacebookInsightHelperService, RedisHelperService } from '@helpers';
import { Document, Model } from 'mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RedisService } from 'nestjs-redis';
import type { FbInsightDto } from '@dtos';
import type { IConnection, IFbOverviewInsight, IFbPerformanceInsight, IFbPostInsight, IFbVideoInsight, IInsightFromDbPayload } from '@interfaces';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Parse = require('fast-json-parse');

@Injectable()
export class FacebookInsightService {
  // eslint-disable-next-line max-params
  constructor (
    @InjectModel('Connection')
    private readonly connectionModel: Model<IConnection>,
    @InjectModel('Facebook_Overview_Insight')
    private readonly overviewModel: Model<IFbOverviewInsight>,
    @InjectModel('Facebook_Performance_Insight')
    private readonly performanceModel: Model<IFbPerformanceInsight>,
    @InjectModel('Facebook_Post_Insight')
    private readonly postModel: Model<IFbPostInsight>,
    @InjectModel('Facebook_Video_Insight')
    private readonly videoModel: Model<IFbVideoInsight>,
    private readonly redisService: RedisService,
    private readonly connectionHelperService: ConnectionHelperService,
    private readonly facebookInsightHelperService: FacebookInsightHelperService,
    private readonly redisHelperService: RedisHelperService
  ) { }

  private async getInsightFromDB<T extends Document> (insight_payload: IInsightFromDbPayload, store_key: string, model: Model<T>): Promise<T> {
    const [error, insight_from_db] = await to(this.facebookInsightHelperService.getInsight(model, {
      ...insight_payload
    }));

    if (error) {
      throw new InternalServerErrorException({
        ...GeneralErrorCodes.SOMETHING_WENT_WRONG,
        error_details: error
      });
    }

    await this.redisHelperService.setData(this.redisService, store_key, safeJsonStringify(Object(insight_from_db)));

    return insight_from_db as unknown as T;
  }

  private async getConnectionByIDAndUser (insight_connection_id: string, insight_user_id: string): Promise<IConnection> {
    const [error, connection] = await to(this.connectionHelperService.getConnectionByIDAndUser(this.connectionModel, insight_connection_id, insight_user_id));

    if (error) {
      throw new InternalServerErrorException({
        ...ConnectionErrorCodes.COULD_NOT_FOUND,
        error_details: error
      });
    }

    return connection as IConnection;
  }

  private async getRequests (insight_payload: {
    connection_id: string, connection_token: string, insight_since: string, insight_until: string
  }, insight_type: string) {
    let error,
      insight;
    const { connection_id, connection_token, insight_since, insight_until } = insight_payload;

    switch (insight_type) {
    case 'performance':
      [error, insight] = await to(this.facebookInsightHelperService.performance(connection_id, connection_token, insight_since, insight_until));

      return [error, insight];
    case 'posts':
      [error, insight] = await to(this.facebookInsightHelperService.posts(connection_id, connection_token, insight_since, insight_until));

      return [error, insight];
    case 'videos':
      [error, insight] = await to(this.facebookInsightHelperService.videos(connection_id, connection_token, insight_since, insight_until));

      return [error, insight];

    default:
      [error, insight] = await to(this.facebookInsightHelperService.overview(connection_id, connection_token, insight_since, insight_until));

      return [error, insight];
    }
  }

  private async getInsightFromRequest<T extends Document> (insight_payload: IInsightFromDbPayload, store_key: string, model: Model<T>, insight_type: any): Promise<T> {
    let error,
      insight;
    const { insight_connection_id, insight_since, insight_until, insight_user_id } = insight_payload;
    const connection = await this.getConnectionByIDAndUser(insight_connection_id, insight_user_id);
    const { connection_id, connection_token } = connection;

    [error, insight] = await this.getRequests({ connection_id,
      connection_token,
      insight_since,
      insight_until }, insight_type);

    if (error) {
      throw new InternalServerErrorException({
        ...ConnectionErrorCodes.COULD_NOT_FOUND,
        error_details: error
      });
    }

    const insight_from_request = {
      ...insight,
      insight_connection_id,
      insight_since,
      insight_until,
      insight_user_id
    };

    await this.setOverviewInsightToDB<T>(insight_from_request as unknown as T, model);

    [error] = await to(this.redisHelperService.setData(this.redisService, store_key, safeJsonStringify(insight_from_request)));
    if (error) {
      throw new InternalServerErrorException({
        ...ConnectionErrorCodes.COULD_NOT_ADD,
        error_details: error
      });
    }

    return insight as unknown as T;
  }

  private async setOverviewInsightToDB<T extends Document> (payload: T, model: Model<T>): Promise<T> {
    const [error, ins_from_db] = await to(this.facebookInsightHelperService.setPerformanceInsight(model, payload));

    if (error) {
      throw new InternalServerErrorException({
        ...GeneralErrorCodes.SOMETHING_WENT_WRONG,
        error_details: error
      });
    }

    return ins_from_db as unknown as T;
  }

  private async getDataFromStore<T> (store_key: string): Promise<T> {
    const data_from_store = await this.redisHelperService.getData(this.redisService, store_key);
    const { err, value } = Parse(data_from_store);

    if (err) {
      throw new InternalServerErrorException({
        ...GeneralErrorCodes.SOMETHING_WENT_WRONG,
        error_details: err
      });
    }

    return value as T;
  }

  private async getInsight<T extends Document> (payload: FbInsightDto, insight_type: string, model: Model<T>): Promise<T> {
    const { id: mongo_connection_id, user_id: connection_user_id, since, until } = payload;
    const store_key = `${FacebookInsightService.name}:${mongo_connection_id}:${insight_type}:${since}/${until}`;
    const data_from_store = await this.getDataFromStore<T>(store_key);

    if (data_from_store && Object.entries(data_from_store).length !== 0) {
      return data_from_store;
    }

    const insight_from_db = await this.getInsightFromDB<T>({
      insight_connection_id: mongo_connection_id,
      insight_since: since,
      insight_until: until,
      insight_user_id: connection_user_id
    }, store_key, model);

    if (insight_from_db && Object.entries(insight_from_db).length !== 0) {
      return insight_from_db;
    }

    const insight_from_request = await this.getInsightFromRequest<T>({
      insight_connection_id: mongo_connection_id,
      insight_since: since,
      insight_until: until,
      insight_user_id: connection_user_id
    }, store_key, model, insight_type);

    return insight_from_request;
  }

  public async overview<T> (payload: FbInsightDto): Promise<T> {
    const [error, overview_insight] = await to(this.getInsight(payload, 'overview', this.overviewModel));

    if (error) {
      throw new InternalServerErrorException({
        ...GeneralErrorCodes.SOMETHING_WENT_WRONG,
        error_details: error
      });
    }

    return overview_insight as unknown as T;
  }

  public async performance<T> (payload: FbInsightDto): Promise<T> {
    const [error, performance_insight] = await to(this.getInsight(payload, 'performance', this.performanceModel));

    if (error) {
      throw new InternalServerErrorException({
        ...GeneralErrorCodes.SOMETHING_WENT_WRONG,
        error_message: error
      });
    }

    return performance_insight as unknown as T;
  }

  public async posts<T> (payload: FbInsightDto): Promise<T> {
    const [error, performance_insight] = await to(this.getInsight(payload, 'posts', this.postModel));

    if (error) {
      throw new InternalServerErrorException({
        ...GeneralErrorCodes.SOMETHING_WENT_WRONG,
        error_details: error
      });
    }

    return performance_insight as unknown as T;
  }

  public async videos<T> (payload: FbInsightDto): Promise<T> {
    const [error, performance_insight] = await to(this.getInsight(payload, 'videos', this.videoModel));

    if (error) {
      throw new InternalServerErrorException({
        ...GeneralErrorCodes.SOMETHING_WENT_WRONG,
        error_details: error
      });
    }

    return performance_insight as unknown as T;
  }
}

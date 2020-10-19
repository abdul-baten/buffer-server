import safeJsonStringify from 'safe-json-stringify';
import to from 'await-to-js';
import { CommonUtil } from '@utils';
import { ConnectionErrorCodes } from '@errors';
import { ConnectionHelperService, RedisHelperService } from '@helpers';
import { ConnectionMapper } from '@mappers';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from 'nestjs-redis';
import { resolve } from 'bluebird';
import type { AddConnectionDto } from '@dtos';
import type { IConnection } from '@interfaces';

@Injectable()
export class ConnectionService {
  constructor (
    @InjectModel('Connection') private readonly connectionModel: Model<IConnection>,
    private readonly connectionHelperService:ConnectionHelperService,
    private readonly redisHelperService: RedisHelperService,
    private readonly redisService: RedisService
  ) { }

  private async response (redis_response: string[]): Promise<IConnection[]> {
    const redis_data = [];
    const parse_json = CommonUtil.parseJson();
    const redis_response_length = redis_response.length;

    for (let index = 0; index < redis_response_length; index += 1) {
      redis_data.push(parse_json(redis_response[index]));
    }

    const response = await Promise.all(redis_data);

    return response;
  }

  public async getConnections (connection_user_id: string): Promise<IConnection[]> {
    let connections,
      error,
      redis_response;
    const redis_key = `${ConnectionService.name}:${connection_user_id}`;

    [error, redis_response] = await to(this.redisHelperService.getDataList(this.redisService, redis_key));
    if (error) {
      throw new NotFoundException({
        ...ConnectionErrorCodes.COULD_NOT_FOUND,
        error_details: error
      });
    }

    // eslint-disable-next-line no-extra-parens
    if ((redis_response as string[]).length) {
      return this.response(redis_response as string[]);
    }

    [error, connections] = await to(this.connectionHelperService.getConnectionsByUserID(this.connectionModel, connection_user_id));
    if (error) {
      throw new NotFoundException({
        ...ConnectionErrorCodes.COULD_NOT_FOUND,
        error_details: error
      });
    }

    [error] = await to(this.redisHelperService.setDataList(this.redisService, redis_key, connections as IConnection[]));
    if (error) {
      throw new InternalServerErrorException({
        ...ConnectionErrorCodes.COULD_NOT_FOUND,
        error_details: error });
    }

    return connections as IConnection[];
  }

  public async addConnection (connection_dto: AddConnectionDto): Promise<IConnection> {
    let error,
      connection;
    const { connection_user_id } = connection_dto;
    const redis_key = `${ConnectionService.name}:${connection_user_id}`;

    [error, connection] = await to(this.connectionHelperService.addConnection(this.connectionModel, connection_dto as IConnection));
    if (error) {
      throw new InternalServerErrorException({
        ...ConnectionErrorCodes.COULD_NOT_ADD,
        error_details: error });
    }

    [error] = await to(this.redisHelperService.setDataList(this.redisService, redis_key, [ConnectionMapper.addStoreResponseMapper(connection as IConnection)]));
    if (error) {
      throw new InternalServerErrorException({
        ...ConnectionErrorCodes.COULD_NOT_ADD,
        error_details: error });
    }

    return connection as IConnection;
  }

  public async deleteConnection (mongo_connection_id: string, connection_user_id: string): Promise<IConnection> {
    let error,
      connection;

    const redis_key = `${ConnectionService.name}:${connection_user_id}`;

    [error, connection] = await to(this.connectionHelperService.deleteConnection(this.connectionModel, mongo_connection_id, connection_user_id));
    if (error) {
      throw new InternalServerErrorException({
        ...ConnectionErrorCodes.COULD_NOT_DELETE,
        error_details: error });
    }

    const assigned_connection = { ...connection };

    // eslint-disable-next-line no-underscore-dangle
    Object.assign(assigned_connection, { id: connection?._id });
    const conn = await resolve(safeJsonStringify(ConnectionMapper.addStoreResponseMapper(assigned_connection as IConnection) as IConnection));

    [error] = await to(this.redisHelperService.deleteItemFromList(this.redisService, redis_key, conn));
    if (error) {
      throw new InternalServerErrorException({ ...ConnectionErrorCodes.COULD_NOT_DELETE,
        error_details: error });
    }

    return connection as IConnection;
  }
}

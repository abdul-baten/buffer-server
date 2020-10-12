import to from 'await-to-js';
import { ConnectionErrorCodes } from '@errors';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { IConnection } from '@interfaces';
import type { Model } from 'mongoose';

@Injectable()
export class ConnectionHelperService {
  public async getConnectionByID (model: Model<IConnection>, mongo_connection_id: string): Promise<IConnection> {
    const [error, connection] = await to(model.findOne({ _id: mongo_connection_id }).select('-__v').
      lean(true).
      exec());

    if (error) {
      throw new Error(error.message);
    }

    if (!connection) {
      throw new NotFoundException(ConnectionErrorCodes.COULD_NOT_FOUND);
    }

    return connection as IConnection;
  }

  public async getConnectionsByUserID (model: Model<IConnection>, connection_user_id: string): Promise<IConnection[]> {
    const [error, connections] = await to<IConnection[]>(model.
      find({ connection_user_id }).
      select('-connection_token -__v').
      exec());

    if (error) {
      throw new Error(error.message);
    }

    return connections as IConnection[];
  }

  public async getConnectionByIDAndUser (model: Model<IConnection>, mongo_connection_id: string, connection_user_id: string): Promise<IConnection> {
    const [error, connection] = await to(model.
      findOne({
        _id: mongo_connection_id,
        connection_user_id
      }).
      select('-connection_token -__v').
      lean(true).
      exec());

    if (error) {
      throw new Error(error.message);
    }

    if (!connection) {
      throw new NotFoundException(ConnectionErrorCodes.COULD_NOT_FOUND);
    }

    return connection as IConnection;
  }

  public async addConnection (model: Model<IConnection>, connection_to_add: IConnection): Promise<IConnection> {
    const [error, added_connection] = await to(new model(connection_to_add).save());

    if (error) {
      throw new Error(error.message);
    }

    return added_connection as IConnection;
  }

  public async deleteConnection (model: Model<IConnection>, mongo_connection_id: string, connection_user_id: string): Promise<IConnection> {
    let error,
      connection;

    [error, connection] = await to(model.
      findOne({
        _id: mongo_connection_id,
        connection_user_id
      }).
      select('-__v').
      lean(true).
      exec());

    if (error) {
      throw new Error(error.message);
    }

    [error] = await to(model.deleteOne({
      _id: mongo_connection_id,
      connection_user_id
    }).exec());
    if (error) {
      throw new Error(error.message);
    }

    return connection as IConnection;
  }
}

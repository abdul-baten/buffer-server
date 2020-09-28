import { from, Observable } from 'rxjs';
import { I_CONNECTION } from '@interfaces';
import { Model } from 'mongoose';

export class ConnectionHelper {
  //todo: replace this method with getConnectionsByID
  static getConnectionByID(connectionModel: Model<I_CONNECTION>, _id: string): Observable<I_CONNECTION> {
    const connection = connectionModel
      .findOne({ _id })
      .lean(true)
      .exec();

    return from(connection || {});
  }

  static async getConnectionsByID(connectionModel: Model<I_CONNECTION>, _id: string): Promise<I_CONNECTION> {
    try {
      const connection = await connectionModel.findOne({ _id }).lean();
      if (!connection) {
        throw new Error('no document found');
      }
      return connection;
    } catch (error) {
      return error;
    }
  }

  static getConnectionsByUserID(connectionModel: Model<I_CONNECTION>, connectionUserID: string): Observable<I_CONNECTION[]> {
    const connections = connectionModel
      .find({ connectionUserID })
      .lean(true)
      .exec();

    return from(connections);
  }

  static addConnection(connectionModel: Model<I_CONNECTION>, connection: I_CONNECTION): Observable<I_CONNECTION> {
    const addedConnection = new connectionModel(connection);
    return from(addedConnection.save());
  }

  static deleteConnection(connectionModel: Model<I_CONNECTION>, _id: string): Observable<I_CONNECTION> {
    const deletedConnection = connectionModel
      .findByIdAndDelete({ _id })
      .lean(true)
      .exec();

    return from(deletedConnection);
  }
}

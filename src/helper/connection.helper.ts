import { from, Observable } from 'rxjs';
import { I_CONNECTION } from '@interfaces';
import { Model } from 'mongoose';

export class ConnectionHelper {
  static getConnectionByID(connectionModel: Model<I_CONNECTION>, _id: string): Observable<I_CONNECTION> {
    const connection = connectionModel
      .findOne({ _id })
      .lean(true)
      .exec();

    return from(connection);
  }

  static getConnectionsByUserID(connectionModel: Model<I_CONNECTION>, connectionUserID: string): Observable<I_CONNECTION[]> {
    const connections = connectionModel
      .find({ connectionUserID })
      .lean(true)
      .exec();

    return from(connections);
  }

  static deleteConnection(connectionModel: Model<I_CONNECTION>, _id: string): Observable<I_CONNECTION> {
    const deletedConnection = connectionModel
      .findByIdAndDelete({ _id })
      .lean(true)
      .exec();

    return from(deletedConnection);
  }
}

import { from, Observable } from 'rxjs';
import { I_CONNECTION } from '@interfaces';
import { Model } from 'mongoose';

export class ConnectionHelper {
  static getConnectionByID(connectionModel: Model<I_CONNECTION>, _id: string): Observable<I_CONNECTION> {
    const connections = connectionModel
      .findOne({ _id })
      .lean()
      .exec();

    return from(connections);
  }
}

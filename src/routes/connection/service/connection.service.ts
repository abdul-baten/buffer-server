import { ConnectionHelper } from '@helpers';
import { I_CONNECTION } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectModel('Connection')
    private readonly connectionModel: Model<I_CONNECTION>,
  ) {}

  getConnections(userID: string): Observable<I_CONNECTION[]> {
    const connections$ = ConnectionHelper.getConnectionsByUserID(this.connectionModel, userID);
    return connections$;
  }

  deleteConnection(deletedID: string): Observable<I_CONNECTION> {
    const deletedConnection$ = ConnectionHelper.deleteConnection(this.connectionModel, deletedID);
    return deletedConnection$;
  }
}

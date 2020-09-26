import { catchError, switchMap } from 'rxjs/operators';
import { ConnectionHelper, ErrorHelper, InsightHelper } from '@helpers';
import { FBInsightDTO } from '@dtos';
import { I_CONNECTION, I_INS_FB } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';

@Injectable()
export class InsightService {
  constructor(
    @InjectModel('Connection')
    private readonly connectionModel: Model<I_CONNECTION>,
  ) {}

  getConnectionByID(id: string): Observable<I_CONNECTION> {
    const connection$ = ConnectionHelper.getConnectionByID(this.connectionModel, id);
    return connection$;
  }

  fbInsight(payload: FBInsightDTO): Observable<Partial<I_INS_FB>> {
    const { id, userID, since, until } = payload;
    return this.getConnectionByID(id).pipe(
      switchMap((connection: I_CONNECTION) => {
        const { connectionID, connectionToken, connectionUserID } = connection;

        if (userID == connectionUserID) {
          return InsightHelper.getFacebookInsight(connectionID, connectionToken, since, until);
        } else {
          throw new Error();
        }
      }),
      catchError(error => {
        return ErrorHelper.catchError(error);
      }),
    );
  }

  instagramInsight(payload: FBInsightDTO): Observable<Partial<I_INS_FB>> {
    const { id, userID, since, until } = payload;
    return this.getConnectionByID(id).pipe(
      switchMap((connection: I_CONNECTION) => {
        const { connectionID, connectionToken, connectionUserID } = connection;

        if (userID == connectionUserID) {
          return InsightHelper.getInstagramInsight(connectionID, connectionToken, since, until);
        } else {
          throw new Error();
        }
      }),
      catchError(error => {
        return ErrorHelper.catchError(error);
      }),
    );
  }
}

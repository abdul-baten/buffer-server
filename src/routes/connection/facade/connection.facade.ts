import { catchError, map } from 'rxjs/operators';
import { ConnectionMapper } from '@mappers';
import { ConnectionService } from '../service/connection.service';
import { E_ERROR_MESSAGE, E_ERROR_MESSAGE_MAP } from '@enums';
import { I_CONNECTION } from '@interfaces';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SanitizerUtil } from '@utils';

@Injectable()
export class ConnectionFacade {
  constructor(private readonly connectionService: ConnectionService) {}

  getConnections(userID: string): Observable<I_CONNECTION[]> {
    return this.connectionService.getConnections(userID).pipe(
      map((connections: I_CONNECTION[]) => {
        return connections.map((connection: I_CONNECTION) => SanitizerUtil.sanitizedResponse(connection));
      }),
      map((connections: I_CONNECTION[]) => {
        return connections.map((connection: I_CONNECTION) => ConnectionMapper.connectionsResponseMapper(connection));
      }),
      map((connections: I_CONNECTION[]) => connections),
      catchError(error => {
        throw new InternalServerErrorException(error);
      }),
    );
  }

  deleteConnection(deletedID: string): Observable<I_CONNECTION> {
    return this.connectionService.deleteConnection(deletedID).pipe(
      map((connection: I_CONNECTION) => SanitizerUtil.sanitizedResponse(connection)),
      map((connection: I_CONNECTION) => {
        return ConnectionMapper.connectionsResponseMapper(connection);
      }),
      map((connection: I_CONNECTION) => connection),
      catchError(() => {
        throw new InternalServerErrorException(
          E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.CONNECTION_DELETE_ERROR),
          E_ERROR_MESSAGE.CONNECTION_DELETE_ERROR,
        );
      }),
    );
  }
}

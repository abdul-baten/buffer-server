import { ConnectionMapper } from '@mappers';
import { ConnectionService } from '../service/connection.service';
import { Injectable } from '@nestjs/common';
import type { AddConnectionDto } from '@dtos';
import type { IConnection } from '@interfaces';

@Injectable()
export class ConnectionFacade {
  constructor (private readonly connectionService: ConnectionService) {}

  public async getConnections (user_id: string): Promise<IConnection[]> {
    const connections: IConnection[] = await this.connectionService.getConnections(user_id);
    const connections_length: number = connections.length;
    const response: IConnection[] = [];

    for (let index = 0; index < connections_length; index += 1) {
      response.push(ConnectionMapper.connectionsResponseMapper(connections[index]));
    }

    return response;
  }

  public async addConnection (add_connection_dto: AddConnectionDto): Promise<IConnection> {
    const added_connection: IConnection = await this.connectionService.addConnection(add_connection_dto);
    const response: IConnection = ConnectionMapper.connectionsResponseMapper(added_connection);

    return response;
  }

  public async deleteConnection (connection_id: string, connection_user_id: string): Promise<IConnection> {
    const deleted_connection: IConnection = await this.connectionService.deleteConnection(connection_id, connection_user_id);
    const response: IConnection = ConnectionMapper.connectionsResponseMapper(deleted_connection);

    return response;
  }
}

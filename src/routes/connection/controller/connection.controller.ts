import { AddConnectionDto } from '@dtos';
import { AuthGuard } from '@guards';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Response,
  UseGuards
} from '@nestjs/common';
import { ConnectionFacade } from '../facade/connection.facade';
import type { FastifyReply } from 'fastify';
import type { IConnection } from '@interfaces';

@Controller('')
export class ConnectionController {
  constructor (private readonly facade: ConnectionFacade) {}

  @Get(':connection_user_id')
  @UseGuards(AuthGuard)
  public async getConnections (@Param('connection_user_id') connection_user_id: string, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const connections: IConnection[] = await this.facade.getConnections(connection_user_id);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(connections);
  }

  @Post('')
  @UseGuards(AuthGuard)
  public async addFBPage (@Body() connection_dto: AddConnectionDto, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const connection: IConnection = await this.facade.addConnection(connection_dto);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.CREATED).
      type('application/json').
      send(connection);
  }

  @Delete(':connection_id/:connection_user_id')
  @UseGuards(AuthGuard)
  public async deleteConnection (
    @Param('connection_id') connection_id: string,
    @Param('connection_user_id') connection_user_id: string,
    @Response() response: FastifyReply
  ): Promise<void> {
    const response_time: number = response.getResponseTime();
    const connection: IConnection = await this.facade.deleteConnection(connection_id, connection_user_id);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(connection as IConnection);
  }
}

import { AddConnectionDTO } from '@dtos';
import { AuthGuard } from '@guards';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ConnectionFacade } from '../facade/connection.facade';
import { I_CONNECTION } from '@interfaces';
import { Observable } from 'rxjs';

@Controller('')
export class ConnectionController {
  constructor(private readonly connectionFacade: ConnectionFacade) {}

  @Get('connections')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getConnections(@Query('userID') userID: string): Observable<I_CONNECTION[]> {
    return this.connectionFacade.getConnections(userID);
  }

  @Post('add')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  addFBPage(@Body() connectionDTO: AddConnectionDTO): Observable<I_CONNECTION> {
    return this.connectionFacade.addConnection(connectionDTO);
  }

  @Delete('delete')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  deleteConnection(@Query('deletedID') deletedID: string): Observable<I_CONNECTION> {
    return this.connectionFacade.deleteConnection(deletedID);
  }
}

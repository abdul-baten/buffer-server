import { AuthGuard } from '@guards';
import { ConnectionFacade } from '../facade/connection.facade';
import { Controller, Delete, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
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

  @Delete('delete')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  deleteConnection(@Query('deletedID') deletedID: string): Observable<I_CONNECTION> {
    return this.connectionFacade.deleteConnection(deletedID);
  }
}

import { AuthGuard } from '@guards';
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { FBInsightDTO } from '@dtos';
import { from, Observable } from 'rxjs';
import { I_INS_FB } from '@interfaces';
import { InsightFacade } from '../facade/insight.facade';

@Controller('')
export class InsightController {
  constructor(private facade: InsightFacade) {}

  @Post('facebook')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  fbInsight(@Body() payload: FBInsightDTO): Observable<Partial<I_INS_FB>> {
    return from(this.facade.fbInsight(payload));
  }

  @Post('instagram')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  instagramInsight(@Body() payload: FBInsightDTO): Observable<Partial<I_INS_FB>> {
    return from(this.facade.instagramInsight(payload));
  }
}

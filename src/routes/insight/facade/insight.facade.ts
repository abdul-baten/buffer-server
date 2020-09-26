import { FBInsightDTO } from '@dtos';
import { I_INSIGHT, I_INS_FB } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { InsightService } from '../service/insight.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class InsightFacade {
  constructor(private service: InsightService) {}

  fbInsight(payload: FBInsightDTO): Observable<Partial<I_INS_FB>> {
    return this.service.fbInsight(payload).pipe(
      map((response: I_INSIGHT) => {
        response.id = payload.id;
        return response;
      }),
    );
  }

  instagramInsight(payload: FBInsightDTO): Observable<Partial<I_INS_FB>> {
    return this.service.instagramInsight(payload).pipe(
      map((response: I_INSIGHT) => {
        response.id = payload.id;
        return response;
      }),
    );
  }
}

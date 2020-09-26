import { I_CONNECTION, I_FB_AUTH_RESPONSE } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { InstagramService } from '../service/instagram.service';
import { Observable } from 'rxjs';

@Injectable()
export class InstagramFacade {
  constructor(private instagramService: InstagramService) {}

  async authenticateInstagram(connectionType: string) {
    return this.instagramService.authenticateInstagram(connectionType);
  }

  authorizeInstagram(code: string, connectionType: string): Observable<I_FB_AUTH_RESPONSE> {
    return this.instagramService.authorizeInstagram(code, connectionType);
  }

  getInstagramAccounts(authResponse: I_FB_AUTH_RESPONSE): Observable<I_CONNECTION[]> {
    return this.instagramService.getInstagramAccounts(authResponse);
  }
}

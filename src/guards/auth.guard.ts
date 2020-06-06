import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { from, Observable, of } from 'rxjs';
import { I_USER } from '@interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenUtil } from '@utils';
import { UserHelper } from 'src/helper';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel('User') private readonly userModel: Model<I_USER>,
    private readonly configService: ConfigService,
  ) {}
  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest(),
      { authToken } = request.cookies;

    if (!authToken) {
      return of(false);
    }

    const userVerified = from(TokenUtil.verifyUser(authToken, this.configService));

    return userVerified.pipe(
      mergeMap((userInfo: Partial<I_USER>) => {
        const { email, _id } = userInfo;
        return from(UserHelper.findUserByEmailAndID(this.userModel, email as string, _id)).pipe(
          map((p: any) => !!p),
          catchError(_ => of(false)),
        );
      }),
      catchError(_ => of(false)),
    );
  }
}

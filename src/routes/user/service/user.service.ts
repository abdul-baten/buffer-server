import { catchError, map, switchMap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { E_ERROR_MESSAGE, E_ERROR_MESSAGE_MAP } from '@enums';
import { from, Observable } from 'rxjs';
import { I_USER } from '@interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SanitizerUtil, TokenUtil } from '@utils';
import { UserMapper } from '@mappers';
import { Injectable, InternalServerErrorException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<I_USER>,
    private readonly configService: ConfigService,
  ) {}

  async findUser(email?: string, _id?: string): Promise<I_USER> {
    try {
      const user = await this.userModel
        .findOne({ email, _id })
        .lean()
        .exec();

      if (!user) {
        throw new InternalServerErrorException(
          E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.DUPLICATE_EMAIL_ADDRESS),
          E_ERROR_MESSAGE.DUPLICATE_EMAIL_ADDRESS,
        );
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.DUPLICATE_EMAIL_ADDRESS),
        E_ERROR_MESSAGE.DUPLICATE_EMAIL_ADDRESS,
      );
    }
  }

  getUserInfo(authToken: string): Observable<I_USER> {
    const userInfo$ = from(TokenUtil.jwtVerify(authToken, this.configService));
    return userInfo$.pipe(
      switchMap((userInfo: any) => {
        return from(this.findUser(userInfo.email, userInfo._id));
      }),
      map((userInfo: I_USER) => SanitizerUtil.sanitizedResponse(userInfo)),
      map((userInfo: I_USER) => UserMapper.userResponseMapper(userInfo)),
      catchError(_ => {
        throw new ForbiddenException();
      }),
    );
  }
}

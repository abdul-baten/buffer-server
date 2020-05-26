import { catchError, map, switchMap } from 'rxjs/operators';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ERROR_MESSAGE, ERROR_MESSAGE_MAP } from '@app/enum';
import { from, Observable } from 'rxjs';
import { I_USER } from '@app/interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SanitizerUtil } from '@app/util/sanitizer/sanitizer.util';
import { TokenUtil } from '@app/util';
import { UserEnterDTO } from '../dto/user-enter.dto';
import { UserJoinDTO } from '../dto/user-join.dto';
import { UserOnboardDTO } from '../dto/user-onboard.dto';
import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<I_USER>,
    private configService: ConfigService,
  ) {}

  async userEnter(userEnterDTO: UserEnterDTO): Promise<any> {
    const { email, password } = userEnterDTO;

    try {
      const user: I_USER = (await this.userModel
        .findOne({ email })
        .exec()) as I_USER;
      if (user) {
        const passwordMatches = compareSync(password, user.password);

        if (passwordMatches) {
          const token = await TokenUtil.jwtSign(
            { email, _id: user._id },
            this.configService,
          );
          return { user, token };
        } else {
          throw new InternalServerErrorException(
            ERROR_MESSAGE_MAP.get(ERROR_MESSAGE.EMAIL_PASSWORD_MISMATCH),
            ERROR_MESSAGE.EMAIL_PASSWORD_MISMATCH,
          );
        }
      } else {
        throw new InternalServerErrorException(
          ERROR_MESSAGE_MAP.get(ERROR_MESSAGE.EMAIL_PASSWORD_MISMATCH),
          ERROR_MESSAGE.EMAIL_PASSWORD_MISMATCH,
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(
        ERROR_MESSAGE_MAP.get(ERROR_MESSAGE.EMAIL_PASSWORD_MISMATCH),
        ERROR_MESSAGE.EMAIL_PASSWORD_MISMATCH,
      );
    }
  }

  async userJoin(userJoinDTO: UserJoinDTO): Promise<Partial<I_USER>> {
    try {
      const user = new this.userModel(userJoinDTO);
      return await user.save();
    } catch (err) {
      throw new InternalServerErrorException(
        ERROR_MESSAGE_MAP.get(ERROR_MESSAGE.DUPLICATE_EMAIL_ADDRESS),
        ERROR_MESSAGE.DUPLICATE_EMAIL_ADDRESS,
      );
    }
  }

  async userVerify(token: string): Promise<any> {
    const data = await TokenUtil.verifyUser(token, this.configService);
    return data;
  }

  async findUser(email?: string, _id?: string): Promise<I_USER> {
    try {
      const user = await this.userModel
        .findOne({ email, _id })
        .lean()
        .exec();

      if (!user) {
        throw new InternalServerErrorException(
          ERROR_MESSAGE_MAP.get(ERROR_MESSAGE.DUPLICATE_EMAIL_ADDRESS),
          ERROR_MESSAGE.DUPLICATE_EMAIL_ADDRESS,
        );
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        ERROR_MESSAGE_MAP.get(ERROR_MESSAGE.DUPLICATE_EMAIL_ADDRESS),
        ERROR_MESSAGE.DUPLICATE_EMAIL_ADDRESS,
      );
    }
  }

  async userOnboard(
    userOnboardDTO: UserOnboardDTO,
  ): Promise<{ user: I_USER; authToken: string }> {
    try {
      const { email: emailAddress } = userOnboardDTO;
      const user = await this.userModel
        .findOneAndUpdate({ email: emailAddress }, userOnboardDTO, {
          new: true,
        })
        .lean()
        .exec();

      if (!user) {
        throw new InternalServerErrorException(
          ERROR_MESSAGE_MAP.get(ERROR_MESSAGE.USER_WITH_THIS_EMAIL_NOT_FOUND),
          ERROR_MESSAGE.USER_WITH_THIS_EMAIL_NOT_FOUND,
        );
      }

      const { email, _id } = user;
      const authToken = await TokenUtil.jwtSign(
        { email, _id },
        this.configService,
      );

      delete user.password;
      return { user, authToken };
    } catch (err) {
      throw new InternalServerErrorException(
        ERROR_MESSAGE_MAP.get(ERROR_MESSAGE.INTERNAL_SERVER_ERROR),
        ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
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
      map((userInfo: I_USER) => userInfo),
      catchError(_ => {
        throw new ForbiddenException();
      }),
    );
  }
}

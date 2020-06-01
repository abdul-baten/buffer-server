import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { E_ERROR_MESSAGE, E_ERROR_MESSAGE_MAP } from '@enums';
import { I_USER } from '@interfaces';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenUtil } from '@utils';
import { UserEnterDTO, UserJoinDTO, UserOnboardDTO } from '@dtos';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<I_USER>,
    private readonly configService: ConfigService,
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
            E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.EMAIL_PASSWORD_MISMATCH),
            E_ERROR_MESSAGE.EMAIL_PASSWORD_MISMATCH,
          );
        }
      } else {
        throw new InternalServerErrorException(
          E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.EMAIL_PASSWORD_MISMATCH),
          E_ERROR_MESSAGE.EMAIL_PASSWORD_MISMATCH,
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(
        E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.EMAIL_PASSWORD_MISMATCH),
        E_ERROR_MESSAGE.EMAIL_PASSWORD_MISMATCH,
      );
    }
  }

  async userJoin(userJoinDTO: UserJoinDTO): Promise<Partial<I_USER>> {
    try {
      const user = new this.userModel(userJoinDTO);
      return await user.save();
    } catch (err) {
      throw new InternalServerErrorException(
        E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.DUPLICATE_EMAIL_ADDRESS),
        E_ERROR_MESSAGE.DUPLICATE_EMAIL_ADDRESS,
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
          E_ERROR_MESSAGE_MAP.get(
            E_ERROR_MESSAGE.USER_WITH_THIS_EMAIL_NOT_FOUND,
          ),
          E_ERROR_MESSAGE.USER_WITH_THIS_EMAIL_NOT_FOUND,
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
        E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.INTERNAL_SERVER_ERROR),
        E_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

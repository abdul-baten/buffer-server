import { AuthMapper } from '@mappers';
import { AuthService } from '../service/auth.service';
import { Injectable } from '@nestjs/common';
import type { IUser } from '@interfaces';
import type { UserEnterDto, UserJoinDto } from '@dtos';

@Injectable()
export class AuthFacade {
  constructor (private readonly authService: AuthService) {}

  public async userEnter (user_enter_dto: UserEnterDto): Promise<{ auth_token: string, user_info: IUser; }> {
    const { auth_token, user_info: user } = await this.authService.userEnter(user_enter_dto);
    const user_info = AuthMapper.userResponseMapper(user);

    return {
      auth_token,
      user_info
    };
  }

  public async userJoin (user_enter_dto: UserJoinDto): Promise<{ auth_token: string, user_info: IUser; }> {
    const { auth_token, user_info: user } = await this.authService.userJoin(user_enter_dto);
    const user_info = AuthMapper.userResponseMapper(user);

    return {
      auth_token,
      user_info
    };
  }
}

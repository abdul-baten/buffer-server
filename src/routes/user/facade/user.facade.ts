import { Injectable } from '@nestjs/common';
import { UserMapper } from '@mappers';
import { UserService } from '../service/user.service';
import type { IUser } from '@interfaces';

@Injectable()
export class UserFacade {
  constructor (private readonly userService: UserService) {}

  public async getUserInfo (auth_token: string): Promise<IUser> {
    const user_info: IUser = await this.userService.getUserInfo(auth_token);
    const response: IUser = UserMapper.userResponseMapper(user_info);

    return response;
  }
}

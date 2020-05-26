import { IsDefined, IsEmail, IsString } from 'class-validator';

class UserEnterDTO {
  @IsDefined()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsString()
  readonly password: string;
}

export { UserEnterDTO };

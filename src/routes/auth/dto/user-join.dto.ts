import { IsAlphanumeric, IsDefined, IsEmail, IsString } from 'class-validator';

export class UserJoinDTO {
  @IsDefined()
  @IsString()
  fullName: string;

  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  @IsAlphanumeric()
  password: string;
}

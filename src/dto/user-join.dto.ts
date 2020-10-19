import { IsAlphanumeric, IsDefined, IsEmail, IsString } from 'class-validator';

export class UserJoinDto {
  @IsDefined()
  @IsString()
  readonly user_full_name!: string;

  @IsDefined()
  @IsEmail()
  @IsString()
  readonly user_email!: string;

  @IsAlphanumeric()
  @IsDefined()
  @IsString()
  readonly user_password!: string;
}

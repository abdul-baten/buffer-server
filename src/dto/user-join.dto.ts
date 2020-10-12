import { IsAlphanumeric, IsDefined, IsEmail, IsString } from 'class-validator';

export class UserJoinDto {
  @IsDefined()
  @IsString()
  readonly full_name!: string;

  @IsDefined()
  @IsEmail()
  @IsString()
  readonly email!: string;

  @IsAlphanumeric()
  @IsDefined()
  @IsString()
  readonly password!: string;
}

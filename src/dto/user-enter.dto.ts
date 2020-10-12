import { IsDefined, IsEmail, IsString } from 'class-validator';

export class UserEnterDto {
  @IsDefined()
  @IsEmail()
  @IsString()
  readonly user_email!: string;

  @IsDefined()
  @IsString()
  readonly user_password!: string;
}

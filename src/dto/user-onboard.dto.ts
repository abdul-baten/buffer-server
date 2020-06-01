import { E_ATTRIBUTION, E_BUSINESS_TYPE, E_COMPANY_SIZE } from '@enums';
import { IsDefined, IsEmail, IsEnum, IsString } from 'class-validator';

export class UserOnboardDTO {
  @IsDefined()
  @IsEnum(E_ATTRIBUTION)
  readonly attribution: E_ATTRIBUTION;

  @IsDefined()
  @IsEnum(E_BUSINESS_TYPE)
  readonly businessType: E_BUSINESS_TYPE;

  @IsDefined()
  @IsString()
  readonly companyName: string;

  @IsDefined()
  @IsEnum(E_COMPANY_SIZE)
  readonly companySize: E_COMPANY_SIZE;

  @IsDefined()
  @IsEmail()
  readonly email: string;
}

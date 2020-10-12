import { EConnectionStatus, EConnectionType } from '@enums';
import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';

export class AddConnectionDto {
  @IsDefined()
  @IsString()
  readonly connection_id!: string;

  @IsDefined()
  @IsString()
  @IsOptional()
  readonly connection_category!: string;

  @IsDefined()
  @IsString()
  readonly connection_name!: string;

  @IsDefined()
  @IsEnum(EConnectionType)
  readonly connection_type!: EConnectionType;

  @IsDefined()
  @IsEnum(EConnectionStatus)
  readonly connection_status!: EConnectionStatus;

  @IsDefined()
  @IsString()
  readonly connection_picture!: string;

  @IsDefined()
  @IsString()
  readonly connection_token!: string;

  @IsDefined()
  @IsString()
  readonly connection_user_id!: string;
}

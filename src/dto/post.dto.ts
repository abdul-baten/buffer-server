import { EPostStatus, EPostType } from '@enums';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import type { IConnection } from '@interfaces';

export class PostDto {
  @IsDefined()
  @IsString()
  readonly post_message!: string;

  @IsDefined()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  readonly post_connection!: Partial<IConnection>;

  @IsOptional()
  @IsArray()
  readonly post_media!: string[];

  @IsDefined()
  @IsString()
  readonly post_date_time!: string;

  @IsDefined()
  @IsEnum(EPostStatus)
  readonly post_status!: EPostStatus;

  @IsDefined()
  @IsEnum(EPostType)
  readonly post_type!: EPostType;

  @IsDefined()
  @IsString()
  readonly post_user_id!: string;
}

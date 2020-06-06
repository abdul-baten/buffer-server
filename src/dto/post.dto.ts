import { E_POST_STATUS, E_POST_TYPE } from '@enums';
import { I_MEDIA } from '@interfaces';
import { IsArray, IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';

export class PostDTO {
  @IsDefined()
  @IsString()
  readonly postCaption: string;

  @IsDefined()
  @IsArray()
  readonly postConnection: string;

  @IsOptional()
  @IsArray()
  readonly postMedia: I_MEDIA['id'][];

  @IsDefined()
  @IsString()
  readonly postScheduleDate: string;

  @IsDefined()
  @IsString()
  readonly postScheduleTime: string;

  @IsDefined()
  @IsEnum(E_POST_STATUS)
  readonly postStatus: E_POST_STATUS;

  @IsDefined()
  @IsEnum(E_POST_TYPE)
  readonly postType: E_POST_TYPE;

  @IsDefined()
  @IsString()
  readonly userID: string;
}

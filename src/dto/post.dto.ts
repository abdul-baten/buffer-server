import { E_POST_STATUS, E_POST_TYPE } from '@enums';
import { I_CONNECTION } from '@interfaces';
import { IsArray, IsDefined, IsEnum, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export class PostDTO {
  @IsDefined()
  @IsString()
  readonly postCaption: string;

  @IsDefined()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  readonly postConnection: Partial<I_CONNECTION>;

  @IsOptional()
  @IsArray()
  readonly postMedia: string[];

  @IsDefined()
  @IsString()
  readonly postScheduleDateTime: string;

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

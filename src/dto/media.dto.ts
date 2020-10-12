import { IsDefined, IsString } from 'class-validator';

export class MediaDto {
  @IsDefined()
  @IsString()
  readonly media_mime_type!: string;

  @IsDefined()
  @IsString()
  readonly media_name!: string;

  @IsDefined()
  @IsString()
  readonly media_type!: string;

  @IsDefined()
  @IsString()
  readonly media_url!: string;

  @IsDefined()
  @IsString()
  readonly media_size!: string;

  @IsDefined()
  @IsString()
  readonly media_user_id!: string;
}

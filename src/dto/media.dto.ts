import { IsDefined, IsString } from 'class-validator';

export class MediaDTO {
  @IsDefined()
  @IsString()
  readonly mediaMimeType: string;

  @IsDefined()
  @IsString()
  readonly mediaName: string;

  @IsDefined()
  @IsString()
  readonly mediaType: string;

  @IsDefined()
  @IsString()
  readonly mediaURL: string;

  @IsDefined()
  @IsString()
  readonly mediaSize: string;

  @IsDefined()
  @IsString()
  readonly userID: string;
}

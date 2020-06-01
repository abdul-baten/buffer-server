import { IsDefined, IsString } from 'class-validator';

export class FileDTO {
  @IsDefined()
  @IsString()
  readonly fileMimeType: string;

  @IsDefined()
  @IsString()
  readonly fileName: string;

  @IsDefined()
  @IsString()
  readonly fileType: string;

  @IsDefined()
  @IsString()
  readonly fileURL: string;

  @IsDefined()
  @IsString()
  readonly userID: string;
}

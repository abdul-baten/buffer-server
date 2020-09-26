import { IsDefined, IsString, IsEmpty } from 'class-validator';

export class FBInsightDTO {
  @IsDefined()
  @IsString()
  readonly id: string;

  @IsDefined()
  @IsString()
  readonly since: string;

  @IsDefined()
  @IsString()
  @IsEmpty()
  readonly until: string;

  @IsDefined()
  @IsString()
  readonly userID: string;
}

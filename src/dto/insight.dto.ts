import { IsDefined, IsString } from 'class-validator';

export class FbInsightDto {
  @IsDefined()
  @IsString()
  readonly id!: string;

  @IsDefined()
  @IsString()
  readonly user_id!: string;

  @IsDefined()
  @IsString()
  readonly since!: string;

  @IsDefined()
  @IsString()
  readonly until!: string;
}

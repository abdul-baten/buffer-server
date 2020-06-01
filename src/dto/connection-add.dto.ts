import { E_CONNECTION_STATUS, E_CONNECTION_TYPE } from '@enums';
import { IsDefined, IsEnum, IsString } from 'class-validator';

export class AddConnectionDTO {
  @IsDefined()
  @IsString()
  readonly connectionID: string;

  @IsDefined()
  @IsString()
  readonly connectionCategory: string;

  @IsDefined()
  @IsString()
  readonly connectionName: string;

  @IsDefined()
  @IsEnum(E_CONNECTION_TYPE)
  readonly connectionType: E_CONNECTION_TYPE;

  @IsDefined()
  @IsEnum(E_CONNECTION_STATUS)
  readonly connectionStatus: E_CONNECTION_STATUS;

  @IsDefined()
  @IsString()
  readonly connectionPicture: string;

  @IsDefined()
  @IsString()
  readonly connectionToken: string;

  @IsDefined()
  @IsString()
  readonly connectionUserID: string;
}

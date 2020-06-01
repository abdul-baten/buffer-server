import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

@Injectable()
export class DatabaseConfigUtil implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  private readonly ADAPTAR_PASSWORD: string = this.configService.get<string>(
    'DATABASE.ADAPTAR_PASSWORD',
  ) as string;

  private readonly ADAPTAR_URI = (this.configService.get<string>(
    'DATABASE.ADAPTAR_URI',
  ) as string)
    .trim()
    .replace('<password>', this.ADAPTAR_PASSWORD);

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.ADAPTAR_URI,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      validateOptions: true,
      useFindAndModify: false,
    };
  }
}

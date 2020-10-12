import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import type { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class DatabaseConfigUtil implements MongooseOptionsFactory {
  constructor (private readonly configService: ConfigService) {}

  createMongooseOptions (): MongooseModuleOptions {
    const password = this.configService.get('DATABASE.ADAPTAR_PASSWORD');
    const uri = this.configService.get('DATABASE.ADAPTAR_URI').trim().
      replace('<password>', password);

    return {
      uri,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      useCreateIndex: true,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      useFindAndModify: false,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      useNewUrlParser: true,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      useUnifiedTopology: true,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      validateOptions: true
    };
  }
}

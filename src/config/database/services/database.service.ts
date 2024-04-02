import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions {
    return {
      uri: `mongodb+srv://${this.configService.getOrThrow(
        'MONGODB_USERNAME',
      )}:${this.configService.getOrThrow(
        'MONGODB_PASSWORD',
      )}@${this.configService.getOrThrow(
        'MONGODB_SERVER_URL',
      )}/${this.configService.getOrThrow(
        'NODE_ENV',
      )}?retryWrites=true&w=majority&appName=${this.configService.getOrThrow(
        'MONGODB_APP_NAME',
      )}`,
    };
  }
}

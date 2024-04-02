import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FaqModule } from './models/faq/faq.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './config/database/services/database.service';
import { DatabaseModule } from './config/database/database.module';

@Module({
  imports: [
    FaqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(8000).required(),
        MONGODB_USERNAME: Joi.string().required().min(6),
        MONGODB_PASSWORD: Joi.string().required().min(6),
        MONGODB_SERVER_URL: Joi.string().required().min(10),
        MONGODB_APP_NAME: Joi.string().required().min(6),
      }),
    }),
    MongooseModule.forRootAsync({
      useClass: DatabaseService,
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as mustache from 'mustache-express';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //set cookie
  app.use(cookieParser(`STRING_RAHASIaHUHU`));

  //set logger jadi winston
  const loggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(loggerService);

  //set mustache
  app.set(`views`, __dirname + `/../views`);
  app.set(`view engine`, `html`);
  app.engine(`html`, mustache());

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;

  await app.listen(port);
}
bootstrap();

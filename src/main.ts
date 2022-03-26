import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { configureSwagger, corsConfig } from './shared/config/app.config';
import { isRunningInProduction } from './shared/util/env.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);
  const port = 5000;

  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors(corsConfig());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  if (!isRunningInProduction()) {
    configureSwagger(app);
  }
  await app.listen(port || 3000);
  Logger.log(`Server running on port ${port}`);
}
bootstrap();

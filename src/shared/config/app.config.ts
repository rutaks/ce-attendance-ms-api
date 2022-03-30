import { INestApplication } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import AppConfig from '../interface/app-config.interface';
import typeOrmConfig from './typeorm.config';

export const commonConfig = (): AppConfig => ({
  port: parseInt(process.env.PORT),
  env: process.env.NODE_ENV,
  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY.trim(),
    publicKey: process.env.JWT_PUBLIC_KEY.trim(),
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN),
  },
});

export const runtimeConfig = (): AppConfig => ({
  database: typeOrmConfig,
  ...commonConfig(),
});

export const testingConfig = (): AppConfig => ({
  ...commonConfig(),
});

/**
 * Configures and binds Swagger with the project's application
 * @param app The NestJS Application instance
 */
export function configureSwagger(app: INestApplication): void {
  const API_TITLE = 'CE Attendance MS API';
  const API_DESCRIPTION = 'API Doc. for CE Attendance MS API';
  const API_VERSION = '1.0';
  const SWAGGER_URL = 'docs/swagger-ui';
  const options = new DocumentBuilder()
    .setTitle(API_TITLE)
    .setDescription(API_DESCRIPTION)
    .setVersion(API_VERSION)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_URL, app, document, {
    customSiteTitle: 'CE Attendance MS API',
    swaggerOptions: { docExpansion: 'none', persistAuthorization: true },
  });
}

/**
 * Generates obj for the app's CORS configurations
 * @returns CORS configurations
 */
export function corsConfig(): CorsOptions {
  return {
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Set-Cookie, Cookies',
    credentials: true,
    // origin: (origin, callback) => {
    //   const appConfigs = runtimeConfig();
    //   const whitelist = appConfigs.allowedOrigins || [];
    //   const canAllowUndefinedOrigin =
    //     origin === undefined && appConfigs.env !== 'production';

    //   if (whitelist.indexOf(origin) !== -1 || canAllowUndefinedOrigin) {
    //     callback(null, true);
    //   } else {
    //     callback(
    //       new UnauthorizedException(
    //         `Not allowed by CORS for origin:${origin} on ${appConfigs.env}`,
    //       ),
    //     );
    //   }
    // },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  };
}

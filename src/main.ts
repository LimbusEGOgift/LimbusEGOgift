import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { AppExceptionFilter } from './common/filters/app-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

function swagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('REST API Documentation')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('document', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const servicePort = config.get<string>('PORT', '3000');
  const NODE_ENV = config.get<string>('NODE_ENV', 'development');

  let CORS_ORIGIN:
    | boolean
    | string
    | RegExp
    | (string | RegExp)[]
    | CustomOrigin = [];
  if (config.get<string>('CORS_ORIGIN')) {
    CORS_ORIGIN.push(...config.get<string>('CORS_ORIGIN', '*').split(','));
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  if (config.get<string>('CORS_REGEX_ORIGIN')) {
    CORS_ORIGIN.push(
      ...config
        .get<string>('CORS_REGEX_ORIGIN', '')
        .split(',')
        .map((regex) => new RegExp(regex)),
    );
  }
  if (CORS_ORIGIN.length === 0) {
    CORS_ORIGIN = true;
  }

  app.enableCors({
    origin: CORS_ORIGIN,
    methods: config.get<string>('CORS_METHODS', 'GET,PUT,PATCH,POST,DELETE'),
    credentials: config.get<boolean>('CORS_CREDENTIALS', true),
    preflightContinue: config.get<boolean>('CORS_PREFLIGHT', false),
    optionsSuccessStatus: config.get<number>('CORS_OPTIONS_STATUS', 204),
  });

  if (config.get<boolean>('SWAGGER_ENABLED', NODE_ENV === 'development')) {
    swagger(app);
    Logger.log(
      `Swagger is enabled on http://localhost:${servicePort}/document`,
      'Bootstrap',
    );
  }

  await app.listen(servicePort);

  Logger.log(
    `Server is running on http://localhost:${servicePort} with ${NODE_ENV} mode`,
    'Bootstrap',
  );
}
void bootstrap();

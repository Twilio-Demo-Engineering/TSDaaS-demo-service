import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APIGatewayProxyHandler, Context } from 'aws-lambda';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';
import * as expressWinston from 'express-winston';
import { Server } from 'http';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import 'reflect-metadata';
import * as winston from 'winston';
import { AppModule } from './app.module';

let cachedServer: Server;
let cachedLoggers: any;

const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('TSDaaS Demo Service')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000/dev')
    .addServer('https://lvaladares.sa.ngrok.io/dev')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};

const createLoggers = (context: Context) => {
  const awsRequestId = winston.format((log) => {
    log.awsRequestId = context.awsRequestId;
    return log;
  });

  const nestLogger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          awsRequestId(),
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike('Nest', {
            prettyPrint: true,
          }),
        ),
      }),
    ],
  });

  const expressLogger = expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      awsRequestId(),
      winston.format.timestamp(),
      nestWinstonModuleUtilities.format.nestLike('Nest', {
        prettyPrint: true,
      }),
    ),
    meta: true,
    expressFormat: false,
    colorize: false,
  });

  return { nestLogger, expressLogger };
};

const bootstrapServer = async (context: Context): Promise<Server> => {
  const expressApp = express();
  expressApp.use(cachedLoggers.expressLogger);
  const adapter = new ExpressAdapter(expressApp);

  // making winston logger default application logger
  const app = await NestFactory.create(AppModule, adapter);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useLogger(cachedLoggers.nestLogger);
  app.enableCors();
  setupSwagger(app);

  await app.init();
  return awsServerlessExpress.createServer(expressApp);
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!cachedLoggers) {
    cachedLoggers = createLoggers(context);
  }
  if (!cachedServer) {
    cachedServer = await bootstrapServer(context);
  }

  if (event.path === '/api') {
    event.path = '/api/';
  }
  event.path = event.path.includes('swagger-ui')
    ? `/api${event.path}`
    : event.path;

  return awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE')
    .promise;
};

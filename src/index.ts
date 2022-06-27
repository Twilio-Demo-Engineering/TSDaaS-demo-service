import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
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
let cachedSwagger: any;
export let cachedPrismaClient: PrismaClient;

const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('TSDaaS Demo Service')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000/dev')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  return app;
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

let cachedExpress, cachedExpressAdapter, cachedNestApp;

const bootstrapServer = async (): Promise<Server> => {
  if (!cachedPrismaClient) {
    cachedPrismaClient = new PrismaClient();
    cachedPrismaClient.$connect();
  }
  if (!cachedExpress) {
    cachedExpress = express();
    // expressApp.use(cachedLoggers.expressLogger);
    cachedExpressAdapter = new ExpressAdapter(cachedExpressAdapter);
  }
  if (!cachedNestApp) {
    cachedNestApp = await NestFactory.create(AppModule, cachedExpressAdapter);
    cachedNestApp.useGlobalPipes(new ValidationPipe({ transform: true }));
    // app.useLogger(cachedLoggers.nestLogger);
    cachedNestApp.enableCors();
    // if (!cachedSwagger) {
    //   cachedSwagger = setupSwagger(cachedNestApp);
    // }

    await cachedNestApp.init();
  }

  // making winston logger default application logger
  return awsServerlessExpress.createServer(cachedExpress);
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  // if (!cachedLoggers) {
  //   cachedLoggers = createLoggers(context);
  // }
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
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

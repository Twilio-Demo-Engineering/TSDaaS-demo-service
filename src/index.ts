import 'reflect-metadata';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APIGatewayProxyHandler, Context } from 'aws-lambda';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';
import { Server } from 'http';
import { AppModule } from './app.module';
import { createLoggers } from './logger';

const { API_VERSION, API_SERVER } = process.env;

let cachedServer: Server;
let cachedLoggers: any;

const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('TSDaaS Demo Service')
    .setVersion(API_VERSION)
    .addServer(API_SERVER)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};

const bootstrapServer = async (context: Context): Promise<Server> => {
  const expressApp = express.default();
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

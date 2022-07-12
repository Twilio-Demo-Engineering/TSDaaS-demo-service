import { Context } from 'aws-lambda';
import * as expressWinston from 'express-winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

export const createLoggers = (context: Context) => {
  const awsRequestId = winston.format((log) => {
    log.awsRequestId = context.awsRequestId;
    return log;
  });

  const nestLogger = WinstonModule.createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      awsRequestId(),
      winston.format.timestamp(),
      // nestWinstonModuleUtilities.format.nestLike('Nest', {
      //   prettyPrint: true,
      // }),
      winston.format.json({ space: 2 }),
    ),
  });

  const expressLogger = expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      awsRequestId(),
      winston.format.timestamp(),
      // nestWinstonModuleUtilities.format.nestLike('Nest', {
      //   prettyPrint: true,
      // }),
      winston.format.json({ space: 2 }),
    ),
    meta: true,
    expressFormat: false,
    colorize: false,
  });

  return { nestLogger, expressLogger };
};

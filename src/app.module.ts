import { ClassSerializerInterceptor, Logger, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaCrudModule } from 'nestjs-prisma-crud';
import { ConfigurationsModule } from './configurations/configurations.module';
import { PrismaExceptionFilter } from './configurations/database/database.exceptionFilter';
import { DatabaseService } from './configurations/database/database.service';
import { DemoModule } from './demo/demo.module';
import { PropertyModule } from './property/property.module';

@Module({
  imports: [
    ConfigurationsModule,
    PrismaCrudModule.register({
      prismaService: DatabaseService,
    }),
    DemoModule,
    PropertyModule,
  ],
  providers: [
    Logger,
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
  ],
})
export class AppModule {}

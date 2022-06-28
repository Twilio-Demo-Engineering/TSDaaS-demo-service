import { Module, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigurationsModule } from './configurations/configurations.module';
import { PrismaCrudModule } from 'nestjs-prisma-crud';
import { DatabaseService } from './configurations/database/database.service';
import { DemoModule } from './demo/demo.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaExceptionFilter } from 'configurations/database/database.exceptionFilter';
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

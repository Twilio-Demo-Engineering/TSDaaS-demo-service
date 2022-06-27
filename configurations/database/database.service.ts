import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { cachedPrismaClient as prismaClient } from 'src/index';

@Injectable()
export class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    Object.assign(this, prismaClient);
  }

  async enableShutDownHooks(app: INestApplication) {
    prismaClient.$on('beforeExit', async () => {
      await app.close();
    });
  }
}

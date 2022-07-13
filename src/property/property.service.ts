import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from 'nestjs-prisma-crud';
import { DatabaseService } from '../configurations/database/database.service';
import { CreatePropertyDto, PropertyDto } from './model/property.model';

@Injectable()
export class PropertyService extends PrismaCrudService {
  constructor(private db: DatabaseService) {
    super({
      model: 'property',
      allowedJoins: [],
      defaultJoins: [],
    });
  }

  isUpdatePropertyDto(
    property: CreatePropertyDto | PropertyDto,
  ): property is PropertyDto {
    return !!(property as PropertyDto).id;
  }

  async upsert(
    demoId: string,
    demoProperties: (CreatePropertyDto | PropertyDto)[],
  ) {
    return this.db.$transaction([
      ...demoProperties
        .filter((dp) => !this.isUpdatePropertyDto(dp))
        .map((dp) => {
          const { key, value, safe } = dp;
          return this.db.property.create({
            data: {
              key,
              value,
              safe,
              demo: {
                connect: { id: demoId },
              },
            },
          });
        }),
      ...demoProperties
        .filter((dp) => this.isUpdatePropertyDto(dp))
        .map((dp) => {
          const { key, value, safe } = dp;
          return this.db.property.update({
            where: {
              id: (dp as PropertyDto).id,
            },
            data: {
              key,
              value,
              safe,
              updated_at: new Date(),
            },
          });
        }),
    ]);
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

const _property = Prisma.validator<Prisma.PropertyArgs>()({
  include: { demo: false },
});

export type Property = Prisma.PropertyGetPayload<typeof _property>;

export class PropertyDto implements Partial<Property> {
  constructor(init?: Partial<Property>) {
    Object.assign(this, init);
  }

  @Exclude()
  id?: string;

  @IsString()
  @ApiProperty()
  key: string;

  @IsString()
  @ApiProperty()
  value: string;

  @Exclude()
  safe: boolean;

  @IsString()
  @Exclude()
  demoId?: string;

  @Exclude()
  created_at?: Date;

  @Exclude()
  updated_at?: Date;
}

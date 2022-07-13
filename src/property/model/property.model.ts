import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

const _property = Prisma.validator<Prisma.PropertyArgs>()({
  include: { demo: true },
});

export type Property = Prisma.PropertyGetPayload<typeof _property>;

export class PropertyDto implements Partial<Property> {
  constructor(init?: Partial<Property>) {
    Object.assign(this, init);
  }

  @IsString()
  @ApiPropertyOptional()
  id?: string;

  @IsString()
  @ApiProperty()
  key: string;

  @IsString()
  @ApiProperty()
  value: string;

  @IsBoolean()
  @ApiProperty({ type: Boolean, default: false })
  safe?: boolean = false;

  @Exclude()
  demoId?: string;

  @Exclude()
  created_at?: Date;

  @Exclude()
  updated_at?: Date;
}

export type CreatePropertyDto = Omit<PropertyDto, 'id'>;

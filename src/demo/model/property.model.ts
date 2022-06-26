import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

const _property = Prisma.validator<Prisma.PropertyArgs>()({
  include: { demo: false },
});

export type Property = Prisma.PropertyGetPayload<typeof _property>;

export class PropertyDto implements Partial<Property> {
  constructor(init?: Partial<Property>) {
    Object.assign(this, init);
  }

  @IsString()
  @ApiPropertyOptional({ type: String })
  id?: string;

  @IsString()
  @ApiProperty()
  key: string;

  @IsString()
  @ApiProperty()
  value: string;

  @IsString()
  @Exclude()
  demoId?: string;

  @Exclude()
  @IsDate()
  @ApiPropertyOptional()
  created_at?: Date;

  @Exclude()
  @IsDate()
  @ApiPropertyOptional()
  updated_at?: Date;
}

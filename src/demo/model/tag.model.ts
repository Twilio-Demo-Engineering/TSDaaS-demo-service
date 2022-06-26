import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsDate, IsString } from 'class-validator';

const _tag = Prisma.validator<Prisma.TagArgs>()({
  include: { demoTag: false },
});

export type Tag = Prisma.TagGetPayload<typeof _tag>;

export class TagDto implements Partial<Tag> {
  constructor(init?: Partial<TagDto>) {
    Object.assign(this, init);
  }

  @IsString()
  @ApiPropertyOptional()
  id?: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsDate()
  @ApiPropertyOptional({ type: Date })
  created_at?: Date;

  @IsDate()
  @ApiPropertyOptional({ type: Date })
  updated_at?: Date;
}

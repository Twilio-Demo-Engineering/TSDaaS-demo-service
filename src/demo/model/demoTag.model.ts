import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Tag, TagDto } from './tag.model';

const _demoTag = Prisma.validator<Prisma.DemoTagArgs>()({
  include: { tag: true },
});

export type DemoTag = Prisma.DemoTagGetPayload<typeof _demoTag>;

export class DemoTagDto implements Partial<DemoTag> {
  @IsString()
  @ApiPropertyOptional()
  id?: string;

  @IsNotEmpty()
  @ApiProperty({ type: TagDto })
  tag: Tag;

  @IsDate()
  @ApiPropertyOptional({ type: Date })
  created_at?: Date;

  @IsDate()
  @ApiPropertyOptional({ type: Date })
  updated_at?: Date;
}

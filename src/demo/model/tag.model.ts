import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

const _tag = Prisma.validator<Prisma.TagArgs>()({
  include: { demoTag: false },
});

export type Tag = Prisma.TagGetPayload<typeof _tag>;

export class TagDto implements Partial<Tag> {
  constructor(init?: Partial<TagDto>) {
    Object.assign(this, init);
  }

  @Exclude()
  id?: string;

  @IsString()
  @ApiProperty()
  name: string;

  @Exclude()
  created_at?: Date;

  @Exclude()
  updated_at?: Date;
}

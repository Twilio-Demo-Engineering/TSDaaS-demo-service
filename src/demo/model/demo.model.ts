import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DemoSolution, Prisma } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';
import { Property, PropertyDto } from '../../property/model/property.model';
import { DemoSolutionDto } from './demoSolution.model';
import { DemoTag } from './demoTag.model';
import { TagDto } from './tag.model';

const _demo = Prisma.validator<Prisma.DemoArgs>()({
  include: {
    properties: true,
    demoTags: true,
    solutions: true,
  },
});

export type Demo = Prisma.DemoGetPayload<typeof _demo>;

export class DemoDto implements Partial<Demo> {
  constructor(init?: Partial<Demo>) {
    Object.assign(this, init);
  }

  @IsString()
  @ApiPropertyOptional()
  id?: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  urlPrefix: string;

  @IsString()
  @ApiProperty()
  authors: string;

  @IsString()
  @ApiProperty()
  revisionNumber: string;

  @Exclude()
  demoTags: DemoTag[];

  @Exclude()
  properties: Property[];

  @Exclude()
  solutions: DemoSolution[];

  @IsArray()
  @Expose({ name: 'solutions' })
  @ApiProperty({ name: 'solutions', type: [DemoSolutionDto] })
  @Type(() => DemoSolutionDto)
  get demoSolutions() {
    return this.solutions.map((s) => new DemoSolutionDto(s));
  }

  @IsArray()
  @Expose({ name: 'properties' })
  @ApiProperty({ name: 'properties', type: [PropertyDto] })
  @Type(() => PropertyDto)
  get demoProperties() {
    return this.properties
      .filter((prop) => !prop.safe)
      .map((prop) => new PropertyDto(prop));
  }

  get safeDemoProperties() {
    return this.properties
      .filter((prop) => prop.safe)
      .map((prop) => new PropertyDto(prop));
  }

  @IsArray()
  @ApiProperty({ type: [TagDto] })
  @Type(() => TagDto)
  @Expose({ name: 'tags' })
  get tags(): TagDto[] {
    return this.demoTags.map((dt) => new TagDto(dt.tag));
  }
}

export class PostDemoDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  urlPrefix: string;

  @IsString()
  @ApiProperty()
  authors: string;

  @IsString()
  @ApiProperty()
  revisionNumber: string;

  @IsArray()
  @ApiProperty({ type: [DemoSolutionDto] })
  solutions: DemoSolutionDto[];

  @ApiProperty({ type: [PropertyDto] })
  properties: PropertyDto[];

  @ApiProperty({ type: [PropertyDto] })
  safeProperties: PropertyDto[];

  @ApiProperty({ type: [TagDto] })
  tags: TagDto[];
}

export class UpdateDemoDto {
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @IsString()
  @ApiPropertyOptional()
  urlPrefix?: string;

  @IsString()
  @ApiPropertyOptional()
  authors?: string;

  @IsString()
  @ApiPropertyOptional()
  revisionNumber?: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

const _demoSolution = Prisma.validator<Prisma.DemoSolutionArgs>()({
  include: { demo: false },
});

export type DemoSolution = Prisma.DemoSolutionGetPayload<typeof _demoSolution>;

export class DemoSolutionDto implements Partial<DemoSolution> {
  constructor(init?: Partial<DemoSolutionDto>) {
    Object.assign(this, init);
  }

  @Exclude()
  id?: string;

  @Exclude()
  demoId?: string;

  @IsString()
  @ApiProperty()
  name: string;
}

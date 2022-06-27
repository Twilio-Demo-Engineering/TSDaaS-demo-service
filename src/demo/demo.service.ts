import { Injectable, Scope } from '@nestjs/common';
import { CrudMethodOpts, PrismaCrudService } from 'nestjs-prisma-crud';
import { DatabaseService } from 'src/configurations/database/database.service';
import { Demo, PostDemoDto } from './model/demo.model';
import { DemoSolutionDto } from './model/demoSolution.model';

@Injectable({ scope: Scope.TRANSIENT })
export class DemoService extends PrismaCrudService {
  constructor(private db: DatabaseService) {
    super({
      model: 'demo',
      allowedJoins: ['demoTags', 'properties', 'demoTags.tag', 'solutions'],
      defaultJoins: ['demoTags', 'properties', 'demoTags.tag', 'solutions'],
    });
  }

  override async create(
    createDemoDto: PostDemoDto,
    opts: CrudMethodOpts,
  ): Promise<Demo> {
    const {
      name,
      urlPrefix,
      authors,
      revisionNumber,
      properties,
      tags,
      solutions,
    } = createDemoDto;

    const demo = await this.db.demo.create({
      data: {
        name,
        urlPrefix,
        authors,
        revisionNumber,
        properties: {
          create: properties,
        },
        demoTags: {
          create: tags.map((dt) => ({
            tag: {
              connectOrCreate: {
                where: { name: dt.name },
                create: { name: dt.name },
              },
            },
          })),
        },
        solutions: {
          create: solutions.map((s) => new DemoSolutionDto(s)),
        },
      },
      include: {
        solutions: true,
        properties: true,
        demoTags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return demo;
  }
}
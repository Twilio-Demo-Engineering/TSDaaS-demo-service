import {
  Body,
  Controller,
  Delete,
  Get,
  Optional,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaExceptionFilter } from 'configurations/database/database.exceptionFilter';
import { DemoService } from './demo.service';
import { DemoDto, PostDemoDto } from './model/demo.model';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Post()
  @ApiResponse({ status: 201, type: DemoDto })
  @UseFilters(PrismaExceptionFilter)
  async create(
    @Body() createDemoDto: PostDemoDto,
    @Optional() @Query('crudQuery') crudQuery?: string,
  ): Promise<DemoDto> {
    const created = await this.demoService.create(createDemoDto, {
      crudQuery,
    });
    return new DemoDto(created);
  }

  @Get()
  @ApiResponse({ status: 200, type: [DemoDto] })
  async findMany(@Query('crudQuery') crudQuery: string): Promise<DemoDto[]> {
    const matches = await this.demoService.findMany({ crudQuery });
    return matches.data.map((demo) => new DemoDto(demo));
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: DemoDto })
  async findOne(@Param('id') id: string): Promise<DemoDto> {
    const match = await this.demoService.findOne(id, null);
    return match;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDemoDto: PostDemoDto,
    @Query('crudQuery') crudQuery: string,
  ): Promise<DemoDto> {
    const updated = await this.demoService.update(id, updateDemoDto, {
      crudQuery,
    });
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('crudQuery') crudQuery: string) {
    return this.demoService.remove(id, { crudQuery });
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaExceptionFilter } from '../configurations/database/database.exceptionFilter';
import { DemoService } from './demo.service';
import { DemoDto, PostDemoDto, UpdateDemoDto } from './model/demo.model';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: DemoDto })
  @UseFilters(PrismaExceptionFilter)
  async create(@Body() createDemoDto: PostDemoDto): Promise<DemoDto> {
    const created = await this.demoService.create(createDemoDto, null);
    return new DemoDto(created);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [DemoDto] })
  async findMany(@Query('crudQuery') crudQuery: string): Promise<DemoDto[]> {
    const matches = await this.demoService.findMany({ crudQuery });
    return matches.data.map((demo) => new DemoDto(demo));
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: DemoDto })
  async findOne(@Param('id') id: string): Promise<DemoDto> {
    const match = await this.demoService.findOne(id, null);
    return new DemoDto(match);
  }

  @Patch(':id')
  @ApiResponse({ status: HttpStatus.OK, type: DemoDto })
  async update(
    @Param('id') id: string,
    @Body() updateDemoDto: Partial<UpdateDemoDto>,
  ): Promise<DemoDto> {
    const updated = await this.demoService.update(id, updateDemoDto, null);
    return new DemoDto(updated);
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  async remove(@Param('id') id: string) {
    await this.demoService.remove(id, null);
    return true;
  }
}

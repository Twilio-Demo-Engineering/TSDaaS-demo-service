import { Controller, Delete, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { DemoService } from '../demo/demo.service';
import { DemoDto } from '../demo/model/demo.model';
import { PropertyDto } from '../property/model/property.model';
import { PropertyService } from './property.service';

@Controller('demo/:demoId/safeProperties')
export class SafePropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly demoService: DemoService,
  ) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [PropertyDto] })
  async find(@Param('demoId') demoId: string): Promise<PropertyDto[]> {
    const match = new DemoDto(await this.demoService.findOne(demoId, null));
    return match.safeDemoProperties;
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  async remove(
    @Param('demoId') demoId: string,
    @Param('id') id: string,
  ): Promise<boolean> {
    await this.propertyService.remove(id, {
      crudQuery: {
        where: { id, demoId, safe: true },
      },
    });
    return true;
  }
}

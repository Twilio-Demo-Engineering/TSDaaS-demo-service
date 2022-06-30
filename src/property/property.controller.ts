import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { DemoService } from '../demo/demo.service';
import { DemoDto } from '../demo/model/demo.model';
import { PropertyDto } from '../property/model/property.model';
import {PropertyService } from './property.service';

@Controller('demo/:demoId/properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly demoService: DemoService,
  ) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [PropertyDto] })
  async find(@Param('demoId') demoId: string): Promise<PropertyDto[]> {
    const match = new DemoDto(await this.demoService.findOne(demoId, null));
    return match.demoProperties.map((prop) => new PropertyDto(prop));
  }

  @Patch()
  @ApiBody({ type: [PropertyDto] })
  @ApiResponse({ status: HttpStatus.CREATED, type: [PropertyDto] })
  async update(
    @Param('demoId') demoId: string,
    @Body() updateDemoProperties: PropertyDto[],
  ): Promise<PropertyDto[]> {
    const updatedProperties = await this.propertyService.upsert(
      demoId,
      updateDemoProperties,
    );
    return updatedProperties.map((prop) => new PropertyDto(prop));
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  async remove(
    @Param('demoId') demoId: string,
    @Param('id') id: string,
  ): Promise<boolean> {
    await this.propertyService.remove(id, {
      crudQuery: {
        where: { id, demoId },
      },
    });
    return true;
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { DemoService } from 'src/demo/demo.service';
import { DemoDto } from 'src/demo/model/demo.model';
import { PropertyDto } from 'src/property/model/property.model';
import { PropertyService } from './property.service';

@Controller('demo/:demoId/properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly demoService: DemoService,
  ) {}

  @Get()
  async find(@Param('demoId') demoId: string): Promise<PropertyDto[]> {
    const match = new DemoDto(await this.demoService.findOne(demoId, null));
    return match.demoProperties.map((prop) => new PropertyDto(prop));
  }

  @Patch()
  @ApiBody({ type: [PropertyDto] })
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
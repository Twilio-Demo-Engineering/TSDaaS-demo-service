import { Module } from '@nestjs/common';
import { DemoModule } from '../demo/demo.module';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';

@Module({
  controllers: [PropertyController],
  providers: [PropertyService],
  imports: [DemoModule],
})
export class PropertyModule {}

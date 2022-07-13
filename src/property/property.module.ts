import { Module } from '@nestjs/common';
import { DemoModule } from '../demo/demo.module';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { SafePropertyController } from './safeProperty.controller';

@Module({
  controllers: [PropertyController, SafePropertyController],
  providers: [PropertyService],
  imports: [DemoModule],
})
export class PropertyModule {}

import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { DemoModule } from 'src/demo/demo.module';

@Module({
  controllers: [PropertyController],
  providers: [PropertyService],
  imports: [DemoModule],
})
export class PropertyModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';
describe('DemoController', () => {
  let sut: DemoController;
  let demoService: DemoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemoController],
      providers: [DemoService],
    }).compile();

    sut = module.get<DemoController>(DemoController);
    demoService = module.get<DemoService>(DemoService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});

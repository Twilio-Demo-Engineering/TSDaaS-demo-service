import { Test, TestingModule } from '@nestjs/testing';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';
import { Demo, PostDemoDto } from './model/demo.model';

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

  it('should call demoService with correct payload, return correct dto', async () => {
    // const postDemoStub: PostDemoDto = {
    //   name: '',
    //   urlPrefix: '',
    //   authors: '',
    //   revisionNumber: '',
    //   solutions: [],
    //   properties: [],
    //   safeProperties: [],
    //   tags: [],
    // };

    // const demoServiceCreateStub: Demo = {
    //   ...postDemoStub,
    // };

    // const demoServiceCreateMock = jest.spyOn(demoService, 'create');
    // demoServiceCreateMock.mockImplementation(() => demoServiceCreateStub);

    // await sut.create(postDemoStub);

    // mock demo from demo service
    // generate demo payload with more parameters than expecte
    // check if serialization excludes fields
    // create demo stub with demo type
    // check if dto return from sut.create is correct
  });
});

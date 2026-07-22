import { Test, TestingModule } from '@nestjs/testing';
import { SpecialMeetingsController } from './special-meetings.controller';

describe('SpecialMeetingsController', () => {
  let controller: SpecialMeetingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialMeetingsController],
    }).compile();

    controller = module.get<SpecialMeetingsController>(SpecialMeetingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

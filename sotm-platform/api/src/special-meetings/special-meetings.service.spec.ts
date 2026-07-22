import { Test, TestingModule } from '@nestjs/testing';
import { SpecialMeetingsService } from './special-meetings.service';

describe('SpecialMeetingsService', () => {
  let service: SpecialMeetingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialMeetingsService],
    }).compile();

    service = module.get<SpecialMeetingsService>(SpecialMeetingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

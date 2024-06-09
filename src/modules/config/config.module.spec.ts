import { Test } from '@nestjs/testing';
import { ConfigModule } from './config.module';
import { ConfigService } from './config.service';

describe('ConfigModule', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();

    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(configService).toBeDefined();
  });

  it('should provide ConfigService', () => {
    expect(configService).toBeInstanceOf(ConfigService);
  });

  it('should have loaded .env file', () => {
    const value = configService.get('PORT');
    expect(value).toBeDefined();
  });
});

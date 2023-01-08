import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

const MockApp = jest.fn<Partial<INestApplication>, []>(() => ({
  close: jest.fn(),
}));

describe('PrismaService', () => {
  let service: PrismaService;
  let app: NestExpressApplication;

  beforeEach(async () => {
    app = MockApp() as NestExpressApplication;
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enableShutdownHooks', () => {
    it('should call $on and successfully close the app', async () => {
      const spy = jest
        .spyOn(service, '$on')
        .mockImplementation(async (_, cb) => cb(() => Promise.resolve()));

      await service.enableShutdownHooks(app);
      expect(app.close).toBeCalledTimes(1);
      expect(service.$on).toBeCalledTimes(1);
      spy.mockRestore();
    });
  });
});

import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '../database/prisma.service';
describe('DatabaseModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(PrismaService)).toBeInstanceOf(PrismaService);
  });
});

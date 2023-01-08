import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database/database.module';
import { FileController } from './file.controller';
import { FileModule } from './file.module';
import { FileService } from './file.service';
describe('FileModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [FileModule, DatabaseModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(FileController)).toBeInstanceOf(FileController);
    expect(module.get(FileService)).toBeInstanceOf(FileService);
  });
});

import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database/database.module';
import { ProductModule } from './product.module';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
describe('ProductModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [ProductModule, DatabaseModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(ProductResolver)).toBeInstanceOf(ProductResolver);
    expect(module.get(ProductService)).toBeInstanceOf(ProductService);
  });
});

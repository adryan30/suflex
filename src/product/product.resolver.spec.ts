import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Product } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../database/prisma.service';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

describe('ProductResolver', () => {
  let productResolver: ProductResolver;
  let prisma: DeepMockProxy<PrismaClient>;
  const sampleProductNames = [
    'acerola',
    'banana',
    'figo',
    'abacate',
    'goiaba',
    'carambola',
    'damasco',
    'jaca',
    'jambo',
    'laranja',
  ];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [ProductResolver, ProductService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    productResolver = app.get<ProductResolver>(ProductResolver);
    prisma = app.get(PrismaService);
  });

  describe('Products Query', () => {
    let testProducts: Product[];
    beforeEach(() => {
      testProducts = Array(10).map((_, i) => {
        return {
          id: i,
          name: sampleProductNames[i],
          days_to_expire: Math.round(Math.random()),
        };
      });
    });

    it('should list products', () => {
      prisma.product.findMany.mockResolvedValueOnce(testProducts);
      expect(productResolver.products()).resolves.toBe(testProducts);
    });

    it('should list products expiring expiring today', () => {
      const expiringProducts: Product[] = testProducts.filter(
        ({ days_to_expire }) => days_to_expire === 0,
      );
      prisma.product.findMany.mockResolvedValueOnce(expiringProducts);
      expect(productResolver.products({ days_to_expire: 0 })).resolves.toBe(
        expiringProducts,
      );
    });

    it('should list products expiring tomorrow', () => {
      const expiringProducts: Product[] = testProducts.filter(
        ({ days_to_expire }) => days_to_expire === 1,
      );
      prisma.product.findMany.mockResolvedValueOnce(expiringProducts);
      expect(productResolver.products({ days_to_expire: 1 })).resolves.toBe(
        expiringProducts,
      );
    });

    it('should list products alphabetically', () => {
      const alphabeticalProducts: Product[] = testProducts.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

      prisma.product.findMany.mockResolvedValueOnce(alphabeticalProducts);
      expect(productResolver.products({ alphabetical: true })).resolves.toBe(
        alphabeticalProducts,
      );
    });
  });
});

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaService } from '../src/database/prisma.service';
import { AppModule } from './../src/app.module';

describe('Full App (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    prisma = await moduleFixture.resolve(PrismaService);
    await app.init();
  });

  it('/healthcheck (GET)', () => {
    return request(app.getHttpServer())
      .get('/healthcheck')
      .expect(200)
      .expect('ok!');
  });

  describe('/graphql (POST)', () => {
    describe('products', () => {
      it('should list products', async () => {
        const data = {
          query: 'query { products { id, days_to_expire, name } }',
        };

        const res = await request(app.getHttpServer())
          .post('/graphql')
          .send(data)
          .expect(200);
        expect(res.body.data.products).toBeDefined();
        const { products } = res.body.data;
        expect(products.length).toBeGreaterThan(0);
      });

      it('should list products expiring today', async () => {
        const data = {
          query:
            'query Products($daysToExpire: Int) { products(days_to_expire: $daysToExpire) { id, days_to_expire, name } }',
          variables: { daysToExpire: 0 },
        };

        const res = await request(app.getHttpServer())
          .post('/graphql')
          .send(data)
          .expect(200);
        expect(res.body.data.products).toBeDefined();
        const { products } = res.body.data;
        expect(products.length).toBeGreaterThan(0);
        expect(
          products.filter((product) => product.days_to_expire !== 0).length,
        ).toBe(0);
      });

      it('should list products expiring tomorrow', async () => {
        const data = {
          query:
            'query Products($daysToExpire: Int) { products(days_to_expire: $daysToExpire) { id, days_to_expire, name } }',
          variables: { daysToExpire: 1 },
        };

        const res = await request(app.getHttpServer())
          .post('/graphql')
          .send(data)
          .expect(200);
        expect(res.body.data.products).toBeDefined();
        const { products } = res.body.data;
        expect(products.length).toBeGreaterThan(0);
        expect(products.filter((i) => i.days_to_expire !== 1).length).toBe(0);
      });

      it('should list products alphabetically', async () => {
        const data = {
          query:
            'query Products($alphabetical: Boolean) { products(alphabetical: $alphabetical) { id, days_to_expire, name } }',
          variables: { alphabetical: true },
        };
        const dbQuery = await prisma.product.findMany({
          orderBy: { name: 'asc' },
        });
        const res = await request(app.getHttpServer())
          .post('/graphql')
          .send(data)
          .expect(200);
        expect(res.body.data.products).toBeDefined();
        const products: [] = res.body.data.products;
        expect(products.length).toBeGreaterThan(0);
        expect(products).toEqual(dbQuery);
      });
    });
  });

  afterAll(() => {
    app.close();
  });
});

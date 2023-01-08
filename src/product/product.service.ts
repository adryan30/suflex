import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { GetProductArgs } from './dto/get-products.args';

@Injectable()
export class ProductService {
  constructor(private readonly db: PrismaService) {}
  async getProducts(args: GetProductArgs): Promise<Product[]> {
    const { alphabetical, days_to_expire } = args;
    const orderBy: Prisma.ProductOrderByWithAggregationInput[] = [];
    const andWhere: Prisma.ProductWhereInput[] = [];
    if (alphabetical) orderBy.push({ name: 'asc' });
    if (days_to_expire !== null) andWhere.push({ days_to_expire });
    const dbQuery = await this.db.product.findMany({
      orderBy,
      where: { AND: andWhere },
    });
    return dbQuery;
  }
}

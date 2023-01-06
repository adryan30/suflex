import { Args, Query, Resolver } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { GetProductArgs } from './dto/get-products.args';
import { Product } from './models/product.model';

@Resolver((of) => Product)
export class ProductResolver {
  constructor(private readonly db: PrismaService) {}

  @Query(() => [Product])
  products(@Args() { alphabetical, days_to_expire }: GetProductArgs) {
    const orderBy: Prisma.ProductOrderByWithAggregationInput[] = [];
    const andWhere: Prisma.ProductWhereInput[] = [];
    if (alphabetical) orderBy.push({ name: 'asc' });
    if (days_to_expire !== null) andWhere.push({ days_to_expire });
    return this.db.product.findMany({ orderBy, where: { AND: andWhere } });
  }
}

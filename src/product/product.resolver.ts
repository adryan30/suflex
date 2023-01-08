import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetProductArgs } from './dto/get-products.args';
import { Product } from './models/product.model';
import { ProductService } from './product.service';

@Resolver((of) => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product])
  products(@Args() args?: GetProductArgs) {
    return this.productService.getProducts(args || {});
  }
}

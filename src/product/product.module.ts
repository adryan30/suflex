import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ProductResolver, ProductService],
})
export class ProductModule {}

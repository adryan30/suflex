import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';

@Module({
  imports: [],
  controllers: [],
  providers: [ProductResolver],
})
export class ProductModule {}

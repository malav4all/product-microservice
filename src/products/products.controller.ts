import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body() productData: Partial<Product>
  ): Promise<{ message: string } | { error: string }> {
    try {
      await this.productsService.create(productData);
      return { message: 'Product added successfully' };
    } catch (error) {
      return { error: 'Failed to add product. Please try again.' };
    }
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<
    | { data: any; total: number; page: number; limit: number }
    | { error: string }
  > {
    try {
      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      if (isNaN(pageNumber) || pageNumber < 1) {
        throw new Error(
          'Invalid page number. Page must be a positive integer.'
        );
      }
      if (isNaN(limitNumber) || limitNumber < 1) {
        throw new Error(
          'Invalid limit number. Limit must be a positive integer.'
        );
      }

      return await this.productsService.findAll(pageNumber, limitNumber);
    } catch (error) {
      return {
        error:
          error.message ||
          'An error occurred while fetching products. Please try again later.',
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() productData: Partial<Product>
  ): Promise<Product> {
    return this.productsService.update(id, productData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.productsService.delete(id);
  }
}

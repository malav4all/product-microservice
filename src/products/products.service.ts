import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>
  ) {}

  async create(productData: Partial<Product>): Promise<Product> {
    try {
      const product = new this.productModel(productData);
      return await product.save();
    } catch (error) {
      throw new Error('Error saving product: ' + error.message);
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: any; total: number; page: number; limit: number }> {
    try {
      const skip = (page - 1) * limit; // Calculate documents to skip
      const total = await this.productModel.countDocuments().exec(); // Get total number of documents
      const data = await this.productModel
        .find()
        .skip(skip)
        .limit(limit)
        .exec(); // Fetch paginated data

      return { data, total, page, limit };
    } catch (error) {
      throw new Error('Database query failed'); // Throw a specific error for the controller to catch
    }
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, productData, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}

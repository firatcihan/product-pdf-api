import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { instanceToPlain } from 'class-transformer';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    // Convert DTO instance to plain object to avoid Mongoose casting issues
    const plain = instanceToPlain(createProductDto);
    const product = new this.productModel(plain);
    return product.save();
  }

  async findAll(
    filter: any,
    limit: number,
    skip: number,
    sort: any
  ): Promise<ProductDocument[]> {
    return this.productModel
      .find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .exec();
  }

  async count(filter: any): Promise<number> {
    return this.productModel.countDocuments(filter).exec();
  }

  async findOne(id: Types.ObjectId): Promise<ProductDocument | null> {
    return this.productModel.findById(id).exec();
  }

  async findByName(name: string): Promise<ProductDocument | null> {
    return this.productModel.findOne({ name }).exec();
  }

  async update(
    id: Types.ObjectId,
    updateProductDto: UpdateProductDto
  ): Promise<ProductDocument | null> {
    return this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
  }

  async remove(id: Types.ObjectId): Promise<ProductDocument | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }
}

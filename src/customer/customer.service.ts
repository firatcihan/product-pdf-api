import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer, CustomerDocument } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto
  ): Promise<CustomerDocument> {
    const customer = new this.customerModel(createCustomerDto);
    return customer.save();
  }

  async findAll(
    filter: any,
    limit: number,
    skip: number,
    sort: any
  ): Promise<CustomerDocument[]> {
    return this.customerModel
      .find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .exec();
  }

  async count(filter: any): Promise<number> {
    return this.customerModel.countDocuments(filter).exec();
  }

  async findOne(id: Types.ObjectId): Promise<CustomerDocument | null> {
    return this.customerModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<CustomerDocument | null> {
    return this.customerModel.findOne({ email }).exec();
  }

  async update(
    id: Types.ObjectId,
    updateCustomerDto: UpdateCustomerDto
  ): Promise<CustomerDocument | null> {
    return this.customerModel
      .findByIdAndUpdate(id, updateCustomerDto, { new: true })
      .exec();
  }

  async remove(id: Types.ObjectId): Promise<CustomerDocument | null> {
    return this.customerModel.findByIdAndDelete(id).exec();
  }
}

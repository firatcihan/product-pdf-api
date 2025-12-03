import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    // Generate order number
    const orderNumber = await this.generateOrderNumber();
    const order = new this.orderModel({
      ...createOrderDto,
      orderNumber,
    });
    return order.save();
  }

  async findAll(
    filter: any,
    limit: number,
    skip: number,
    sort: any
  ): Promise<OrderDocument[]> {
    return this.orderModel
      .find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .exec();
  }

  async count(filter: any): Promise<number> {
    return this.orderModel.countDocuments(filter).exec();
  }

  async findOne(id: Types.ObjectId): Promise<OrderDocument | null> {
    return this.orderModel.findById(id).exec();
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderDocument | null> {
    return this.orderModel.findOne({ orderNumber }).exec();
  }

  async update(
    id: Types.ObjectId,
    updateOrderDto: UpdateOrderDto
  ): Promise<OrderDocument | null> {
    return this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
  }

  async remove(id: Types.ObjectId): Promise<OrderDocument | null> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }

  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `SO-${year}-`;

    // Find the latest order number for this year
    const latestOrder = await this.orderModel
      .findOne({ orderNumber: { $regex: `^${prefix}` } })
      .sort({ orderNumber: -1 })
      .exec();

    let nextNumber = 1;
    if (latestOrder && latestOrder.orderNumber) {
      const match = latestOrder.orderNumber.match(/SO-\d{4}-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    return `${prefix}${String(nextNumber).padStart(3, '0')}`;
  }
}

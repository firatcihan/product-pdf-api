import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer, OfferDocument } from './entities/offer.entity';

@Injectable()
export class OfferService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<OfferDocument> {
    const offer = new this.offerModel(createOfferDto);
    return offer.save();
  }

  async findAll(
    filter: any,
    limit: number,
    skip: number,
    sort: any
  ): Promise<OfferDocument[]> {
    return this.offerModel
      .find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .exec();
  }

  async count(filter: any): Promise<number> {
    return this.offerModel.countDocuments(filter).exec();
  }

  async findOne(id: Types.ObjectId): Promise<OfferDocument | null> {
    return this.offerModel.findById(id).exec();
  }

  async findByOfferNumber(offerNumber: string): Promise<OfferDocument | null> {
    return this.offerModel.findOne({ offerNumber }).exec();
  }

  async update(
    id: Types.ObjectId,
    updateOfferDto: UpdateOfferDto
  ): Promise<OfferDocument | null> {
    return this.offerModel
      .findByIdAndUpdate(id, updateOfferDto, { new: true })
      .exec();
  }

  async remove(id: Types.ObjectId): Promise<OfferDocument | null> {
    return this.offerModel.findByIdAndDelete(id).exec();
  }
}

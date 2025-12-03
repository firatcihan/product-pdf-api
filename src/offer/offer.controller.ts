import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseObjectIdPipe } from '../utils/objectId.transform';
import { CreateOfferDto } from './dto/create-offer.dto';
import { QueryOfferDto } from './dto/query-offer.dto';
import {
  PagedOfferResponseDto,
  SingleOfferResponseDto,
} from './dto/response-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferService } from './offer.service';

@ApiTags('Offer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  excludePrefixes: ['_', '$'],
  enableCircularCheck: true,
})
@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new offer' })
  @ApiResponse({
    status: 201,
    description: 'Offer created successfully',
    type: SingleOfferResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Offer with this number already exists',
  })
  async create(@Body() createOfferDto: CreateOfferDto) {
    // Check if offer number already exists
    const existingOffer = await this.offerService.findByOfferNumber(
      createOfferDto.offerNumber
    );
    if (existingOffer) {
      throw new ConflictException('Offer with this number already exists');
    }

    const offer = await this.offerService.create(createOfferDto);
    return new SingleOfferResponseDto(offer);
  }

  @Get()
  @ApiOperation({ summary: 'Get all offers with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Offers retrieved successfully',
    type: PagedOfferResponseDto,
  })
  async findAll(@Query() query: QueryOfferDto) {
    const filter = query.convertToQuery();
    const page = query.page ?? 0;
    const limit = query.limit ?? 10;

    // Parse sort string
    let sort: any = { date: -1 }; // Default sort by date descending
    if (query.sort) {
      const [field, order] = query.sort.split(':');
      sort = { [field]: order === 'asc' ? 1 : -1 };
    }

    const offers = await this.offerService.findAll(
      filter,
      limit,
      page * limit,
      sort
    );

    const count = await this.offerService.count(filter);

    return new PagedOfferResponseDto(offers, page, count, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific offer' })
  @ApiResponse({
    status: 200,
    description: 'Offer retrieved successfully',
    type: SingleOfferResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Offer ID',
    required: true,
  })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  async findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const offer = await this.offerService.findOne(id);

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return new SingleOfferResponseDto(offer);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an offer' })
  @ApiResponse({
    status: 200,
    description: 'Offer updated successfully',
    type: SingleOfferResponseDto,
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  @ApiResponse({
    status: 409,
    description: 'Offer with this number already exists',
  })
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateOfferDto: UpdateOfferDto
  ) {
    // Check if offer exists
    const existingOffer = await this.offerService.findOne(id);
    if (!existingOffer) {
      throw new NotFoundException('Offer not found');
    }

    // Check if offer number is being updated and already exists
    if (
      updateOfferDto.offerNumber &&
      updateOfferDto.offerNumber !== existingOffer.offerNumber
    ) {
      const offerWithNumber = await this.offerService.findByOfferNumber(
        updateOfferDto.offerNumber
      );
      if (offerWithNumber && offerWithNumber.id !== id.toHexString()) {
        throw new ConflictException('Offer with this number already exists');
      }
    }

    const offer = await this.offerService.update(id, updateOfferDto);

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return new SingleOfferResponseDto(offer);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an offer' })
  @ApiResponse({ status: 204, description: 'Offer deleted successfully' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  async remove(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const offer = await this.offerService.remove(id);

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
  }
}

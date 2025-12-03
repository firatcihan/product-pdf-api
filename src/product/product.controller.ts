import {
  Body,
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
  UseGuards,
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
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import {
  PagedProductResponseDto,
  SingleProductResponseDto,
} from './dto/response-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: SingleProductResponseDto,
  })
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    return { result: product.toObject() };
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: PagedProductResponseDto,
  })
  async findAll(@Query() query: QueryProductDto) {
    const filter = query.convertToQuery();
    const page = query.page ?? 0;
    const limit = query.limit ?? 10;

    // Parse sort string
    let sort: any = { createdAt: -1 }; // Default sort
    if (query.sort) {
      const [field, order] = query.sort.split(':');
      sort = { [field]: order === 'asc' ? 1 : -1 };
    }

    const products = await this.productService.findAll(
      filter,
      limit,
      page * limit,
      sort
    );

    const count = await this.productService.count(filter);

    return {
      results: products.map((p) => p.toObject()),
      page,
      count,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific product' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: SingleProductResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Product ID',
    required: true,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const product = await this.productService.findOne(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return { result: product.toObject() };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: SingleProductResponseDto,
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateProductDto: UpdateProductDto
  ) {
    const product = await this.productService.update(id, updateProductDto);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return { result: product.toObject() };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const product = await this.productService.remove(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }
  }
}

import {
  Body,
  ClassSerializerInterceptor,
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
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import {
  PagedOrderResponseDto,
  SingleOrderResponseDto,
} from './dto/response-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  excludePrefixes: ['_', '$'],
  enableCircularCheck: true,
})
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: SingleOrderResponseDto,
  })
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.create(createOrderDto);
    return new SingleOrderResponseDto(order);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: PagedOrderResponseDto,
  })
  async findAll(@Query() query: QueryOrderDto) {
    const filter = query.convertToQuery();
    const page = query.page ?? 0;
    const limit = query.limit ?? 10;

    // Parse sort string
    let sort: any = { date: -1 }; // Default sort by date descending
    if (query.sort) {
      const [field, order] = query.sort.split(':');
      sort = { [field]: order === 'asc' ? 1 : -1 };
    }

    const orders = await this.orderService.findAll(
      filter,
      limit,
      page * limit,
      sort
    );

    const count = await this.orderService.count(filter);

    return new PagedOrderResponseDto(orders, page, count, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific order' })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    type: SingleOrderResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Order ID',
    required: true,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const order = await this.orderService.findOne(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return new SingleOrderResponseDto(order);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order' })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
    type: SingleOrderResponseDto,
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    // Check if order exists
    const existingOrder = await this.orderService.findOne(id);
    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    const order = await this.orderService.update(id, updateOrderDto);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return new SingleOrderResponseDto(order);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order' })
  @ApiResponse({ status: 204, description: 'Order deleted successfully' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async remove(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const order = await this.orderService.remove(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }
  }
}

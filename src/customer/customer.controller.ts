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
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import {
  PagedCustomerResponseDto,
  SingleCustomerResponseDto,
} from './dto/response-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('Customer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: SingleCustomerResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Customer with this email already exists',
  })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    // Check if email already exists
    if (createCustomerDto.email) {
      const existingCustomer = await this.customerService.findByEmail(
        createCustomerDto.email
      );
      if (existingCustomer) {
        throw new ConflictException('Customer with this email already exists');
      }
    }

    const customer = await this.customerService.create(createCustomerDto);
    return new SingleCustomerResponseDto(customer);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
    type: PagedCustomerResponseDto,
  })
  async findAll(@Query() query: QueryCustomerDto) {
    const filter = query.convertToQuery();
    const page = query.page ?? 0;
    const limit = query.limit ?? 10;

    // Parse sort string
    let sort: any = { createdAt: -1 }; // Default sort
    if (query.sort) {
      const [field, order] = query.sort.split(':');
      sort = { [field]: order === 'asc' ? 1 : -1 };
    }

    const customers = await this.customerService.findAll(
      filter,
      limit,
      page * limit,
      sort
    );

    const count = await this.customerService.count(filter);

    return new PagedCustomerResponseDto(customers, page, count);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific customer' })
  @ApiResponse({
    status: 200,
    description: 'Customer retrieved successfully',
    type: SingleCustomerResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Customer ID',
    required: true,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const customer = await this.customerService.findOne(id);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return new SingleCustomerResponseDto(customer);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
    type: SingleCustomerResponseDto,
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({
    status: 409,
    description: 'Customer with this email already exists',
  })
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    // Check if customer exists
    const existingCustomer = await this.customerService.findOne(id);
    if (!existingCustomer) {
      throw new NotFoundException('Customer not found');
    }

    // Check if email is being updated and already exists
    if (
      updateCustomerDto.email &&
      updateCustomerDto.email !== existingCustomer.email
    ) {
      const customerWithEmail = await this.customerService.findByEmail(
        updateCustomerDto.email
      );
      if (customerWithEmail && customerWithEmail.id !== id.toHexString()) {
        throw new ConflictException('Customer with this email already exists');
      }
    }

    const customer = await this.customerService.update(id, updateCustomerDto);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return new SingleCustomerResponseDto(customer);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiResponse({ status: 204, description: 'Customer deleted successfully' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async remove(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const customer = await this.customerService.remove(id);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
  }
}

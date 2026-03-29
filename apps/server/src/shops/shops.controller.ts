import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShopsService } from './shops.service';
import { QueryShopsDto } from './dto/query-shops.dto';

@ApiTags('Shops')
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all shops' })
  @ApiResponse({ status: 200, description: 'Return all shops.' })
  findAll(@Query() query: QueryShopsDto) {
    return this.shopsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shop by id' })
  @ApiResponse({ status: 200, description: 'Return shop details.' })
  @ApiResponse({ status: 404, description: 'Shop not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shopsService.findOne(id);
  }
}

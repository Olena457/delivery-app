import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { QueryShopsDto } from './dto/query-shops.dto';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get()
  findAll(@Query() query: QueryShopsDto) {
    return this.shopsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shopsService.findOne(id);
  }
}

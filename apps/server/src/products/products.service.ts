import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { ProductSort, QueryProductsDto } from './dto/query-products.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryProductsDto) {
    const shop = await this.prisma.shop.findUnique({
      where: { id: query.shopId },
    });

    if (!shop) {
      throw new NotFoundException(`Shop ${query.shopId} not found`);
    }

    const where: Prisma.ProductWhereInput = {
      shopId: query.shopId,
    };

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.tag) {
      where.tags = {
        contains: query.tag,
        mode: 'insensitive',
      };
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    let orderBy: Prisma.ProductOrderByWithRelationInput = { title: 'asc' };
    switch (query.sort) {
      case ProductSort.PRICE_ASC:
        orderBy = { price: 'asc' };
        break;
      case ProductSort.PRICE_DESC:
        orderBy = { price: 'desc' };
        break;
      case ProductSort.TITLE_ASC:
        orderBy = { title: 'asc' };
        break;
      case ProductSort.TITLE_DESC:
        orderBy = { title: 'desc' };
        break;
      default:
        orderBy = { title: 'asc' };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      hasMore: skip + data.length < total,
    };
  }
}

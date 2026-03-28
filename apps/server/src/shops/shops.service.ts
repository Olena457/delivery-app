import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { QueryShopsDto } from './dto/query-shops.dto';

@Injectable()
export class ShopsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryShopsDto) {
    const where: Prisma.ShopWhereInput = {};

    const min = query.minRating ?? 1;
    const max = query.maxRating ?? 5;
    where.rating = { gte: min, lte: max };

    return this.prisma.shop.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { reviews: true } },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.shop.findUnique({
      where: { id },
      include: {
        _count: { select: { reviews: true } },
      },
    });
  }
}

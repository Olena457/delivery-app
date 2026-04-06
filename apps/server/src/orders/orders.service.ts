import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

const orderInclude = {
  items: {
    include: {
      product: { include: { category: true } },
    },
  },
} as const;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const computed = await this.computeTotalFromLines(dto.items);
    if (Math.abs(computed - dto.totalPrice) > 0.01) {
      throw new BadRequestException(
        'totalPrice does not match line items and catalog prices',
      );
    }

    const user = await this.prisma.user.upsert({
      where: { userEmail: dto.userEmail },
      update: {
        userName: dto.userName,
        userPhone: dto.userPhone,
        address: dto.address,
      },
      create: {
        userEmail: dto.userEmail,
        userName: dto.userName,
        userPhone: dto.userPhone,
        address: dto.address,
      },
    });

    return this.prisma.order.create({
      data: {
        userId: user.id,
        userName: dto.userName,
        userEmail: dto.userEmail,
        userPhone: dto.userPhone,
        address: dto.address,
        totalPrice: dto.totalPrice,
        items: {
          create: dto.items.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
          })),
        },
      },
      include: orderInclude,
    });
  }

  async findHistoryByEmail(email: string) {
    return this.prisma.order.findMany({
      where: { userEmail: email },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: orderInclude,
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  async update(id: number, dto: UpdateOrderDto) {
    await this.findOne(id);

    const itemsPayload = dto.items;
    let totalPrice = dto.totalPrice;

    if (itemsPayload?.length) {
      const computed = await this.computeTotalFromLines(itemsPayload);
      if (
        dto.totalPrice !== undefined &&
        Math.abs(computed - dto.totalPrice) > 0.01
      ) {
        throw new BadRequestException(
          'totalPrice does not match line items and catalog prices',
        );
      }
      totalPrice = computed;
    }

    return this.prisma.$transaction(async (tx) => {
      if (itemsPayload?.length) {
        await tx.orderItem.deleteMany({ where: { orderId: id } });
      }

      return tx.order.update({
        where: { id },
        data: {
          userName: dto.userName,
          userEmail: dto.userEmail,
          userPhone: dto.userPhone,
          address: dto.address,
          ...(totalPrice !== undefined ? { totalPrice } : {}),
          ...(itemsPayload?.length
            ? {
                items: {
                  create: itemsPayload.map((line) => ({
                    productId: line.productId,
                    quantity: line.quantity,
                  })),
                },
              }
            : {}),
        },
        include: orderInclude,
      });
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.order.delete({ where: { id } });
    return { success: true };
  }

  private async computeTotalFromLines(
    lines: { productId: number; quantity: number }[],
  ) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: lines.map((l) => l.productId) } },
    });
    if (products.length !== new Set(lines.map((l) => l.productId)).size) {
      throw new BadRequestException('One or more products were not found');
    }
    const priceById = new Map(products.map((p) => [p.id, p.price]));
    return lines.reduce(
      (sum, line) => sum + (priceById.get(line.productId) ?? 0) * line.quantity,
      0,
    );
  }
}

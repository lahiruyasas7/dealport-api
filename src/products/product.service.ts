import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { Prisma } from 'src/generated/prisma/client';
import { QueryProductDto } from './dtos/query-product.dto';

const productInclude = {
  categories: true,
  tags: true,
} satisfies Prisma.ProductInclude;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto, userId: string) {
    const { categoryIds, tagIds, price, discountedPrice, ...rest } = dto;

    try {
      return await this.prisma.product.create({
        data: {
          ...rest,
          price, // Prisma coerces number -> Decimal automatically here
          discountedPrice: discountedPrice ?? undefined,
          createdById: userId,
          categories: categoryIds
            ? { connect: categoryIds.map((id) => ({ id })) }
            : undefined,
          tags: tagIds ? { connect: tagIds.map((id) => ({ id })) } : undefined,
        },
        include: productInclude,
      });
    } catch (error) {
      // P2025 = related record (category/tag id) not found on connect
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new BadRequestException(
          'One or more categoryIds/tagIds do not exist',
        );
      }
      throw error;
    }
  }

  async findAll(query: QueryProductDto) {
    const { search, status, page = 1, limit = 10 } = query;
 
    const where: Prisma.ProductWhereInput = {
      ...(search && {
        name: { contains: search, mode: 'insensitive' },
      }),
      ...(status && { status }),
    };
 
    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: productInclude,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);
 
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

   async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });
 
    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
 
    return product;
  }
}



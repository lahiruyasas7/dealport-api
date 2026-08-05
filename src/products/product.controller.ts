import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { AuthenticatedUser } from 'src/auth/types/jwt-payload.interface';

@Controller('products')
@UseGuards(JwtAuthGuard) // admin dashboard data — every route here requires login
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.productsService.create(dto, user.id);
  }
}

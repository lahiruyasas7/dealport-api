import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from 'src/generated/prisma/enums';

export class QueryProductDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  // Query params arrive as strings — @Type(() => Number) coerces them.
  // Requires ValidationPipe({ transform: true }) globally (already set in main.ts).
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // hard ceiling — prevents ?limit=999999 from being used as a DoS vector
  limit?: number = 10;

  @IsOptional()
  @IsString()
  categoryId?: string;
}

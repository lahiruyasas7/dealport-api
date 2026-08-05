import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus, StockStatus } from 'src/generated/prisma/enums';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'price must have at most 2 decimal places' },
  )
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discountedPrice?: number;

  @IsOptional()
  @IsBoolean()
  taxIncluded?: boolean = true;

  @IsOptional()
  @IsDateString()
  expirationStart?: string;

  @IsOptional()
  @IsDateString()
  expirationEnd?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @IsBoolean()
  isUnlimited?: boolean = false;

  @IsOptional()
  @IsEnum(StockStatus)
  stockStatus?: StockStatus = StockStatus.IN_STOCK;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean = false;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus = ProductStatus.DRAFT;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  tagIds?: string[];
}

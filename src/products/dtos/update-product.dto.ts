import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// PartialType makes every field optional while keeping the same
// validation rules when a field IS provided — avoids duplicating
// every @IsX decorator for the update case.
export class UpdateProductDto extends PartialType(CreateProductDto) {}

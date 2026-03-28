import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';

export class OrderLineDto {
  @IsInt()
  @Min(1)
  productId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  @MinLength(2)
  userName!: string;

  @IsEmail()
  userEmail!: string;

  @IsString()
  @Matches(/^\d{10,15}$/, {
    message: 'Phone must be 10-15 digits',
  })
  userPhone!: string;

  @IsString()
  @MinLength(5)
  address!: string;

  @IsNumber()
  @IsPositive()
  totalPrice!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  items!: OrderLineDto[];
}

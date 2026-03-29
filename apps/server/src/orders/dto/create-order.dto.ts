import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 1, description: 'ID of the product' })
  @IsInt()
  @Min(1)
  productId!: number;

  @ApiProperty({ example: 2, description: 'Quantity of the items' })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Oleksandr Dovzhenko' })
  @IsString()
  @MinLength(2)
  userName!: string;

  @ApiProperty({ example: 'customer@email.com' })
  @IsEmail()
  userEmail!: string;

  @ApiProperty({
    example: '0991234567',
    description: 'Phone number (10-15 digits)',
  })
  @IsString()
  @Matches(/^\d{10,15}$/, {
    message: 'Phone must be 10-15 digits',
  })
  userPhone!: string;

  @ApiProperty({ example: 'Ukraine, Kyiv, Central St. 5' })
  @IsString()
  @MinLength(5)
  address!: string;

  @ApiProperty({ example: 450.5, description: 'Total price of the order' })
  @IsNumber()
  @IsPositive()
  totalPrice!: number;

  @ApiProperty({
    type: [OrderLineDto],
    description: 'List of ordered products',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  items!: OrderLineDto[];
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Leite Integral Celilac',
    description: 'The name of the product',
  })
  name: string;

  @ApiProperty({
    example: 'Leite integral pasteurizado 1L',
    description: 'The detailed description of the product',
  })
  description: string;

  @ApiProperty({ example: 4.5, description: 'The price of the product' })
  price: number;

  @ApiProperty({
    example: 'partner-uuid-1234',
    description: 'The ID of the partner providing the product',
  })
  partnerId: string;
}

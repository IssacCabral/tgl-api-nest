import { InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength, Min, MinLength } from 'class-validator';

@InputType()
export class CreateGameInput {
  @IsString()
  @IsNotEmpty({message: 'type can not be empty'})
  @MinLength(3)
  @MaxLength(22)
  type: string

  @IsString()
  @MinLength(8)
  @MaxLength(200)
  description: string

  @IsNumber()
  @Min(1)
  range: number

  @IsNumber()
  @Min(1)
  price: number

  @IsNumber()
  @Min(1)
  minAndMaxNumber: number

  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'the color needs to be in a hexadecimal format'
  })
  color: string

}

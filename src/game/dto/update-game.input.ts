import { CreateGameInput } from './create-game.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, Min, MinLength } from 'class-validator';

@InputType()
export class UpdateGameInput extends PartialType(CreateGameInput) {
  @IsString()
  @IsOptional()
  @IsNotEmpty({message: 'type can not be empty'})
  @MinLength(3)
  @MaxLength(22)
  type?: string

  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(200)
  description?: string

  @IsNumber()
  @Min(1)
  @IsOptional()
  range?: number

  @IsNumber()
  @IsOptional()
  @Min(1)
  price?: number

  @IsNumber()
  @IsOptional()
  @Min(1)
  minAndMaxNumber?: number

  @IsString()
  @IsOptional()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'the color needs to be in a hexadecimal format'
  })
  color?: string
}

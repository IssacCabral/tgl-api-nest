import { InputType } from '@nestjs/graphql';
import { IsNumber,Min } from 'class-validator';

@InputType()
export class SetMinCartValue {
  @IsNumber()
  @Min(1)
  minCartValue: number

}

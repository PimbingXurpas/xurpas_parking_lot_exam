import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateNearestEntranceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'name' })
  public name: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: Number, isArray: true, description: 'name' })
  public parking_slot: Array<number>;
}

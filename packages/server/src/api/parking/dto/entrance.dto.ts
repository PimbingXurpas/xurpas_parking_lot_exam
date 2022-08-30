import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateEntranceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'name' })
  public name: string;
}

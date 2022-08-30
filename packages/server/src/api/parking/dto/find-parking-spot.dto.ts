import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { ParkingVehicleSize } from '../enum/parking-size.enum';
export class FindParkingSpotDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(ParkingVehicleSize)
  @ApiProperty({ enum: [ParkingVehicleSize], description: 'vechicleSize' })
  public vechicleSize: ParkingVehicleSize;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'vechicleSize' })
  public entrance: number;
}

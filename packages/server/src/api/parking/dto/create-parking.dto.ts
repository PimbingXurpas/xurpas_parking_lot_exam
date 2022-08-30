import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ParkingAvailability } from '../enum/parking-availability.enum';
import { ParkingVehicleSize } from '../enum/parking-size.enum';
export class CreateParkingDto {

  @IsNotEmpty()
  @IsEnum(ParkingVehicleSize)
  @ApiProperty({ enum: ParkingVehicleSize, description: 'slot_size' })
  public slot_size: ParkingVehicleSize;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'nearest_to_entrance' })
  public nearest_to_entrance: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ParkingAvailability)
  @ApiProperty({
    enum: ParkingAvailability,
    description: 'nearest_to_entrance',
    examples: [ParkingAvailability.Available, ParkingAvailability.UnAvailable],
  })
  public status: ParkingAvailability;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'entrace_id' })
  public entrace_id: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { ParkingAvailability } from 'src/enum/parking-availability.enum';
import { ParkingVehicleSize } from 'src/enum/parking-size.enum';

export class CreateParkingSlotDto {
  @IsNotEmpty()
  @IsEnum(ParkingVehicleSize)
  @ApiProperty({ enum: ParkingVehicleSize, description: 'slot_size' })
  public slot_size: ParkingVehicleSize;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ParkingAvailability)
  @ApiProperty({
    enum: ParkingAvailability,
    description: 'nearest_to_entrance',
    examples: [ParkingAvailability.Available, ParkingAvailability.UnAvailable],
  })
  public status: ParkingAvailability;
}

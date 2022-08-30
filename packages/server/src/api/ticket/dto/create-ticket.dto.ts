import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { ParkingVehicleSize } from 'src/enum/parking-size.enum';
import { IsNull } from 'typeorm';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(ParkingVehicleSize)
  @ApiProperty({ enum: [ParkingVehicleSize], description: 'vechicleSize' })
  public vechicleSize: ParkingVehicleSize;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Entrance' })
  public entrance: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'plate_number' })
  public plate_number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'time_in' })
  public time_in: string;

  @ValidateIf((object, value) => value !== null)
  @ApiProperty({ type: String, description: 'time_out' })
  public time_out!: string | null;
}

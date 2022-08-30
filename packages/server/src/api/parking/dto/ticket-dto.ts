import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ParkingVehicleSize } from '../enum/parking-size.enum';

export class TicketDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'ticket_number' })
  public ticket_number: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'slot_size' })
  public slot_size: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'bill' })
  public bill: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'parking_slot_id' })
  public parking_slot_id: number;
}

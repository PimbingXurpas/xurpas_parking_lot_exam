import { PartialType } from '@nestjs/mapped-types';
import { CreateParkingSlotDto } from './create-parking_slot.dto';

export class UpdateParkingSlotDto extends PartialType(CreateParkingSlotDto) {}

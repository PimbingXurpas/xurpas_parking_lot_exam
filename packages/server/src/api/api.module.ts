import { Module } from '@nestjs/common';
import { NearestEntranceModule } from './nearest_entrance/nearest_entrance.module';
import { TicketModule } from './ticket/ticket.module';
import { ParkingSlotModule } from './parking_slot/parking_slot.module';

@Module({
  imports: [NearestEntranceModule, TicketModule, ParkingSlotModule],
})
export class ApiModule {}

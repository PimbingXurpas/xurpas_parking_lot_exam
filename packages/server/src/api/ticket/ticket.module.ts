import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { ParkingSlot } from '../parking_slot/entities/parking_slot.entity';
import { NearestEntrance } from '../nearest_entrance/entities/nearest_entrance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, ParkingSlot, NearestEntrance])],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}

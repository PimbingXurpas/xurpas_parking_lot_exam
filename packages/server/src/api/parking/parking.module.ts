import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entrance } from './entities/entrance.entity';
import { ParkingSlot } from './entities/parking-slot.entity';
import { Ticket } from './entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entrance, ParkingSlot, Ticket])],
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class ParkingModule {}

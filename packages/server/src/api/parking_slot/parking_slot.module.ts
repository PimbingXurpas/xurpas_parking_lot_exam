import { Module } from '@nestjs/common';
import { ParkingSlotService } from './parking_slot.service';
import { ParkingSlotController } from './parking_slot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSlot } from './entities/parking_slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSlot])],
  controllers: [ParkingSlotController],
  providers: [ParkingSlotService],
})
export class ParkingSlotModule {}

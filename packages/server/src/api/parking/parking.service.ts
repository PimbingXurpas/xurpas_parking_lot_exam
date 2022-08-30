import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateParkingDto } from './dto/create-parking.dto';
import { CreateEntranceDto } from './dto/entrance.dto';
import { FindParkingSpotDto } from './dto/find-parking-spot.dto';
import { TicketDto } from './dto/ticket-dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { Entrance } from './entities/entrance.entity';
import { ParkingSlot } from './entities/parking-slot.entity';
import { Ticket } from './entities/ticket.entity';
import { ParkingAvailability } from './enum/parking-availability.enum';
import { ParkingVehicleSize } from './enum/parking-size.enum';

@Injectable()
export class ParkingService {
  @InjectRepository(ParkingSlot)
  private readonly parkingSlotRepository: Repository<ParkingSlot>;

  @InjectRepository(Entrance)
  private readonly entranceRepository: Repository<Entrance>;

  @InjectRepository(Ticket)
  private readonly ticketRepository: Repository<Ticket>;

  async findParkingSpot(findParkingSpotDto: FindParkingSpotDto) {
    const parkingSize = this.parkingSlot(findParkingSpotDto.vechicleSize);
    const parkingSlot = await this.parkingSlotRepository.findOne({
      where: {
        slot_size: In(parkingSize),
        status: ParkingAvailability.Available,
        entrace_id: findParkingSpotDto.entrance,
      },

      order: { nearest_to_entrance: 'ASC' },
    });
    if (parkingSlot == null) {
      throw new NotFoundException('No Available Parking Slot');
    }
    const ticket = new TicketDto();
    ticket.slot_size = parkingSlot.slot_size;
    ticket.bill = 40;
    ticket.parking_slot_id = parkingSlot.id;

    parkingSlot.status = ParkingAvailability.UnAvailable;
    this.parkingSlotRepository.save(parkingSlot);
    return this.ticketRepository.save(ticket);
  }

  async unPark(ticketId: number) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['parkingSlot'],
    });
    if (ticket == null) {
      throw new NotFoundException('Ticket Not Found');
    }

    let diffHour = this.diff_hours(ticket.created_at, new Date());
    let isExceed24hrs = false;

    while (diffHour >= 24) {
      ticket.bill += 5000;
      diffHour -= 24;
      isExceed24hrs = true;
    }

    if (diffHour > 3 || isExceed24hrs) {
      for (let i = 0; i < diffHour - 3; i++) {
        switch (ticket.slot_size) {
          case ParkingVehicleSize.Small:
            ticket.bill += 20;
            break;
          case ParkingVehicleSize.Medium:
            ticket.bill += 60;
            break;
          case ParkingVehicleSize.Large:
            ticket.bill += 100;
            break;
        }
      }
    }

    ticket.parkingSlot.status = ParkingAvailability.Available;
    await this.parkingSlotRepository.save(ticket.parkingSlot);
    return this.ticketRepository.save(ticket);
  }

  diff_hours(dt2: Date, dt1: Date) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  }

  parkingSlot(vehicleSize: ParkingVehicleSize) {
    switch (vehicleSize) {
      case ParkingVehicleSize.Medium:
        return [ParkingVehicleSize.Medium, ParkingVehicleSize.Large];
      case ParkingVehicleSize.Large:
        return [ParkingVehicleSize.Large];
      default:
        return [
          ParkingVehicleSize.Small,
          ParkingVehicleSize.Medium,
          ParkingVehicleSize.Large,
        ];
    }
  }
  createParking(createParking: CreateParkingDto) {
    return this.parkingSlotRepository.save(createParking);
  }
  createEntrance(createEntrance: CreateEntranceDto) {
    return this.entranceRepository.save(createEntrance);
  }
}

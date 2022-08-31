import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParkingAvailability } from 'src/enum/parking-availability.enum';
import { ParkingVehicleSize } from 'src/enum/parking-size.enum';
import { In, Repository } from 'typeorm';
import { NearestEntrance } from '../nearest_entrance/entities/nearest_entrance.entity';
import { ParkingSlot } from '../parking_slot/entities/parking_slot.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketService {
  @InjectRepository(Ticket)
  private readonly ticketRepository: Repository<Ticket>;

  @InjectRepository(ParkingSlot)
  private readonly parkingSlotRepository: Repository<ParkingSlot>;

  @InjectRepository(NearestEntrance)
  private readonly nearestEntranceRepository: Repository<NearestEntrance>;

  async create(createTicketDto: CreateTicketDto) {
    const ticketExist = await this.ticketRepository.findOne({
      where: { plate_number: createTicketDto.plate_number },
      order: { id: 'DESC' },
    });

    const parkingSize = this.parkingSlot(createTicketDto.vechicleSize);
    const nearestEntrance = await this.nearestEntranceRepository.findOne({
      where: {
        name: createTicketDto.entrance,
      },
    });
    if (nearestEntrance == null) {
      throw new NotFoundException('Invalid entrance Name');
    }
    const parkingSlot = await this.parkingSlotRepository.find({
      where: {
        id: In(nearestEntrance.parking_slot),
        slot_size: In(parkingSize),
        status: ParkingAvailability.Available,
      },
    });
    if (parkingSlot == null || parkingSlot.length == 0) {
      throw new NotFoundException('No Available Parking Slot');
    }
    parkingSlot.sort(
      (a, b) =>
        nearestEntrance.parking_slot.indexOf(a.id) -
        nearestEntrance.parking_slot.indexOf(b.id),
    );

    if (ticketExist && !ticketExist.time_out) {
      throw new NotAcceptableException('Vehicle is still in Parking lot');
    }

    const ticket = new Ticket();
    ticket.plate_number = createTicketDto.plate_number;
    ticket.bill = 40;
    ticket.parking_slot_id = parkingSlot[0].id;
    parkingSlot[0].status = ParkingAvailability.UnAvailable;
    ticket.time_in = new Date(createTicketDto.time_in);

    if (ticketExist) {
      let diffHour = this.diff_hours(
        ticketExist.time_out,
        ticket.time_in,
        false,
      );
      console.log(diffHour);
      if (diffHour < 1) {
        ticket.bill = 0;
      }
    }

    const value = await this.ticketRepository.save(ticket);

    this.parkingSlotRepository.save(parkingSlot[0]);
    return await this.ticketRepository.findOne({
      where: { id: value.id },
      relations: ['parkingSlot'],
    });
    // return this.ticketRepository.save(createTicketDto);
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
  findAll() {
    return this.ticketRepository.find({
      relations: ['parkingSlot'],
      order: { id: 'ASC' },
    });
  }

  findOne(id: number) {
    return this.ticketRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: id },
      relations: ['parkingSlot'],
    });

    if (ticket == null) {
      throw new NotFoundException('Ticket Not Found');
    }

    ticket.time_out = new Date(updateTicketDto.time_out);
    ticket.plate_number = updateTicketDto.plate_number;
    ticket.time_in = new Date(updateTicketDto.time_in);
    let diffHour = this.diff_hours(ticket.time_in, ticket.time_out, true);
    if (ticket.bill == 0) {
      const firstTicket = await this.ticketRepository.find({
        where: { plate_number: ticket.plate_number },
        relations: ['parkingSlot'],
        order: { id: 'desc' },
        take: 2,
      });

      diffHour = this.diff_hours(firstTicket[1].time_in, ticket.time_out, true);
      this.invalidDate(firstTicket[1].time_in, ticket.time_out);
    }

    console.log(diffHour);
    let isExceed24hrs = false;
    this.invalidDate(ticket.time_in, ticket.time_out);
    while (diffHour >= 24) {
      ticket.bill += 5000;
      diffHour -= 24;
      isExceed24hrs = true;
    }

    if (diffHour > 3 || isExceed24hrs) {
      for (let i = 0; i < diffHour - 3; i++) {
        switch (ticket.parkingSlot.slot_size) {
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

  diff_hours(dt2: Date, dt1: Date, isRoundOff: boolean) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    console.log(Math.abs(diff));
    if (isRoundOff) return Math.ceil(Math.abs(diff));
    return Math.abs(diff);
  }
  invalidDate(time_in: Date, time_out: Date) {
    if (time_in > time_out) {
      throw new NotAcceptableException('Time out must grater than Time in');
    }
  }
  remove(id: number) {
    return this.ticketRepository.delete(id);
  }
}

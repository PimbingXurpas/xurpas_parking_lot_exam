import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParkingSlotDto } from './dto/create-parking_slot.dto';
import { UpdateParkingSlotDto } from './dto/update-parking_slot.dto';
import { ParkingSlot } from './entities/parking_slot.entity';

@Injectable()
export class ParkingSlotService {
  @InjectRepository(ParkingSlot)
  private readonly parkingSlotRepository: Repository<ParkingSlot>;

  create(createParkingSlotDto: CreateParkingSlotDto) {
    return this.parkingSlotRepository.save(createParkingSlotDto);
  }

  findAll() {
    return this.parkingSlotRepository.find({ order: { id: 'ASC' } });
  }

  findOne(id: number) {
    return this.parkingSlotRepository.findOne({ where: { id: id } });
  }

  update(id: number, updateParkingSlotDto: UpdateParkingSlotDto) {
    return this.parkingSlotRepository.update(id, updateParkingSlotDto);
  }

  remove(id: number) {
    return this.parkingSlotRepository.delete(id);
  }
}

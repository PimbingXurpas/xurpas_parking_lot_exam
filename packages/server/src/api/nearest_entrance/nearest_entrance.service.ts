import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNearestEntranceDto } from './dto/create-nearest_entrance.dto';
import { UpdateNearestEntranceDto } from './dto/update-nearest_entrance.dto';
import { NearestEntrance } from './entities/nearest_entrance.entity';

@Injectable()
export class NearestEntranceService {
  @InjectRepository(NearestEntrance)
  private readonly NearestEntranceRepository: Repository<NearestEntrance>;

  create(createNearestEntranceDto: CreateNearestEntranceDto) {
    return this.NearestEntranceRepository.save(createNearestEntranceDto);
  }

  findAll() {
    return this.NearestEntranceRepository.find({ order: { id: 'ASC' } });
  }

  findOne(id: number) {
    return this.NearestEntranceRepository.findOne({ where: { id: id } });
  }

  update(id: number, updateNearestEntranceDto: UpdateNearestEntranceDto) {
    return this.NearestEntranceRepository.update(id, updateNearestEntranceDto);
  }

  remove(id: number) {
    return this.NearestEntranceRepository.delete(id);
  }
}

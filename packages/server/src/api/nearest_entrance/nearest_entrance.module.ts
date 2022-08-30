import { Module } from '@nestjs/common';
import { NearestEntranceService } from './nearest_entrance.service';
import { NearestEntranceController } from './nearest_entrance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NearestEntrance } from './entities/nearest_entrance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NearestEntrance])],
  controllers: [NearestEntranceController],
  providers: [NearestEntranceService],
})
export class NearestEntranceModule {}

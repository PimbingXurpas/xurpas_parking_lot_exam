import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import { FindParkingSpotDto } from './dto/find-parking-spot.dto';
import { CreateEntranceDto } from './dto/entrance.dto';
import { TicketDto } from './dto/ticket-dto';

@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post()
  FindParkingSpot(@Body() FindParkingSpotDto: FindParkingSpotDto) {
    return this.parkingService.findParkingSpot(FindParkingSpotDto);
  }

  @Post('/add')
  createParking(@Body() createParking: CreateParkingDto) {
    return this.parkingService.createParking(createParking);
  }

  @Post('/entrance')
  createEntrance(@Body() createEntrance: CreateEntranceDto) {
    return this.parkingService.createEntrance(createEntrance);
  }
  @Post('/unPark/:ticketId')
  unPark(@Param('ticketId') ticketId: number) {
    return this.parkingService.unPark(ticketId);
  }
}

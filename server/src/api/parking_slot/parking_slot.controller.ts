import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParkingSlotService } from './parking_slot.service';
import { CreateParkingSlotDto } from './dto/create-parking_slot.dto';
import { UpdateParkingSlotDto } from './dto/update-parking_slot.dto';

@Controller('parking-slot')
export class ParkingSlotController {
  constructor(private readonly parkingSlotService: ParkingSlotService) {}

  @Post()
  create(@Body() createParkingSlotDto: CreateParkingSlotDto) {
    return this.parkingSlotService.create(createParkingSlotDto);
  }

  @Get()
  findAll() {
    return this.parkingSlotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parkingSlotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParkingSlotDto: UpdateParkingSlotDto) {
    return this.parkingSlotService.update(+id, updateParkingSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parkingSlotService.remove(+id);
  }
}

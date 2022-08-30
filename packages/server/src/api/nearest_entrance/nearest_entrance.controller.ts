import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NearestEntranceService } from './nearest_entrance.service';
import { CreateNearestEntranceDto } from './dto/create-nearest_entrance.dto';
import { UpdateNearestEntranceDto } from './dto/update-nearest_entrance.dto';

@Controller('nearest-entrance')
export class NearestEntranceController {
  constructor(private readonly nearestEntranceService: NearestEntranceService) {}

  @Post()
  create(@Body() createNearestEntranceDto: CreateNearestEntranceDto) {
    return this.nearestEntranceService.create(createNearestEntranceDto);
  }

  @Get()
  findAll() {
    return this.nearestEntranceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nearestEntranceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNearestEntranceDto: UpdateNearestEntranceDto) {
    return this.nearestEntranceService.update(+id, updateNearestEntranceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nearestEntranceService.remove(+id);
  }
}

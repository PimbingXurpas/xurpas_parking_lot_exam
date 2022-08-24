import { PartialType } from '@nestjs/mapped-types';
import { CreateNearestEntranceDto } from './create-nearest_entrance.dto';

export class UpdateNearestEntranceDto extends PartialType(CreateNearestEntranceDto) {}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ParkingAvailability } from '../enum/parking-availability.enum';
import { ParkingVehicleSize } from '../enum/parking-size.enum';
import { Entrance } from './entrance.entity';
@Entity('ParkingSlot')
export class ParkingSlot {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ enum: ParkingVehicleSize, type: 'varchar' })
  public slot_size: ParkingVehicleSize;

  @Column({ type: 'int' })
  public nearest_to_entrance: number;

  @Column({ enum: ParkingAvailability, type: 'varchar' })
  public status: ParkingAvailability;

  @Column({ type: 'int', select: false })
  public entrace_id: number;

  @ManyToOne(() => Entrance, (entrance) => entrance.id)
  @JoinColumn({ name: 'entrace_id' })
  public entrance: Entrance;
}

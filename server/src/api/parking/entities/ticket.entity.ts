import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ParkingVehicleSize } from '../enum/parking-size.enum';
import { ParkingSlot } from './parking-slot.entity';
@Entity('Ticket')
export class Ticket {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ enum: ParkingVehicleSize, type: 'varchar' })
  public slot_size: string;

  @Column({ type: 'int' })
  public bill: number;

  @Column({ type: 'int', select: false })
  public parking_slot_id: number;

  @ManyToOne(() => ParkingSlot, (p) => p.id)
  @JoinColumn({ name: 'parking_slot_id' })
  public parkingSlot: ParkingSlot;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}

import { ParkingSlot } from 'src/api/parking_slot/entities/parking_slot.entity';
import { ParkingVehicleSize } from 'src/enum/parking-size.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'int' })
  public bill: number;

  @Column({ type: 'varchar' })
  public plate_number: string;

  @Column({ type: 'int', select: false })
  public parking_slot_id: number;

  @ManyToOne(() => ParkingSlot, (p) => p.id)
  @JoinColumn({ name: 'parking_slot_id' })
  public parkingSlot: ParkingSlot;

  @Column({ type: 'timestamp' })
  public time_in: Date;

  @Column({ type: 'timestamp', nullable: true })
  public time_out: Date;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}

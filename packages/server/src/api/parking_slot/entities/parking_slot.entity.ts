import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ParkingSlot {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public slot_size: string;

  @Column({ type: 'varchar' })
  public status: string;
}

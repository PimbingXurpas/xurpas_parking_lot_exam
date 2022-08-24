import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NearestEntrance {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public name: string;

  @Column('int', { array: true })
  public parking_slot: Array<number>;
}

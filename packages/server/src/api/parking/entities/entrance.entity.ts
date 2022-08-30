import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('Entrance')
export class Entrance {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public name: string;
}

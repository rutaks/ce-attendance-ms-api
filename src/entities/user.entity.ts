import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Audit from '../shared/interface/audit.entity';

@Entity()
export class User extends Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', unique: false, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', unique: false, nullable: true })
  lastName: string;

  @Column({ unique: true, nullable: false })
  slug: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { Gender } from '../enums/gender.enum';
import Audit from '../shared/interface/audit.entity';

@Entity({ name: 'users' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User extends Audit {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @Generated('uuid')
  uuid: string;

  @ApiProperty()
  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @ApiProperty()
  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @ApiProperty()
  @Column({ unique: true, nullable: false })
  slug: string;

  @ApiProperty()
  @Column({ name: 'date_of_birth', nullable: true })
  dateOfBirth: Date;

  @ApiProperty()
  @Column('text', { nullable: true })
  gender: Gender;

  @ApiProperty()
  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @ApiProperty()
  @Column({ nullable: true })
  email: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventType } from '../enums/event-type.dto';
import Audit from '../shared/interface/audit.entity';
import { EventAttendance } from './event-attendance.entity';

@Entity()
export class Event extends Audit {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @Generated('uuid')
  uuid: string;

  @ApiProperty()
  @Column({ nullable: false })
  name: string;

  @ApiProperty()
  @Column('text', { nullable: false })
  type: EventType;

  @ApiProperty()
  @Column({ nullable: false, type: 'timestamptz' })
  startTime: Date;

  @ApiProperty()
  @Column({ nullable: false, type: 'timestamptz' })
  endTime: Date;

  @OneToMany(() => EventAttendance, (eventAttendance) => eventAttendance.event)
  eventAttendances: EventAttendance[];
}

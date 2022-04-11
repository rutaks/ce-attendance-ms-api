import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Audit from '../shared/interface/audit.entity';
import { Event } from './event.entity';
import { Member } from './member.entity';

@Entity('event_attendance')
export class EventAttendance extends Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, (event) => event.eventAttendances)
  event: Event;

  @ManyToOne(() => Member, (member) => member.eventAttendances)
  member: Member;
}

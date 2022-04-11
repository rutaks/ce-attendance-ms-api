import { ChildEntity, OneToMany } from 'typeorm';
import { EventAttendance } from './event-attendance.entity';
import { User } from './user.entity';

@ChildEntity()
export class Member extends User {
  @OneToMany(() => EventAttendance, (eventAttendance) => eventAttendance.member)
  eventAttendances: EventAttendance[];
}

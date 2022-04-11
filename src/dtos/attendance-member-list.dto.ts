import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../entities/member.entity';

export class AttendanceMemberListDto {
  @ApiProperty()
  member: Member;

  @ApiProperty()
  attendedOn: Date;
}

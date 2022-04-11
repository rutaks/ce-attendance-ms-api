import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class EventAttendanceDto {
  @ApiProperty()
  @IsUUID()
  readonly memberUuid: string;

  @ApiProperty()
  @IsUUID()
  readonly eventUuid: string;
}

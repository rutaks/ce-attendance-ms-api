import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { EventType } from '../enums/event-type.dto';

export class EventDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: EventType,
    examples: [EventType.CHURCH_SERVICE, EventType.MEETING],
  })
  @IsEnum(EventType, { message: 'Invalid event type' })
  type: EventType;

  @ApiProperty()
  @IsDateString()
  startTime: Date;

  @ApiProperty()
  @IsDateString()
  endTime: Date;
}

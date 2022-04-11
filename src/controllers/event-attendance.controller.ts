import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { EventAttendanceDto } from '../dtos/event-attendance.dto';
import { EventDto } from '../dtos/event.dto';
import { EventAttendanceService } from '../services/event-attendance.service';
import { GenericResponse } from '../shared/interface/generic-response.interface';
import { getGenericResponseSchema } from '../shared/util/swagger.util';

@ApiTags('Event Attendances')
@Controller('event-attendances')
@UsePipes(new ValidationPipe({ transform: true }))
export class EventAttendanceController {
  constructor(private eventAttendanceService: EventAttendanceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiExtraModels(EventAttendanceDto)
  @ApiOkResponse({ ...getGenericResponseSchema(EventAttendanceDto) })
  async createEventAttendanceInstance(@Body() dto: EventAttendanceDto) {
    const results =
      await this.eventAttendanceService.createEventAttendanceInstance(dto);
    return { results, message: '' };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(EventDto)
  @ApiOkResponse({ ...getGenericResponseSchema(EventDto) })
  async removeMemberFromEventAttendance(
    @Param('memberUuid') memberUuid: string,
    @Param('eventUuid') eventUuid: string,
  ): Promise<GenericResponse<void>> {
    const results =
      await this.eventAttendanceService.removeMemberFromEventAttendance(
        memberUuid,
        eventUuid,
      );
    return { results, message: '' };
  }
}

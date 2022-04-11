import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AttendanceMemberListDto } from '../dtos/attendance-member-list.dto';
import { EventDto } from '../dtos/event.dto';
import { GenericPaginatedResultDto } from '../dtos/generic-paginated-results.dto';
import { Event } from '../entities/event.entity';
import { EventAttendanceService } from '../services/event-attendance.service';
import { EventService } from '../services/event.service';
import { GenericResponse } from '../shared/interface/generic-response.interface';
import {
  getGenericResponseSchema,
  getPaginatedSchema,
} from '../shared/util/swagger.util';

@ApiTags('Events')
@Controller('events')
@UsePipes(new ValidationPipe({ transform: true }))
export class EventController {
  constructor(
    private eventService: EventService,
    private eventAttendanceService: EventAttendanceService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(Event)
  @ApiOkResponse({ ...getPaginatedSchema(Event) })
  async findEvents(
    @Query() queryStr: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<GenericResponse<GenericPaginatedResultDto<Event>>> {
    const results = await this.eventService.findEvents(
      {
        limit: limit || 10,
        page: page || 1,
      },
      queryStr,
    );
    return { results, message: '' };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiExtraModels(EventDto)
  @ApiOkResponse({ ...getGenericResponseSchema(EventDto) })
  async createEvent(@Body() dto: EventDto) {
    const results = await this.eventService.createEvent(dto);
    return { results, message: '' };
  }

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(Event)
  @ApiOkResponse({ ...getGenericResponseSchema(Event) })
  async getEventByUuid(
    @Param('uuid') uuid: string,
  ): Promise<GenericResponse<Event>> {
    const results = await this.eventService.findEventByUuid(uuid);
    return { results, message: '' };
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(EventDto)
  @ApiOkResponse({ ...getGenericResponseSchema(EventDto) })
  async modifyEvent(
    @Param('uuid') uuid: string,
    @Body() dto: EventDto,
  ): Promise<GenericResponse<Event>> {
    const results = await this.eventService.modifyEvent(uuid, dto);
    return { results, message: '' };
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(EventDto)
  @ApiOkResponse({ ...getGenericResponseSchema(EventDto) })
  async removeEvent(
    @Param('uuid') uuid: string,
  ): Promise<GenericResponse<void>> {
    const results = await this.eventService.removeEvent(uuid);
    return { results, message: '' };
  }

  @Get(':uuid/members')
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(Event)
  @ApiOkResponse({ ...getPaginatedSchema(Event) })
  async findEventAttendanceList(
    @Param('uuid') uuid: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<
    GenericResponse<GenericPaginatedResultDto<AttendanceMemberListDto>>
  > {
    const results = await this.eventAttendanceService.findEventAttendanceList(
      uuid,
      {
        limit: limit || 10,
        page: page || 1,
      },
    );
    return { results, message: '' };
  }
}

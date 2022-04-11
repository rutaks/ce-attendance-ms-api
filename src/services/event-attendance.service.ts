import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { AttendanceMemberListDto } from '../dtos/attendance-member-list.dto';
import { EventAttendanceDto } from '../dtos/event-attendance.dto';
import { GenericPaginatedResultDto } from '../dtos/generic-paginated-results.dto';
import { EventAttendance } from '../entities/event-attendance.entity';
import { EventService } from './event.service';
import { MemberService } from './member.service';

@Injectable()
export class EventAttendanceService {
  constructor(
    @InjectRepository(EventAttendance)
    private eventAttendanceRepo: Repository<EventAttendance>,
    private eventService: EventService,
    private memberService: MemberService,
  ) {}

  /**
   * Creates an instance of a member and an event
   * @param dto object with event & member uuid
   * @returns create attendance instance
   */
  async createEventAttendanceInstance(
    dto: EventAttendanceDto,
  ): Promise<EventAttendance> {
    let attendance: EventAttendance =
      await this.findAttendanceByMemberUuidAndEventUuidAndState(
        dto?.memberUuid,
        dto?.eventUuid,
      );

    if (!!attendance) {
      attendance = { ...attendance, isDeleted: false };
    } else {
      const event = await this.eventService.findEventByUuid(dto?.eventUuid);
      const member = await this.memberService.findMemberByUuid(dto?.memberUuid);
      attendance = { ...new EventAttendance(), event, member };
    }

    return this.eventAttendanceRepo.save(attendance);
  }

  /**
   * Finds members list from attendance
   * @param uuid attendance's uuid
   * @param options pagination option
   * @returns Found member list
   */
  async findEventAttendanceList(
    uuid: string,
    options: IPaginationOptions<any>,
  ): Promise<GenericPaginatedResultDto<AttendanceMemberListDto>> {
    const queryBuilder = this.eventAttendanceRepo.createQueryBuilder('ea');
    queryBuilder.leftJoin('ea.event', 'e');
    queryBuilder.leftJoinAndSelect('ea.member', 'm');
    queryBuilder.where('e.uuid = :uuid', { uuid });
    queryBuilder.andWhere('e.isDeleted = :isDeleted', { isDeleted: false });

    const { items, meta } = await paginate<EventAttendance>(
      queryBuilder,
      options,
    );

    console.log('items', items);

    const mappedAttendance: AttendanceMemberListDto[] = items.map((i) => ({
      member: i.member,
      attendedOn: i.createdOn,
    }));
    return { data: mappedAttendance, meta };
  }

  /**
   * Finds an attendance instance by member and event
   * @param memberUuid member's uuid
   * @param eventUuid event's uuid
   * @returns Found attendance instance
   */
  async findAttendanceByMemberUuidAndEventUuidAndState(
    memberUuid: string,
    eventUuid: string,
    isDeleted?: boolean,
  ): Promise<EventAttendance> {
    const queryBuilder = this.eventAttendanceRepo.createQueryBuilder('ea');
    queryBuilder.leftJoin('ea.event', 'e');
    queryBuilder.leftJoin('ea.member', 'm');
    queryBuilder.where('m.uuid = :uuid', { uuid: memberUuid });
    queryBuilder.andWhere('e.uuid = :uuid', { uuid: eventUuid });
    if (isDeleted !== undefined) {
      queryBuilder.andWhere('ea.isDeleted = :isDeleted', { isDeleted });
    }
    const attendance = await queryBuilder.getOne();
    return attendance;
  }

  /**
   * Removes an attendance instance
   * @param memberUuid member's uuid
   * @param eventUuid event's uuid
   */
  async removeMemberFromEventAttendance(memberUuid: string, eventUuid: string) {
    const attendance =
      await this.findAttendanceByMemberUuidAndEventUuidAndState(
        memberUuid,
        eventUuid,
        false,
      );

    if (!attendance) {
      throw new NotFoundException();
    }
    await this.eventAttendanceRepo.save({ ...attendance, isDeleted: true });
  }
}

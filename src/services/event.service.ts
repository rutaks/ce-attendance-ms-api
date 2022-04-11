import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { ExtendedQueryBuilder } from 'typeorm-query-builder-extended';
import { EventDto } from '../dtos/event.dto';
import { GenericPaginatedResultDto } from '../dtos/generic-paginated-results.dto';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
  ) {}

  /**
   * Finds event in a paginated result,
   * generates results based on query string filters
   * @param options pagination options
   * @param queryStr query string used for filter and sorting
   * @returns filtered & paginated results
   */
  async findEvents(
    options: IPaginationOptions<any>,
    queryStr: string | any,
  ): Promise<GenericPaginatedResultDto<Event>> {
    const queryBuilder = this.eventRepo.createQueryBuilder('e');
    const builder = new ExtendedQueryBuilder(queryBuilder, queryStr, [
      'limit',
      'page',
    ]);
    const { items, meta } = await paginate<Event>(builder.build(), options);
    return { data: items, meta };
  }

  /**
   * Finds an existing entity by its uuid
   * @param uuid existing entity
   * @returns found event
   */
  async findEventByUuid(uuid: string) {
    const event = await this.eventRepo.findOne({
      where: { uuid, isDeleted: false },
    });
    if (!event) throw new NotFoundException('');
    return event;
  }

  /**
   * Creates a new event
   * @param dto event's properties
   * @returns created event
   */
  async createEvent(dto: EventDto): Promise<Event> {
    return this.eventRepo.save({ ...new Event(), ...dto });
  }

  /**
   * Finds & modifies an event
   * @param uuid event's uuid
   * @param dto event's new properties
   * @returns modified event
   */
  async modifyEvent(uuid: string, dto: EventDto): Promise<Event> {
    const event = await this.findEventByUuid(uuid);
    return this.eventRepo.save({ ...event, ...dto });
  }

  /**
   * Removes existing event
   * @param uuid event's uuid
   */
  async removeEvent(uuid: string): Promise<void> {
    const event = await this.findEventByUuid(uuid);
    await this.eventRepo.save({ ...event, isDeleted: true });
  }
}

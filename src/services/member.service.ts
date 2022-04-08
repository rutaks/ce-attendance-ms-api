import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { Member } from '../entities/member.entity';
import { generateSlug } from '../shared/util/string.util';

export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) {}

  /**
   * Gets list of members in a pagination manner
   * @param options pagination options
   * @param queryStr query search options
   * @returns Found Members
   */
  async getMembers(options: IPaginationOptions<any>, queryStr: string | any) {
    delete queryStr['limit'];
    delete queryStr['page'];
    const queryBuilder = this.memberRepo.createQueryBuilder('member');
    // const builder = new ExtendedQueryBuilder(queryBuilder, queryStr);
    const { items, meta } = await paginate<Member>(queryBuilder, options);
    return { data: items, meta };
  }

  /**
   * Creates a member
   * @param dto properties of the new member
   * @returns created member
   */
  async createMember(dto: CreateMemberDto): Promise<Member> {
    const slug = generateSlug(`${dto?.firstName} ${dto.lastName}`);
    return await this.memberRepo.save({ ...new Member(), ...dto, slug });
  }

  /**
   * Modifies member's details
   * @param uuid member's identifier
   * @param dto member's details
   * @returns Modified Member
   */
  async modifyMember(uuid: string, dto: CreateMemberDto): Promise<Member> {
    const member = await this.findMemberByUuid(uuid);
    return await this.memberRepo.save({ ...member, ...dto });
  }

  /**
   * Removes Member
   * @param uuid members identifier
   */
  async removeMember(uuid: string): Promise<void> {
    const member = await this.findMemberByUuid(uuid);
    await this.memberRepo.save({ ...member, isDeleted: true });
  }

  /**
   * Finds member by its uuid
   * @param uuid member's uuid
   * @returns Found member
   */
  async findMemberByUuid(uuid: string): Promise<Member> {
    const member = await this.memberRepo.findOne({ where: { uuid } });
    console.log('member', member);

    if (!member) {
      throw new NotFoundException('');
    }
    return member;
  }
}

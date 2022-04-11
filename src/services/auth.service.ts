import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { RegisterMemberWithAccountDto } from '../dtos/register-member-with-account.dto';
import { AuthRole } from '../entities/auth-role.entity';
import { Auth } from '../entities/auth.entity';
import { Member } from '../entities/member.entity';
import { Role } from '../enums/role.enum';
import { generateRandomPassword } from '../shared/util/string.util';
import { RolesRequestDto } from '../dtos/roles-request';
import { MemberService } from './member.service';
import { RolesAssignmentDto } from '../dtos/roles-assignment-response.dto';
import { AccountCreationResponse } from '../dtos/account-creation-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private connection: Connection,
    @InjectRepository(Auth)
    private authRepo: Repository<Auth>,
    @InjectRepository(AuthRole)
    private authRoleRepo: Repository<AuthRole>,
    private memberService: MemberService,
  ) {}

  /**
   * Creates a user and assigns a role to the user
   * @param dto request dto
   * @returns Created user
   */
  async createNewMemberAndAccount(
    dto: RegisterMemberWithAccountDto,
  ): Promise<AccountCreationResponse> {
    return this.connection.transaction(async (manager) => {
      const generatedPassword = generateRandomPassword().toString();
      //   Create member
      const member: Member = await manager.save(Member, {
        ...new Member(),
        ...dto?.userDetails,
      });
      //   Create Member's account
      const auth: Auth = await manager.save(Auth, {
        ...new Auth(),
        username: dto?.userDetails?.email,
        password: await bcrypt.hash(generateRandomPassword().toString(), 10),
        user: member,
      });
      //   Assign member's role to account
      await manager.save(AuthRole, {
        ...new AuthRole(),
        role: dto.role,
        auth,
      });

      return { generatedPassword };
    });
  }

  /**
   * Create account for existing member
   * @param dto user's details
   * @returns created user
   */
  async createAccount(userUuid: string): Promise<AccountCreationResponse> {
    return this.connection.transaction(async (manager) => {
      const generatedPassword = generateRandomPassword().toString();
      //   Create member
      const member: Member = await this.memberService.findMemberByUuid(
        userUuid,
      );
      //   Create Member's account
      await manager.save(Auth, {
        ...new Auth(),
        username: member?.email,
        password: await bcrypt.hash(generatedPassword, 10),
        user: member,
      });

      return { generatedPassword };
    });
  }

  /**
   * Creates the account of a member that already exists in the system
   * @param userUuid the member's  uuid
   * @param dto body holding the user's new role
   */
  async addRolesToAccount(
    userUuid: string,
    dto: RolesRequestDto,
  ): Promise<RolesAssignmentDto> {
    const failedRoles = [];
    const successfulRoles = [];
    const foundAccount = await this.findAuthByUserUuid(userUuid);

    for (const role of dto?.roles) {
      if (await this.isAuthRoleExist(foundAccount?.id, role)) {
        failedRoles.push({ role, error: 'User already has the role' });
        continue;
      }

      await this.authRoleRepo.save({
        ...new AuthRole(),
        auth: foundAccount,
        role: role,
      });
      successfulRoles.push(role);
    }

    return { failedRoles, successfulRoles };
  }

  /**
   * Removes role from account
   * @param userUuid the member's  uuid
   * @param dto list of roles to remove
   */
  async removeRolesFromAccount(
    userUuid: string,
    dto: RolesRequestDto,
  ): Promise<void> {
    const foundAccount = await this.findAuthByUserUuid(userUuid);

    for (const role of dto?.roles) {
      const authRole = await this.findAuthRoleByAuthIdAndRole(
        foundAccount?.id,
        role,
      );

      await this.authRoleRepo.save({ ...authRole, isDeleted: true });
    }
  }

  /**
   * Finds if an auth's role exists by the auth id
   * @param authId the auth ID
   * @param role the role of the auth
   * @returns boolean if whether entity was found
   */
  async isAuthRoleExist(authId: number, role: Role): Promise<boolean> {
    const count = await this.authRoleRepo.count({
      where: { auth: { id: authId }, role, isDeleted: false },
      relations: ['auth'],
    });
    return count > 0;
  }

  async findAuthRoleByAuthIdAndRole(authId: number, role: Role) {
    const authRole = await this.authRoleRepo.findOne({
      where: { auth: { id: authId, isDeleted: false }, isDeleted: false, role },
      relations: ['auth'],
    });

    if (!authRole) {
      throw new NotFoundException('');
    }

    return authRole;
  }

  /**
   * Finds Auth by user's uuid
   * @param userUuid user's uuid
   * @returns found user
   */
  async findAuthByUserUuid(userUuid: string): Promise<Auth> {
    const auth = await this.authRepo.findOne({
      where: { user: { uuid: userUuid, isDeleted: false }, isDeleted: false },
      relations: ['user'],
    });

    if (!auth) {
      throw new NotFoundException('');
    }

    return auth;
  }

  /**
   * Find user roles by user's uuid
   * @param userUuid user's uuid
   * @returns Found User's UUID
   */
  async findAuthRolesByUserUuid(userUuid: string): Promise<AuthRole[]> {
    const auth = await this.findAuthByUserUuid(userUuid);

    return this.authRoleRepo.find({
      where: { auth: { id: auth?.id } },
      relations: ['auth'],
    });
  }
}

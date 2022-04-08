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
import { CreateMemberDto } from '../dtos/create-member.dto';
import { RolesAssignmentDto } from '../dtos/roles-assignment-response.dto';
import { RolesRequestDto } from '../dtos/roles-request';
import { AuthRole } from '../entities/auth-role.entity';
import { Member } from '../entities/member.entity';
import { AuthService } from '../services/auth.service';
import { MemberService } from '../services/member.service';
import { GenericResponse } from '../shared/interface/generic-response.interface';
import {
  getArraySchema,
  getGenericResponseSchema,
  getPaginatedSchema,
} from '../shared/util/swagger.util';

@ApiTags('Members')
@Controller('members')
@UsePipes(new ValidationPipe({ transform: true }))
export class MemberController {
  constructor(
    private authService: AuthService,
    private memberService: MemberService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(Member)
  @ApiOkResponse({ ...getPaginatedSchema(Member) })
  async getMembers(
    @Query() queryStr: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<GenericResponse<any>> {
    const results = await this.memberService.getMembers(
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
  @ApiExtraModels(CreateMemberDto)
  @ApiOkResponse({ ...getGenericResponseSchema(CreateMemberDto) })
  async createMember(@Body() dto: CreateMemberDto) {
    const results = await this.memberService.createMember(dto);
    return { results, message: '' };
  }

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(Member)
  @ApiOkResponse({ ...getGenericResponseSchema(Member) })
  async getMemberByUuid(
    @Param('uuid') uuid: string,
  ): Promise<GenericResponse<Member>> {
    const results = await this.memberService.findMemberByUuid(uuid);
    return { results, message: '' };
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(CreateMemberDto)
  @ApiOkResponse({ ...getGenericResponseSchema(CreateMemberDto) })
  async modifyMember(
    @Param('uuid') uuid: string,
    @Body() dto: CreateMemberDto,
  ): Promise<GenericResponse<Member>> {
    const results = await this.memberService.modifyMember(uuid, dto);
    return { results, message: '' };
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(CreateMemberDto)
  @ApiOkResponse({ ...getGenericResponseSchema(CreateMemberDto) })
  async removeMember(
    @Param('uuid') uuid: string,
  ): Promise<GenericResponse<void>> {
    const results = await this.memberService.removeMember(uuid);
    return { results, message: '' };
  }

  @Get(':uuid/roles')
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(AuthRole)
  @ApiOkResponse({ ...getArraySchema(AuthRole) })
  async getAccountRoles(
    @Param('uuid') userUuid: string,
  ): Promise<GenericResponse<AuthRole[]>> {
    const results = await this.authService.findAuthRolesByUserUuid(userUuid);
    return { results, message: '' };
  }

  @Post(':uuid/roles')
  @HttpCode(HttpStatus.CREATED)
  async addRolesToAccount(
    @Param('uuid') userUuid: string,
    @Body() roleDto: RolesRequestDto,
  ): Promise<GenericResponse<RolesAssignmentDto>> {
    const results = await this.authService.addRolesToAccount(userUuid, roleDto);
    return { results, message: '' };
  }

  @Delete(':uuid/roles')
  @HttpCode(HttpStatus.OK)
  async removeRolesFromAccount(
    @Param('uuid') userUuid: string,
    @Body() roleDto: RolesRequestDto,
  ): Promise<GenericResponse<void>> {
    const results = await this.authService.removeRolesFromAccount(
      userUuid,
      roleDto,
    );
    return { results, message: '' };
  }
}

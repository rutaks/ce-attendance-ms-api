import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum';
import { CreateUserDto } from './create-user.dto';

export class RegisterMemberWithAccountDto {
  @ApiProperty({ type: CreateUserDto })
  @Type(() => CreateUserDto)
  userDetails: CreateUserDto;

  @IsEnum(Role, { message: 'Invalid Role' })
  role: Role;
}

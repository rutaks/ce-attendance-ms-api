import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum';

export class RolesRequestDto {
  @ApiProperty()
  @ArrayUnique()
  @IsEnum(Role, { message: 'Invalid Role', each: true })
  readonly roles: Role[];
}

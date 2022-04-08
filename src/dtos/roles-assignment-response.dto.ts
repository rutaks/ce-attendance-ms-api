import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

export class RolesAssignmentDto {
  @ApiProperty()
  failedRoles: { role: Role; error: string }[];

  @ApiProperty()
  successfulRoles: Role[];
}

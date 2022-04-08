import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../enums/role.enum';
import Audit from '../shared/interface/audit.entity';
import { Auth } from './auth.entity';

@Entity('auth_role')
export class AuthRole extends Audit {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column('text')
  role: Role;

  @ManyToOne(() => Auth, (auth) => auth.authRoles)
  auth: Auth;
}

import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Audit from '../shared/interface/audit.entity';
import { AuthRole } from './auth-role.entity';
import { User } from './user.entity';

@Entity()
export class Auth extends Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => AuthRole, (authRole) => authRole.auth)
  authRoles: AuthRole[];
}

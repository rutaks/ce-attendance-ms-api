import { ChildEntity } from 'typeorm';
import { User } from './user.entity';

@ChildEntity()
export class Member extends User {}

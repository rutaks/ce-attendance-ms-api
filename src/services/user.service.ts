import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import { generateSlug } from '../shared/util/string.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(userDto: CreateUserDto) {
    const slug = generateSlug(`${userDto?.firstName} ${userDto.lastName}`);
    return await this.userRepo.save({ ...new User(), ...userDto, slug });
  }
  //   modify() {}
  //   findOne() {}
  //   findMany() {}
}

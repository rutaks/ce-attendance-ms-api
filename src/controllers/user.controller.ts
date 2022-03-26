import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { GenericResponse } from '../shared/interface/generic-response.interface';
import { getGenericResponseSchema } from '../shared/util/swagger.util';

@ApiTags('Users')
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'User created',
    ...getGenericResponseSchema(User),
  })
  @ApiBadRequestResponse({})
  @ApiExtraModels(User)
  async createBanner(
    @Body() dto: CreateUserDto,
  ): Promise<GenericResponse<User>> {
    const results = await this.userService.create(dto);
    return { message: 'User created', results };
  }
}

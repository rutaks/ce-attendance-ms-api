import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccountCreationResponse } from '../dtos/account-creation-response.dto';
import { RolesRequestDto } from '../dtos/roles-request';
import { AuthService } from '../services/auth.service';
import { GenericResponse } from '../shared/interface/generic-response.interface';
import { getArraySchema } from '../shared/util/swagger.util';

@ApiTags('Authentication')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(':uuid')
  @HttpCode(HttpStatus.CREATED)
  @ApiExtraModels(AccountCreationResponse)
  @ApiOkResponse({ ...getArraySchema(AccountCreationResponse) })
  async createAccount(
    @Param('uuid') userUuid: string,
  ): Promise<GenericResponse<AccountCreationResponse>> {
    console.log('userUuid', userUuid);

    const results = await this.authService.createAccount(userUuid);

    return { results, message: '' };
  }
}

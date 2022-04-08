import { ApiProperty } from '@nestjs/swagger';

export class AccountCreationResponse {
  @ApiProperty()
  generatedPassword: string;
}

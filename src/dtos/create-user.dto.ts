import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Date of birth is not valid' })
  dateOfBirth: Date;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber(null, {
    message:
      'Phone number is invalid, must include area code & must not be empty',
  })
  phoneNumber: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class CreateMemberDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty({ message: 'First name is not valid' })
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty({ message: 'Last name is not valid' })
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Gender, { message: 'Gender is not valid' })
  gender: Gender;

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

  @ApiProperty()
  @IsOptional()
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;
}

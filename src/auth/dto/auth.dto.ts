import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterAuthDto extends AuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  afm: string;
}

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditUserDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  afm?: string;
}

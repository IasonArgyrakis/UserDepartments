import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  id?: number;
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
  @IsNotEmpty({ message: 'smth' })
  lastName?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  afm?: string;
}

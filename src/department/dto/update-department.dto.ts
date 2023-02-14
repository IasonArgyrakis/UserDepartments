import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from './create-department.dto';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDepartmentDto extends PartialType(
  CreateDepartmentDto,
) {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

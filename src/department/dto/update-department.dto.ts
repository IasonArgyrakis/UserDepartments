import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from './create-department.dto';
import { IsInt } from 'class-validator';

export class UpdateDepartmentDto extends PartialType(
  CreateDepartmentDto,
) {
  @IsInt()
  id: number;
}

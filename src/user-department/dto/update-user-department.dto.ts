import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDepartmentDto } from './create-user-department.dto';

export class UpdateUserDepartmentDto extends PartialType(
  CreateUserDepartmentDto,
) {}
